import React, {memo, useLayoutEffect, useState} from "react";
import {observer} from "mobx-react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
    Center,
    HStack,
    Text,
    VStack,
    Pressable,
    Image,
    Box, Button,
} from "native-base";
import {AppContainer} from "../../components/layout/container.cpn";
import FilterSection from "../../components/filter/FilterSection.cpn";
import {appDatabaseService} from "../../core/app.database";
import {ActivityIndicator, FlatList} from "react-native";
import {formatCurrency, formatDateByMonth, getDayOfWeek, SH, stringGen, SW} from "../../ultis/helper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {Collapsible} from "../../components/layout/collapsible";
import {BottomSheet} from "../../components/layout/bottomsheet";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

const AnalyticIndexScreen = ({navigation, route}) => {
    const [data, setData] = useState({today: [], monthly: [], prevMonthly: []});
    const [currentDetail, setCurrentDetail] = useState(null);
    const [currentDetailItem, setCurrentDetailItem] = useState(null);
    const [activeTab, setActiveTab] = useState('today');
    const [currentDate, setCurrent] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const focus = useIsFocused();


    const detailSheetValue = useSharedValue(-SW);
    const detailSheetStyle = useAnimatedStyle(() => ({
        right: withTiming(detailSheetValue.value)
    }));
    const detailItemSheetValue = useSharedValue(-SW);
    const detailItemSheetStyle = useAnimatedStyle(() => ({
        left: withTiming(detailItemSheetValue.value)
    }))
    const EmptyDataComponent = () => {
        return (
            <VStack bg={'#F5F5F5'}>
                <Box
                    alignItems="center"

                    p={4}
                    borderRadius="md"
                >
                    <Image
                        source={require('../../../assets/bill.png')}
                        alt="bill icon"
                        size="2xl"
                    />
                    <Text color="#555" fontSize="md" mt={1}>
                        Thu chi dài dòng - ghi lại là xong!
                    </Text>
                </Box>
            </VStack>
        )
    }

    const loadData = async () => {
        if (loading) return;
        setLoading(true);
        setTimeout(async () => {
            setData({today: [], monthly: [], prevMonthly: []})
            const db = await appDatabaseService.getConnection();
            const today = currentDate;
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();
            const query = `SELECT inout.note,inout.image, inout.moneySourceId,inout.incomeTypeId,inout.cost ,inout.createdAt,inout.type, incomeType.name as cname ,moneySource.name as mname FROM inout join moneySource on inout.moneySourceId = moneySource.id join incomeType on inout.incomeTypeId = incomeType.id WHERE createdAt >= ${startOfDay} AND createdAt <= ${endOfDay}`;
            const allTodayOrder = await db.getAllAsync(query);

            const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
            const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

            const queryCurrentMonth = `SELECT inout.note,inout.image , inout.moneySourceId,inout.incomeTypeId,inout.cost ,inout.createdAt,inout.type, incomeType.name as cname ,moneySource.name as mname FROM inout join moneySource on inout.moneySourceId = moneySource.id join incomeType on inout.incomeTypeId = incomeType.id WHERE createdAt >= ${startOfCurrentMonth} AND createdAt <= ${endOfCurrentMonth}`;
            const allCurrentMonthOrders = await db.getAllAsync(queryCurrentMonth);
            const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime();
            const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999).getTime();

            const queryPreviousMonth = `SELECT inout.note,inout.image , inout.moneySourceId,inout.incomeTypeId,inout.cost ,inout.createdAt,inout.type, incomeType.name as cname ,moneySource.name as mname FROM inout join moneySource on inout.moneySourceId = moneySource.id join incomeType on inout.incomeTypeId = incomeType.id WHERE createdAt >= ${startOfPreviousMonth} AND createdAt <= ${endOfPreviousMonth}`;
            const allPreviousMonthOrders = await db.getAllAsync(queryPreviousMonth);
            setData({today: allTodayOrder, monthly: allCurrentMonthOrders, prevMonthly: allPreviousMonthOrders});
            setLoading(false);
        }, 1000)
    }

    const onChange = (event, selectedDate) => {
        setShowDate(false)
        const currentDate = selectedDate || currentDate;
        setCurrent(currentDate);
    };

    const nav = useNavigation();
    const Footer = () => {
        const handleGoInCome = () => {
            nav.navigate('create_income');
        }
        const handleGoOut = () => {
            nav.navigate('create_out_going');
        }
        return (
            <HStack position={'absolute'} width={'100%'} mx={'auto'} bottom={3} left={0}
                    justifyContent={'center'} space={6}
                    alignItems={'center'}>
                <Pressable onPress={handleGoOut}>
                    <HStack alignItems={'center'} space={2} px={8} py={3} background={'orange.600'} borderRadius={4}>
                        <Ionicons name={'arrow-up'} size={24} color={'white'}/>
                        <Text fontWeight={'bold'} fontSize={22} color={'white'}>Khoản chi</Text>
                    </HStack>
                </Pressable>
                <Pressable onPress={handleGoInCome}>
                    <HStack alignItems={'center'} space={2} px={8} py={3} background={'green.600'} borderRadius={4}>
                        <Ionicons name={'arrow-down'} size={24} color={'white'}/>
                        <Text fontWeight={'bold'} fontSize={22} color={'white'}>Khoản thu</Text>
                    </HStack>
                </Pressable>
            </HStack>
        )
    }
    const Header = () => {
        return (
            <HStack justifyContent="space-between" alignItems="center">
                <Button variant="ghost" onPress={() => nav.goBack()}>
                    <Ionicons
                        name={"chevron-back-outline"}
                        color={"black"}
                        size={24}
                    />
                </Button>
                <Text bold fontSize={"lg"}>
                    Thu chi
                </Text>
                <Button variant="ghost">
                    <Ionicons
                        name={"alert-circle-outline"}
                        color={"black"}
                        size={24}
                    />
                </Button>
            </HStack>
        )
    }
    const Filter = () => {
        return (
            <VStack bg="white">
                <HStack justifyContent="space-around">
                    <VStack width={"35%"}>
                        <HStack justifyContent="space-around" px={2}>
                            <FilterSection
                                setShowDate={setShowDate}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                            />
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
        )
    }
    const totalExpense = data[activeTab].filter(item => item.type === 0).reduce((rs, next) => rs + next.cost, 0);
    const totalIncome = data[activeTab].filter(item => item.type === 1).reduce((rs, next) => rs + next.cost, 0);
    const Summary = () => {
        return (
            <VStack bg="white">
                <HStack justifyContent="space-around" py={2} bg="white">
                    <VStack
                        alignItems="center"
                        bg="#f3f3f3"
                        p={4}
                        width="48%"
                        borderRadius="md"
                    >
                        <Text fontSize="sm" color="#666">
                            Tổng chi
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="#EB5757">
                            {formatCurrency(totalExpense)}
                        </Text>
                    </VStack>
                    <VStack
                        alignItems="center"
                        bg="#f3f3f3"
                        p={4}
                        width="48%"
                        borderRadius="md"
                    >
                        <Text fontSize="sm" color="#666">
                            Tổng thu
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="#27AE60">
                            {formatCurrency(totalIncome)}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        )
    }

    const RenderItem = memo(({item}) => {
        const itemData = groupedDataByDay[item];
        const income = itemData.filter(i => i.type === 1).reduce((rs, next) => rs + next.cost, 0);
        const outgoing = itemData.filter(i => i.type === 0).reduce((rs, next) => rs + next.cost, 0);


        const showDetail = () => {
            //close first
            detailSheetValue.value = -SH;
            setTimeout(() => {
                setCurrentDetail(item);
                detailSheetValue.value = 0;
            }, 500)
        }
        const Header = () => {
            // render header here
            return (
                <HStack alignItems={'center'} justifyContent={'space-between'}>
                    <HStack justifyContent={'center'} alignItems={'flex-start'} space={2}>
                        <Center padding={3.5} background={'white'} borderRadius={4}>
                            <Text fontWeight={'bold'} textAlign={'center'}>{item.split('-').pop()}</Text>
                        </Center>
                        <VStack space={1}>
                            <Text fontWeight={'bold'} color={'black'}>{getDayOfWeek(item)}</Text>
                            <Text color={'gray.400'} fontSize={14}>{formatDateByMonth(item)}</Text>
                        </VStack>
                    </HStack>
                    <HStack justifyContent={'flex-start'} space={6} alignItems={'center'}>
                        <Text color={'orange.600'}>{formatCurrency(outgoing)}</Text>
                        <Text color={'green.600'}>+ {formatCurrency(income)}</Text>
                    </HStack>
                </HStack>
            )
        }
        return (
            <Collapsible handlePress={showDetail} Header={Header}/>
        )
    });

    const getDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const groupedDataByDay = data[activeTab].reduce((result, item) => {
        const key = getDate(item.createdAt); // Get the date portion
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
    const DetailBottomTabContent = () => {
        const itemData = groupedDataByDay[currentDetail];
        const handleClose = () => {
            setCurrentDetail(null);
            setCurrentDetailItem(null);
            detailSheetValue.value = -SH;
            detailItemSheetValue.value = -SH;
        }
        const ItemDetail = ({detail}) => {
            const handleOpenDetail = () => {
                //     close first
                detailItemSheetValue.value = -SH;
                setTimeout(() => {
                    setCurrentDetailItem(detail);
                    detailItemSheetValue.value = 0;
                }, 500)
            }
            return (
                <Pressable onPress={handleOpenDetail}>
                    <VStack space={.5} my={1} background={'gray.100'} px={3} py={1.5} borderRadius={4}>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <Text color={'gray.500'} fontSize={16}>{detail.cname}</Text>
                            <Text fontSize={18} fontWeight={'bold'}
                                  color={detail?.type === 0 ? 'orange.600' : 'green.600'}>{formatCurrency(detail.cost)}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <Text fontSize={18} color={'black'}>{detail?.note}</Text>
                            <Text fontSize={16} color={'gray.500'}>{detail?.mname}</Text>
                        </HStack>
                    </VStack>
                </Pressable>
            )
        }
        return (
            <VStack space={1} py={6} px={4}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={18} fontWeight={'bold'}>{currentDetail}</Text>
                    <Pressable onPress={handleClose}>
                        <Ionicons name={'close'} size={30}/>
                    </Pressable>
                </HStack>
                <FlatList data={itemData} renderItem={({item}) => <ItemDetail detail={item}/>}/>
            </VStack>
        )
    }
    const DetailItemBottomSheetTabContent = () => {
        const handleClose = () => {
            detailItemSheetValue.value = -SH;
        }
        return (
            <VStack space={1} px={4} py={6}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Box></Box>
                    <Text fontWeight={'bold'} fontSize={18}>Chi tiết
                        khoản {currentDetailItem?.type === 0 ? 'chi' : 'thu'}</Text>
                    <Pressable onPress={handleClose}>
                        <Ionicons name={'close'} size={30}/>
                    </Pressable>
                </HStack>
                <VStack borderBottomWidth={1} borderBottomColor={'gray.100'} py={2}>
                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                        <HStack space={3} justifyContent={'center'}>
                            <Ionicons name={'cash-outline'} size={30}
                                      color={currentDetailItem?.type === 0 ? 'orange' : 'green'}/>
                            <VStack space={1}>
                                <Text fontWeight={'bold'}
                                      fontSize={18}>{getDayOfWeek(currentDetailItem?.createdAt)}</Text>
                                <Text color={'gray.500'}
                                      fontSize={15}>{new Date(currentDetailItem?.createdAt).toLocaleString()}</Text>
                            </VStack>
                        </HStack>
                        <VStack alignItems={'flex-end'} space={1}>
                            <Text
                                fontWeight={'bold'}
                                fontSize={18}
                                color={currentDetailItem?.type === 0 ? 'orange.600' : 'green.600'}>{formatCurrency(currentDetailItem?.cost)}</Text>
                            <Center width={20} background={'green.50'} p={1} borderRadius={4}>
                                <Text fontSize={15} fontWeight={'bold'} color={'green.600'}>Đã trả</Text>
                            </Center>
                        </VStack>
                    </HStack>
                </VStack>
                <VStack space={4} mt={3}>
                    <VStack space={1}>
                        <Text fontSize={16} color={"gray.400"} fontWeight={'bold'}>Phân loại</Text>
                        <Text color={"black"} fontSize={18}>{currentDetailItem?.cname}</Text>
                    </VStack>
                    <VStack space={1}>
                        <Text fontSize={16} color={"gray.400"} fontWeight={'bold'}>Nguồn tiền</Text>
                        <Text color={"black"} fontSize={18}>{currentDetailItem?.mname}</Text>
                    </VStack>
                    <VStack space={1}>
                        <Text fontSize={16} color={"gray.400"} fontWeight={'bold'}>Ghi chú</Text>
                        <Text color={"black"} fontSize={18}>{currentDetailItem?.note}</Text>
                    </VStack>
                    <VStack>
                        <Pressable onPress={() => setShowImage(true)}>
                            <Image source={{uri: currentDetailItem?.image}}
                                   style={{width: 80, height: 80, borderRadius: 6}}/>
                        </Pressable>
                    </VStack>
                </VStack>
            </VStack>
        )
    }
    const ImagePreview = () => {
        return (
            <VStack width={'100%'} height={'110%'} backgroundColor={'rgba(0,0,0,0.6)'} zIndex={100}
                    position={'absolute'} top={0} left={0}>
                <Pressable onPress={() => setShowImage(false)}
                           style={{position: 'absolute', right: 20, top: 20, zIndex: 100}}>
                    <Ionicons name={'close'} color={'white'} size={36}/>
                </Pressable>
                <Image source={{uri: currentDetailItem?.image}}
                       style={{
                           width: 350,
                           height: 350,
                           resizeMode: 'contain',
                           top: (SW / 2) - (350 / 2),
                           left: (SH / 2) - (350 / 2)
                       }}/>
            </VStack>
        )
    }
    const ListDataHeader = () => {
        return (
            <HStack alignItems={'center'} justifyContent={'space-between'} my={2} space={2}>
                <Text fontWeight={'bold'} fontSize={16}>Danh sách thu chi</Text>
                <HStack space={6}>
                    <HStack alignItems={'center'} space={2} justifyContent={'center'}>
                        <Box width={4} borderRadius={2} height={4} backgroundColor={'orange.600'}></Box>
                        <Text>Chi</Text>
                    </HStack>
                    <HStack alignItems={'center'} space={2} justifyContent={'center'}>
                        <Box width={4} height={4} borderRadius={2} backgroundColor={'green.500'}></Box>
                        <Text>Thu</Text>
                    </HStack>
                </HStack>
            </HStack>
        )
    }
    useLayoutEffect(() => {
        loadData().then();
    }, [focus]);
    useLayoutEffect(() => {
        loadData().then();
    }, [currentDate])
    return (
        <AppContainer>
            <Header/>
            <VStack flex={1} px={20} bg="white">
                <Filter/>
                <Summary/>
                <ListDataHeader/>
                <FlatList keyExtractor={() => stringGen(12)} numColumns={2} data={Object.keys(groupedDataByDay)}
                          renderItem={({item}) => <RenderItem item={item}/>}/>
            </VStack>
            {(showDate && showDate === true) && (
                <DateTimePicker
                    value={currentDate || new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
            <Footer/>
            <BottomSheet cStyle={detailSheetStyle}>
                <DetailBottomTabContent/>
            </BottomSheet>
            <BottomSheet cStyle={detailItemSheetStyle}>
                <DetailItemBottomSheetTabContent/>
            </BottomSheet>
            {showImage && <ImagePreview/>}
        </AppContainer>
    );
};

export default observer(AnalyticIndexScreen);
