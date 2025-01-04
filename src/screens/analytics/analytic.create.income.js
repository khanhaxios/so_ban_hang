import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import React, {useLayoutEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {copyImage, formatCurrency, getRandomSubset, SH} from "../../ultis/helper";
import {Box, Button, Center, HStack, Pressable, ScrollView, Text, VStack} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Alert, Image, TextInput, ToastAndroid} from "react-native";
import {appDatabaseService, moneySources, types} from "../../core/app.database";
import * as ImagePicker from "expo-image-picker";
import {BottomSheet} from "../../components/layout/bottomsheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    AddNewSourceModal,
    AddNewTypeModal,
    FormInput,
    FormSelect,
    IncomeTypeItem,
    IncomeTypeItemEditable
} from "./analytic.create.out.going";

const initState = {
    cost: 0,
    incomeType: {
        id: -1, name: 'Chưa phân loại'
    },
    moneySource: {
        id: -1, name: "Chọn để phân loại nguồn tiền"
    },
    note: '',
    createdAt: new Date().getTime(),
    image: null
}
const AnalyticCreateIncome = () => {
    const [formData, setFormData] = useState(initState);
    const [incomeType, setIncomeType] = useState([]);
    const [moneySource, setMoneySource] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [guestData, setGuestData] = useState({income: [], money: []});
    const [showNewTypeModal, setShowNewTypeModal] = useState(false);
    const [showNewMoneySourceModal, setShowNewMoneySourceModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingSrc, setEditingSrc] = useState(false);

    const nav = useNavigation();
    const showInComeTypeValue = useSharedValue(-SH);
    const incomeTypeStyle = useAnimatedStyle(() => ({
        right: withTiming(showInComeTypeValue.value, {duration: 200})
    }));

    const showMoneySourceValue = useSharedValue(-SH);
    const showMoneySourceStyle = useAnimatedStyle(() => ({
        right: withTiming(showMoneySourceValue.value, {duration: 200})
    }))
    const handleGoBack = () => {
        nav.goBack();
    }
    const Header = () => {
        return (
            <HStack px={4} py={2} backgroundColor={'white'} justifyContent="space-between" alignItems="center">
                <Button variant="ghost" onPress={() => nav.goBack()}>
                    <Ionicons
                        name={"chevron-back-outline"}
                        color={"black"}
                        size={24}
                    />
                </Button>
                <Text bold fontSize={"lg"}>
                    Khoản chi
                </Text>
                <Button variant="ghost"></Button>
            </HStack>
        )
    }
    const handleChange = (name, value) => {
        setFormData({...formData, [name]: value});
    }
    const isValidForm = (data) => {
        if (!data.cost || isNaN(data.cost) || data.cost <= 0) {
            ToastAndroid.show("Số tiền sai đinh dạng", ToastAndroid.LONG);
            return false;
        }
        return true;
    }
    const handleComplete = async () => {
        try {
            if (isValidForm(formData)) {
                const uri = await copyImage(formData.image);
                const finalData = {
                    note: formData.note || '',
                    createdAt: new Date(formData.createdAt).getTime() || new Date().getTime(),
                    incomeTypeId: formData.incomeType.id === -1 ? 1 : formData.incomeType.id,
                    moneySourceId: formData.moneySource.id === -1 ? 1 : formData.moneySource.id,
                    image: uri || null,
                    type: 1,
                    cost: formData.cost || 0
                }

                const db = await appDatabaseService.getConnection();
                const stm = await appDatabaseService.createInsertStatement(db, "inout", finalData);
                // get cost
                await stm.executeAsync(appDatabaseService.createInsertStatementArgs(finalData));

                await db.execAsync(`UPDATE moneySource SET cost = cost - ${finalData.cost} WHERE id = ${finalData.moneySourceId}`);
                ToastAndroid.show("Thêm khoản thu thành công", ToastAndroid.LONG);
                nav.goBack();
            }
        } catch (e) {
            console.log(e);
        }
    }
    const handleSetSelectedIncome = (item) => {
        setFormData({...formData, incomeType: item});
        handleCloseChoseIncomeType();
    }
    const handleSetSelectedMoney = (item) => {
        setFormData({...formData, moneySource: item});
        handleCloseChoseMoneySource();
    }
    const handleChoseIncomeType = () => {
        handleCloseChoseMoneySource();
        showInComeTypeValue.value = 0;
    }
    const handleCloseChoseIncomeType = () => {
        showInComeTypeValue.value = -SH;
    }
    const handleChoseMoneySource = () => {
        handleCloseChoseIncomeType()
        showMoneySourceValue.value = 0;
    }
    const handleCloseChoseMoneySource = () => {
        showMoneySourceValue.value = -SH;
    }
    const IncomeTypeBottomSheetContent = () => {
        const [query, setQuery] = useState('');
        const [temp, setTemp] = useState([]);
        const ListHeader = () => {
            return (
                <Text>{'Danh sách phân loại'}</Text>
            )
        }

        const handleClose = () => editing ? setEditing(false) : handleCloseChoseIncomeType();
        const handleDelete = async (item) => {
            try {
                if (types.includes(item.name)) {
                    ToastAndroid.show("Phân loại của hệ thống không thể xóa", ToastAndroid.LONG);
                    return;
                }
                Alert.alert("Xác nhận", "bạn có chắc muốn xóa phân loại này?", [
                    {
                        style: 'default', text: "Không", onPress: () => {
                        }
                    }, {
                        style: 'destructive', text: 'Xóa', onPress: async () => {
                            const db = await appDatabaseService.getConnection();
                            await db.execAsync('delete from incomeType where id =' + item.id);
                            ToastAndroid.show("Đã xóa phân loại", ToastAndroid.LONG);
                            await initData();
                        }
                    }
                ]);
            } catch (e) {
                ToastAndroid.show("Phân loại tồn tại khoản thu chi không thể xóa", ToastAndroid.LONG);
            }
        }
        const handleSearch = async () => {
            const temp = [];
            if (query === '') {
                setTemp(incomeType);
            }
            for (let t of incomeType) {
                if (t.name.toLowerCase().includes(query.toLowerCase())) {
                    temp.push(t);
                }
            }
            setTemp(temp);
        }
        useLayoutEffect(() => {
            setTemp(incomeType);
        }, [])
        return (
            <VStack py={5} px={6} space={3}>
                {/* header */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Pressable style={{width: '33%'}}>
                        <Pressable onPress={() => setEditing(true)}>
                            {!editing && (
                                <HStack space={2} alignItems={'center'}>
                                    <Ionicons name={'pencil'} size={20} color={'blue'}/>
                                    <Text color={'blue.500'} fontSize={18}>Chỉnh sửa</Text>
                                </HStack>
                            )}
                        </Pressable>
                    </Pressable>
                    <Text textAlign={'center'} width={'33%'} fontWeight={'bold'}
                          fontSize={22}>{editing ? 'Chỉnh sửa' : 'Phân loại'}</Text>
                    <Pressable style={{width: '33%'}} onPress={handleClose}>
                        <HStack justifyContent={'flex-end'}>
                            <Ionicons name={'close'} size={30} color={'black'}/>
                        </HStack>
                    </Pressable>
                </HStack>
                {/*    search */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <HStack space={2} background={'gray.100'} alignItems={'center'} px={3} py={2} borderRadius={4}>
                        <Ionicons name={'search-outline'} size={20} color={'black'}/>
                        <TextInput returnKeyType={'search'} onSubmitEditing={handleSearch} onChangeText={(t) => {
                            setQuery(t)
                        }} style={{width: '80%', backgroundColor: 'transparent'}}
                                   placeholder={'Tìm tên phân loại'}/>

                    </HStack>
                    <Pressable onPress={() => setShowNewTypeModal(true)} style={{
                        padding: 10,
                        borderRadius: 4,
                        backgroundColor: 'blue'
                    }}>
                        <Ionicons name={'add'} color={'white'} size={22}/>
                    </Pressable>
                </HStack>
                {/*    content*/}
                <ListHeader/>
                <ScrollView showsVerticalScrollIndicator={false} style={{height: '75%'}}
                            contentContainerStyle={{paddingBottom: 20}}>
                    {editing ? (
                        <VStack space={1}>
                            {temp.map((item, index) => (
                                <IncomeTypeItemEditable key={index.toString()} handleDelete={handleDelete}
                                                        item={item}/>))}
                        </VStack>
                    ) : (
                        <HStack flexWrap={'wrap'} space={1}>
                            {temp.map((ic, index) => <IncomeTypeItem key={index.toString()}
                                                                     handleSelected={handleSetSelectedIncome}
                                                                     item={ic}/>)}
                        </HStack>
                    )}
                </ScrollView>
            </VStack>
        )
    }
    const MoneySourceTypeSheetContent = () => {
        const [query, setQuery] = useState('');
        const [temp, setTemp] = useState([]);
        const ListHeader = () => {
            return (
                <Text>Danh sách nguồn tiền</Text>
            )
        }

        const handleDelete = async (item) => {
            try {
                if (moneySources.includes(item.name)) {
                    ToastAndroid.show("Nguồn tiền của hệ thống không thể xóa", ToastAndroid.LONG);
                    return;
                }
                Alert.alert("Xác nhận", "bạn có chắc muốn xóa nguồn tiền này?", [
                    {
                        style: 'default', text: "Không", onPress: () => {
                        }
                    }, {
                        style: 'destructive', text: 'Xóa', onPress: async () => {
                            const db = await appDatabaseService.getConnection();
                            await db.execAsync('delete from moneySource where id =' + item.id);
                            ToastAndroid.show("Đã xóa nguồn tiền", ToastAndroid.LONG);
                            await initData();
                        }
                    }
                ]);
            } catch (e) {
                ToastAndroid.show("Phân loại tồn tại khoản thu chi không thể xóa", ToastAndroid.LONG);
            }
        }
        const handleSearch = async () => {
            const temp = [];
            if (query === '') {
                setTemp(moneySource);
            }
            for (let t of moneySource) {
                if (t.name.toLowerCase().includes(query.toLowerCase())) {
                    temp.push(t);
                }
            }
            setTemp(temp);
        }
        const handleClose = () => editingSrc ? setEditingSrc(false) : handleCloseChoseMoneySource();
        useLayoutEffect(() => {
            setTemp(moneySource);
        }, [])
        return (
            <VStack py={5} px={6} space={3}>
                {/* header */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Pressable style={{width: '33%'}}>
                        {!editingSrc && (
                            <Pressable onPress={() => setEditingSrc(true)}>
                                <HStack space={2} alignItems={'center'}>
                                    <Ionicons name={'pencil'} size={20} color={'blue'}/>
                                    <Text color={'blue.500'} fontSize={18}>Chỉnh sửa</Text>
                                </HStack>
                            </Pressable>
                        )}
                    </Pressable>
                    <Text textAlign={'center'} width={'33%'} fontWeight={'bold'} fontSize={22}>Nguồn tiền</Text>
                    <Pressable style={{width: '33%'}}
                               onPress={handleClose}>
                        <HStack justifyContent={'flex-end'}>
                            <Ionicons name={'close'} size={30} color={'black'}/>
                        </HStack>
                    </Pressable>
                </HStack>
                {/*    search */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <HStack space={2} background={'gray.100'} alignItems={'center'} px={3} py={2} borderRadius={4}>
                        <Ionicons name={'search-outline'} size={20} color={'black'}/>
                        <TextInput onSubmitEditing={handleSearch} returnKeyType={'search'}
                                   onChangeText={(t) => setQuery(t)}
                                   style={{width: '80%', backgroundColor: 'transparent'}}
                                   placeholder={'Tìm kiếm nguồn tiền'}/>
                    </HStack>
                    <Pressable onPress={() => setShowNewMoneySourceModal(true)} style={{
                        padding: 10,
                        borderRadius: 4,
                        backgroundColor: 'blue'
                    }}>
                        <Ionicons name={'add'} color={'white'} size={22}/>
                    </Pressable>
                </HStack>
                <ListHeader/>
                <ScrollView showsVerticalScrollIndicator={false} style={{height: '75%'}}
                            contentContainerStyle={{paddingBottom: 20}}>
                    {editingSrc ? (
                        <VStack space={1}>
                            {temp.map((item, index) => (
                                <IncomeTypeItemEditable key={index.toString()} handleDelete={handleDelete}
                                                        item={item}/>))}
                        </VStack>
                    ) : (
                        <HStack flexWrap={'wrap'} space={1}>
                            {temp.map((ic, index) => <IncomeTypeItem key={index.toString()}
                                                                     handleSelected={handleSetSelectedIncome}
                                                                     item={ic}/>)}
                        </HStack>
                    )}
                </ScrollView>
            </VStack>
        )
    }
    const initData = async () => {
        const db = await appDatabaseService.getConnection();
        setIncomeType(await db.getAllAsync('select * from incomeType'));
        setMoneySource(await db.getAllAsync('select * from moneySource'));
    }
    const onChange = (event, selectedDate) => {
        setShowDatePicker(false);
        const currentDate = selectedDate || currentDate;
        setFormData({...formData, createdAt: currentDate});
    };
    const handleChoseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            legacy: true,
            allowsEditing: true
        });
        if (result.canceled) {
            return;
        }
        setFormData({...formData, image: result.assets[0].uri});
    }
    useLayoutEffect(() => {
        initData().then();
    }, []);

    useLayoutEffect(() => {
        setGuestData({income: getRandomSubset(incomeType, 3), money: getRandomSubset(moneySource, 2)})
    }, [incomeType, moneySource]);

    return <AppContainer>
        <VStack space={3}>
            <Header/>
            <HStack space={2} justifyContent={'center'} alignItems={'flex-start'}>
                <VStack width={'48%'} space={2}>
                    <VStack space={2} backgroundColor={'white'}>
                        <Pressable onPress={() => setShowDatePicker(true)}>
                            <HStack px={4} py={2} backgroundColor={'gray.200'} space={3} alignItems={'center'}>
                                <Ionicons name={'calendar-outline'} size={24} color={'blue'}/>
                                <Text fontSize={22}
                                      color={'blue.700'}>{new Date(formData.createdAt).toLocaleDateString()}</Text>
                                <Ionicons name={'chevron-down'} color={'blue'} size={24}/>
                            </HStack>
                        </Pressable>

                        <FormInput
                            formatter={formatCurrency}
                            name={'cost'}
                            kt={'numeric'}
                            required={true}
                            label={'Nhập số tiền'}
                            hint={'vd: 131212323'}
                            value={formData.cost} handleChange={handleChange}/>
                    </VStack>
                    <VStack backgroundColor={'white'} py={3} borderRadius={4}>
                        <FormSelect guessData={guestData.income} handleSelect={handleSetSelectedIncome}
                                    hint={'Chưa phân loại'} selected={formData?.incomeType} label={"Phân loại"}
                                    onPress={handleChoseIncomeType}/>
                        <FormSelect guessData={guestData.money} handleSelect={handleSetSelectedMoney}
                                    hint={'Chọn để phân loại nguồn tiền'}
                                    selected={formData?.moneySource}
                                    label={"Nguồn tiền"}
                                    onPress={handleChoseMoneySource}/>

                    </VStack>
                    <HStack justifyContent={'flex-end'} mt={2} space={6} width={SH / 2}
                            left={0}>
                        <Pressable onPress={() => nav.goBack()}>
                            <Center backgroundColor={'gray.200'} px={12} py={3} shadow={1} borderRadius={6}>
                                <Text>Quay về</Text>
                            </Center>
                        </Pressable>
                        <Pressable onPress={handleComplete}>
                            <Center backgroundColor={'green.500'} px={12} py={3} shadow={1} borderRadius={6}>
                                <Text color={'white'}>Tạo khoản thu</Text>
                            </Center>
                        </Pressable>
                    </HStack>
                </VStack>
                <VStack height={120} width={'48%'} space={2}>
                    <FormInput
                        name={'note'}
                        required={true}
                        mul={true}
                        label={'Ghi chú'}
                        hint={'ví dụ : Hóa đơn điện,nước,...'}
                        value={formData.note} handleChange={handleChange}/>
                    <Box backgroundColor={'white'}>
                        {formData?.image ? (
                            <Image source={{uri: formData.image}}
                                   style={{width: '100%', height: 340, borderRadius: 6, resizeMode: 'cover'}}/>
                        ) : (
                            <HStack alignItems={'center'}>
                                <Pressable onPress={handleChoseImage} style={{padding: 10}}>
                                    <Box shadow={1} padding={4} borderRadius={4} backgroundColor={'white'}>
                                        <Ionicons name={'image-outline'} size={24} color={'gray'}/>
                                    </Box>
                                </Pressable>
                                <Text fontSize={18}>Chọn ảnh cho hóa đơn</Text>
                            </HStack>

                        )}
                    </Box>
                </VStack>
            </HStack>
            <BottomSheet cStyle={incomeTypeStyle}>
                <IncomeTypeBottomSheetContent/>
            </BottomSheet>
            <BottomSheet cStyle={showMoneySourceStyle}>
                <MoneySourceTypeSheetContent/>
            </BottomSheet>
        </VStack>
        <AddNewTypeModal handleSuccess={initData} modalVisible={showNewTypeModal}
                         setModalVisible={setShowNewTypeModal}/>
        <AddNewSourceModal handleSuccess={initData} setModalVisible={setShowNewMoneySourceModal}
                           modalVisible={showNewMoneySourceModal}/>
        {showDatePicker && (
            <DateTimePicker value={new Date(formData.createdAt)}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}/>
        )}

    </AppContainer>
}
export default observer(AnalyticCreateIncome);