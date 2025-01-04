import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {
    Box,
    Button,
    Center,
    FormControl,
    HStack,
    Input,
    Modal,
    NumberInput,
    Pressable, ScrollView,
    Text,
    VStack
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import React, {useLayoutEffect, useState} from "react";
import {copyImage, formatCurrency, getRandomSubset, SH, stringGen} from "../../ultis/helper";
import {BottomSheet} from "../../components/layout/bottomsheet";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Alert, FlatList, Image, TextInput, ToastAndroid} from "react-native";
import {appDatabaseService, moneySources, types} from "../../core/app.database";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

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
const AnalyticCreateOutGoing = () => {
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
                    type: 0,
                    cost: formData.cost || 0
                }

                const db = await appDatabaseService.getConnection();
                const stm = await appDatabaseService.createInsertStatement(db, "inout", finalData);
                // get cost
                await stm.executeAsync(appDatabaseService.createInsertStatementArgs(finalData));

                await db.execAsync(`UPDATE moneySource SET cost = cost - ${finalData.cost} WHERE id = ${finalData.moneySourceId}`);
                ToastAndroid.show("Thêm khoản chi thành công", ToastAndroid.LONG);
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
                                <Text color={'white'}>Tạo khoản chi</Text>
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
export const AddNewTypeModal = ({modalVisible, setModalVisible, handleSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({name: ''});

    const handleAddNew = async () => {
        try {
            if (formData.name && formData.name.trim() !== "") {
                const db = await appDatabaseService.getConnection();
                const stm = await appDatabaseService.createInsertStatement(db, "incomeType", formData);
                await stm.executeAsync(appDatabaseService.createInsertStatementArgs(formData));
                handleSuccess();
                setModalVisible(false)
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header>Thêm phân loại</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormControl.Label>Tên phân loại</FormControl.Label>
                        <Input onChangeText={t => setFormData({name: t})}/>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setFormData({name: ''})
                            setModalVisible(false);
                        }}>
                            Hủy
                        </Button>
                        <Button onPress={handleAddNew}>
                            Lưu
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
export const AddNewSourceModal = ({modalVisible, setModalVisible, handleSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({name: '', cost: 0});
    const handleAddNew = async () => {
        try {
            if (formData.name && formData.name.trim() !== "" && formData.cost > 0) {
                const db = await appDatabaseService.getConnection();
                const stm = await appDatabaseService.createInsertStatement(db, "moneySource", formData);
                stm.executeAsync(appDatabaseService.createInsertStatementArgs(formData));
                handleSuccess();
                setModalVisible(false);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header>Thêm nguồn tiền</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormControl.Label>Tên nguồn tiền</FormControl.Label>
                        <Input defaultValue={formData.name} onChangeText={t => setFormData({...formData, name: t})}/>
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Số tiền</FormControl.Label>
                        <Input defaultValue={formData.cost} keyboardType={'number-pad'}
                               onChangeText={t => setFormData({...formData, cost: parseInt(t)})}/>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setFormData({name: '', cost: 0})
                            setModalVisible(false);
                        }}>
                            Hủy
                        </Button>
                        <Button onPress={handleAddNew}>
                            Lưu
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}

export const FormSelect = ({label, hint, onPress, selected, guessData, handleSelect}) => {
    return (
        <VStack bg="white" px={4} mt={3}>
            <Text fontSize="md">{label}</Text>
            <Pressable style={{marginVertical: 5}} onPress={onPress}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={20} color={selected?.name ? 'black' : 'gray.400'}>{selected?.name || hint}</Text>
                    <Ionicons name={'chevron-down'} color={'gray'} size={20}/>
                </HStack>
            </Pressable>
            <FlatList numColumns={3} data={guessData}
                      renderItem={({item}) => <IncomeTypeItem item={item} handleSelected={handleSelect}/>}/>
        </VStack>
    )
}
export const FormInput = ({label, required, formatter, value, handleChange, name, hint, kt, mul = false}) => {
    return (
        <Box bg="white" px={4} py={4}>
            <Text fontSize="md">{label} {required ? '*' : ''}</Text>
            {formatter && (
                <Text fontSize={'xs'}>{formatter(value)}</Text>
            )}
            <Input
                keyboardType={kt || 'default'}
                placeholder={hint}
                mt={2}
                multiline={mul}
                defaultValue={value}
                onChangeText={(text) => {
                    handleChange(name, text)
                }}
                borderColor={
                    "gray.400"
                }
            />
        </Box>
    )
}
export const IncomeTypeItem = ({item, handleSelected}) => {
    return (
        <Pressable onPress={() => {
            handleSelected(item)
        }} style={{
            marginHorizontal: 6,
            marginVertical: 6,
            paddingVertical: 10, paddingHorizontal: 12,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)'
        }}>
            <Text color={'gray.400'} fontSize={14}>
                {item?.name}
            </Text>
        </Pressable>
    )
}
export const IncomeTypeItemEditable = ({handleDelete, item}) => {
    return (
        <HStack py={2} px={4} justifyContent={'space-between'} alignItems={'center'}>
            <Text color={'gray.500'} fontWeight={'bold'} fontSize={14}>
                {item?.name}
            </Text>
            <Pressable onPress={() => handleDelete(item)}>
                <Ionicons name={'close'} size={20} color={'red'}/>
            </Pressable>
        </HStack>
    )
}

export default observer(AnalyticCreateOutGoing);