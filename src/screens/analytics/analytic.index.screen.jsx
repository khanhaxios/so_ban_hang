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
    Box, Button, Collapse,
} from "native-base";
import {AppContainer} from "../../components/layout/container.cpn";
import icon from "../../res/icon.png";
import FilterSection from "../../components/filter/FilterSection.cpn";
import {appDatabaseService} from "../../core/app.database";
import {store} from "../../models/store.model";
import {ActivityIndicator, FlatList} from "react-native";
import {formatCurrency, formatDateByMonth, getDayOfWeek, SH} from "../../ultis/helper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useNavigation} from "@react-navigation/native";
import {Collapsible} from "../../components/layout/collapsible";

const AnalyticIndexScreen = ({navigation, route}) => {
    const [data, setData] = useState({today: [], monthly: [], prevMonthly: []});
    const [activeTab, setActiveTab] = useState('today');
    const [currentDate, setCurrent] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [loading, setLoading] = useState(false);

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
            const query = `SELECT * FROM orders WHERE createdAt >= ${startOfDay} AND createdAt <= ${endOfDay}`;
            const allTodayOrder = await db.getAllAsync(query);

            const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
            const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

            const queryCurrentMonth = `SELECT * FROM orders WHERE createdAt >= ${startOfCurrentMonth} AND createdAt <= ${endOfCurrentMonth}`;
            const allCurrentMonthOrders = await db.getAllAsync(queryCurrentMonth);
            const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime();
            const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999).getTime();

            const queryPreviousMonth = `SELECT * FROM orders WHERE createdAt >= ${startOfPreviousMonth} AND createdAt <= ${endOfPreviousMonth}`;
            const allPreviousMonthOrders = await db.getAllAsync(queryPreviousMonth);
            setData({today: allTodayOrder, monthly: allCurrentMonthOrders, prevMonthly: allPreviousMonthOrders});
            setLoading(false);
        }, 1000)
    }
    const RenderGroupedByDate = ({item}) => {
        return (
            <VStack key={item.toString()}>
                <VStack
                    flexDirection="row"
                    justifyContent="space-between"
                    p={4}
                    bg="#F5F5F5"
                >
                    <Text fontWeight="bold" color="#666">
                        {item}
                    </Text>
                </VStack>
                {groupedData[item].map((transaction) =>
                    renderTransactionItem(transaction)
                )}
            </VStack>
        )
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
    const Summary = () => {
        return (
            <VStack bg="white">
                <HStack justifyContent="space-around" py={2} bg="white">
                    <VStack
                        alignItems="center"
                        bg="#f3f3f3"
                        p={4}
                        width="45%"
                        borderRadius="md"
                    >
                        <Text fontSize="sm" color="#666">
                            Tổng chi
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="#EB5757">
                            {/*{totalExpense.toLocaleString()}đ*/}
                        </Text>
                    </VStack>
                    <VStack
                        alignItems="center"
                        bg="#f3f3f3"
                        p={4}
                        width="45%"
                        borderRadius="md"
                    >
                        <Text fontSize="sm" color="#666">
                            Tổng thu
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="#27AE60">
                            {/*{totalIncome.toLocaleString()}đ*/}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        )
    }

    const RenderItem = memo(({item}) => {
        const Header = () => {
            // render header here
            return (
                <HStack alignItems={'center'} justifyContent={'space-between'}>
                    <HStack justifyContent={'center'} alignItems={'flex-start'} space={2}>
                        <Center padding={6} background={'white'} borderRadius={4}>
                            <Text fontWeight={'bold'} textAlign={'center'}>{new Date(item?.createdAt).getDate()}</Text>
                        </Center>
                        <VStack>
                            <Text fontWeight={'bold'} color={'black'}>{getDayOfWeek(item?.createdAt)}</Text>
                            <Text color={'gray.400'} fontSize={14}>{formatDateByMonth(item?.createdAt)}</Text>
                        </VStack>
                    </HStack>
                    <HStack justifyContent={'flex-start'} alignItems={'center'}>
                        <Text color={'orange.600'}>{item?.cost}</Text>
                    </HStack>
                </HStack>
            )
        }
        return (
            <Collapsible Header={<Header/>}>
                <HStack>

                </HStack>
            </Collapsible>
        )
    });
    return (
        <AppContainer>
            {/* Header */}
            <Header/>
            {/* Content */}
            <VStack flex={1} bg="white">
                {/* Filter Section */}
                <Filter/>
                <Summary/>
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
        </AppContainer>
    );
};

export default observer(AnalyticIndexScreen);
