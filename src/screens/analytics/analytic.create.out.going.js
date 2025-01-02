import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Box, Button, FormControl, HStack, Input, NumberInput, Pressable, Text, VStack} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import React, {useLayoutEffect, useState} from "react";
import {formatCurrency, getRandomSubset, SH} from "../../ultis/helper";
import {BottomSheet} from "../../components/layout/bottomsheet";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {FlatList, TextInput} from "react-native";
import {appDatabaseService} from "../../core/app.database";
import DateTimePicker from "@react-native-community/datetimepicker";

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

    }
    const handleComplete = async () => {
        try {

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
        const ListHeader = () => {
            return (
                <Text>Danh sách phân loại</Text>
            )
        }

        return (
            <VStack py={5} px={6} space={3}>
                {/* header */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Pressable style={{width: '33%'}}>
                        <HStack space={2} alignItems={'center'}>
                            <Ionicons name={'pencil'} size={20} color={'blue'}/>
                            <Text color={'blue.500'} fontSize={18}>Chỉnh sửa</Text>
                        </HStack>
                    </Pressable>
                    <Text textAlign={'center'} width={'33%'} fontWeight={'bold'} fontSize={22}>Phân loại</Text>
                    <Pressable style={{width: '33%'}} onPress={handleCloseChoseIncomeType}>
                        <HStack justifyContent={'flex-end'}>
                            <Ionicons name={'close'} size={30} color={'black'}/>
                        </HStack>
                    </Pressable>
                </HStack>
                {/*    search */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <HStack space={2} background={'gray.100'} alignItems={'center'} px={3} py={2} borderRadius={4}>
                        <Ionicons name={'search-outline'} size={20} color={'black'}/>
                        <TextInput style={{width: '80%', backgroundColor: 'transparent'}}
                                   placeholder={'Tìm tên phân loại'}/>

                    </HStack>
                    <Pressable style={{
                        padding: 10,
                        borderRadius: 4,
                        backgroundColor: 'blue'
                    }}>
                        <Ionicons name={'add'} color={'white'} size={22}/>
                    </Pressable>
                </HStack>
                {/*    content*/}
                <FlatList numColumns={3} ListHeaderComponent={<ListHeader/>} data={incomeType}
                          renderItem={({item}) => <IncomeTypeItem handleSelected={handleSetSelectedIncome}
                                                                  item={item}/>}/>
            </VStack>
        )
    }
    const MoneySourceTypeSheetContent = () => {
        const ListHeader = () => {
            return (
                <Text>Danh sách nguồn tiền</Text>
            )
        }

        return (
            <VStack py={5} px={6} space={3}>
                {/* header */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Pressable style={{width: '33%'}}>
                        <HStack space={2} alignItems={'center'}>
                            <Ionicons name={'pencil'} size={20} color={'blue'}/>
                            <Text color={'blue.500'} fontSize={18}>Chỉnh sửa</Text>
                        </HStack>
                    </Pressable>
                    <Text textAlign={'center'} width={'33%'} fontWeight={'bold'} fontSize={22}>Nguồn tiền</Text>
                    <Pressable style={{width: '33%'}} onPress={handleCloseChoseMoneySource}>
                        <HStack justifyContent={'flex-end'}>
                            <Ionicons name={'close'} size={30} color={'black'}/>
                        </HStack>
                    </Pressable>
                </HStack>
                {/*    search */}
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <HStack space={2} background={'gray.100'} alignItems={'center'} px={3} py={2} borderRadius={4}>
                        <Ionicons name={'search-outline'} size={20} color={'black'}/>
                        <TextInput style={{width: '80%', backgroundColor: 'transparent'}}
                                   placeholder={'Tìm kiếm nguồn tiền'}/>
                    </HStack>
                    <Pressable style={{
                        padding: 10,
                        borderRadius: 4,
                        backgroundColor: 'blue'
                    }}>
                        <Ionicons name={'add'} color={'white'} size={22}/>
                    </Pressable>
                </HStack>
                {/*    content*/}
                <FlatList numColumns={3} ListHeaderComponent={<ListHeader/>} data={moneySource}
                          renderItem={({item}) => <IncomeTypeItem handleSelected={handleSetSelectedMoney}
                                                                  item={item}/>}/>
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
    useLayoutEffect(() => {
        initData().then();
    }, [])
    useLayoutEffect(() => {
        setGuestData({income: getRandomSubset(incomeType, 3), money: getRandomSubset(moneySource, 2)})
    }, [incomeType, moneySource])
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
                </VStack>
                <VStack height={120} width={'48%'} space={2}>
                    <FormInput
                        name={'note'}
                        required={true}
                        mul={true}
                        label={'Ghi chú'}
                        hint={'ví dụ : Hóa đơn điện,nước,...'}
                        value={formData.note} handleChange={handleChange}/>
                </VStack>
            </HStack>
            <BottomSheet cStyle={incomeTypeStyle}>
                <IncomeTypeBottomSheetContent/>
            </BottomSheet>
            <BottomSheet cStyle={showMoneySourceStyle}>
                <MoneySourceTypeSheetContent/>
            </BottomSheet>
        </VStack>
        {showDatePicker && (
            <DateTimePicker value={new Date(formData.createdAt)}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}/>
        )}
    </AppContainer>
}
export const FormSelect = ({label, hint, onPress, selected, guessData, handleSelect}) => {
    return (
        <VStack bg="white" px={4} mt={3}>
            <Text fontSize="md">{label}</Text>
            <Pressable onPress={onPress}>
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

export default observer(AnalyticCreateOutGoing);