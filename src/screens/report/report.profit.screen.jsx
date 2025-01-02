import {Box, Button, Center, FlatList, HStack, Image, Text, VStack} from "native-base";
import {memo, useLayoutEffect, useMemo, useState} from "react";
import {LineChart} from "react-native-chart-kit";
import {ActivityIndicator, Dimensions, ScrollView, ToastAndroid} from "react-native";
import FilterSection from "../../components/filter/FilterSection.cpn";
import {convertNumberToCurrency, delaySync, formatCurrency, SH, stringGen} from "../../ultis/helper";
import {appDatabaseService} from "../../core/app.database";
import {chartData} from "./report.sell.screen";

const screenWidth = Dimensions.get("window").width;

function ReportProfitScreen() {
    const [activeTab, setActiveTab] = useState('today');
    const [data, setData] = useState({today: [], monthly: [], prevMonthly: []});
    const [topProductData, setTopProductData] = useState({today: [], monthly: [], prevMonthly: []});
    const [loading, setLoading] = useState(false);
    const [freshing, setFreshing] = useState(false);
    // Tính tổng doanh thu, giá vốn và lợi nhuận
    const totalRevenue = data[activeTab].reduce((acc, item) => acc + item.amount, 0);
    const totalCost = data[activeTab].reduce((acc, item) => acc + item.expense, 0);
    const totalProfit = data[activeTab].reduce((acc, item) => acc + item.income, 0);
    const generateChartData = (orders, type) => {
        let labels = [];
        let datasets = [];
        let legend = [];

        const today = new Date();

        if (type === "today") {
            labels = Array.from({length: 24}, (_, i) => `${i}h`);
            const todayData = Array(labels.length).fill(0);

            const startOfToday = new Date().setHours(0, 0, 0, 0);
            const endOfToday = new Date().setHours(23, 59, 59, 999);

            for (let order of orders) {
                if (order.createdAt >= startOfToday && order.createdAt <= endOfToday) {
                    const hour = new Date(order.createdAt).getHours();
                    todayData[hour] += order.income;
                }
            }
            datasets = [
                {
                    data: todayData,
                    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                    strokeWidth: 2,
                },
            ];
            legend = ["Hôm nay"];
        }

        if (type === "monthly" || type === "prevMonthly") {
            labels = ["1", "4", "8", "12", "16", "20", "24", "28", "30"];
            const isPrevMonth = type === "prevMonthly";
            const month = today.getMonth();
            const year = today.getFullYear();

            const startOfMonth = new Date(year, isPrevMonth ? month - 1 : month, 1).getTime();
            const endOfMonth = new Date(year, isPrevMonth ? month : month + 1, 0, 23, 59, 59, 999).getTime();

            const monthlyData = Array(labels.length).fill(0);

            // Process data for the selected month
            for (let order of orders) {
                if (order.createdAt >= startOfMonth && order.createdAt <= endOfMonth) {
                    const day = new Date(order.createdAt).getDate();
                    const index = labels.findIndex((label, i) =>
                        day <= parseInt(label) || (i === labels.length - 1 && day > parseInt(label))
                    );
                    if (index !== -1) {
                        monthlyData[index] += order.income;
                    }
                }
            }

            datasets = [
                {
                    data: monthlyData,
                    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                    strokeWidth: 2,
                },
            ];
            legend = isPrevMonth ? ["Tháng trước"] : ["Tháng này"];
        }

        return {labels, datasets, legend};
    };
    const generateTopProductChartData = (productOrdersDetail, type) => {
        let labels = [];
        let datasets = [];
        let legend = [];
        if (type === "today") {
            legend = ["Hôm nay"];
        }
        if (type === "monthly") {
            legend = ["Tháng này"];
        }
        if (type === "prevMonthly") {
            legend = ["Tháng trước"];
        }
        labels = productOrdersDetail.map((p) => p.name);
        datasets = [
            {
                data: productOrdersDetail.map(p => p.quantity),
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                strokeWidth: 2,
            },
        ];
        return {labels, datasets, legend};
    }
    const profitChartData = generateChartData(data[activeTab], activeTab);
    const topProductChartData = generateTopProductChartData(topProductData[activeTab].slice(0, 12), activeTab);
    const uniqueDetail = (allDetails) => {
        return allDetails.reduce((acc, current) => {
            const existing = acc.find(item => item.productId === current.productId);
            if (existing) {
                existing.quantity += current.quantity;
            } else {
                acc.push({...current});
            }
            return acc;
        }, []);
    }
    const loadData = async () => {
        try {
            if (loading) return;
            setLoading(true);
            await delaySync(1);
            setData({today: [], monthly: [], prevMonthly: []})
            const db = await appDatabaseService.getConnection();
            const today = new Date();
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

            let productTopByToday = [];
            let productTopByThisMonth = [];
            let productTopByLastMonth = [];

            let detailsToday = [];
            let detailMonth = [];
            let detailLastMonth = [];
            for (let o of allTodayOrder) {
                const details = await db.getAllAsync(`select productId,ordersDetail.quantity,products.name  from ordersDetail join products on products.id = ordersDetail.productId  where orderId=${o.id}`);
                detailsToday.push(...details);
            }
            for (let o of allCurrentMonthOrders) {
                const details = await db.getAllAsync(`select productId,ordersDetail.quantity ,products.name  from ordersDetail join products on products.id = ordersDetail.productId  where orderId=${o.id}`);
                detailMonth.push(...details);
            }
            for (let o of allPreviousMonthOrders) {
                const details = await db.getAllAsync(`select productId,ordersDetail.quantity,products.name from ordersDetail join products on products.id = ordersDetail.productId where orderId=${o.id}`);
                detailLastMonth.push(...details);
            }
            detailsToday = uniqueDetail(detailsToday);
            detailMonth = uniqueDetail(detailMonth);
            detailLastMonth = uniqueDetail(detailLastMonth);

            productTopByToday = detailsToday.sort((a, b) => b.quantity - a.quantity);
            productTopByThisMonth = detailMonth.sort((a, b) => b.quantity - a.quantity);
            productTopByLastMonth = detailLastMonth.sort((a, b) => b.quantity - a.quantity);
            setTopProductData({
                today: productTopByToday,
                monthly: productTopByThisMonth,
                prevMonthly: productTopByLastMonth
            })
            setData({
                today: allTodayOrder,
                monthly: allCurrentMonthOrders,
                prevMonthly: allPreviousMonthOrders
            });
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
            ToastAndroid.show("Có lỗi xảy ra khi khởi tạo dữ liệu hãy thử lại sau", ToastAndroid.LONG);
        }
    }
    useLayoutEffect(() => {
        loadData().then();
    }, []);
    const Filter = () => {
        return (
            <VStack mb={4}>
                <HStack justifyContent="space-around">
                    <VStack width="35%">
                        <FilterSection
                            isShowPickDate={false}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </VStack>
                </HStack>
            </VStack>
        )
    }
    const OverView = () => {
        return (
            <VStack
                space={2}
                px={4}
                py={2}
                bg="white"
                mt={2}
                justifyContent={"center"}
                mx={'auto'}
                borderRadius={6}
                width={'60%'}
            >
                <VStack justifyContent="space-between" mt={2}>
                    <Text fontSize="sm" textAlign={"center"}>
                        Lợi nhuận
                    </Text>
                    <VStack>
                        <HStack justifyContent={"center"} alignItems={"flex-end"}>
                            <Text fontSize="4xl" color="green.600" bold>
                                {formatCurrency(totalProfit)}
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>

                <HStack justifyContent="space-between" mt={2}>
                    <VStack alignItems="center" width="1/3">
                        <Text fontSize="sm" color="gray.500" pb={1.5}>
                            Doanh thu
                        </Text>
                        <HStack alignItems={"flex-end"}>
                            <Text fontSize="lg" bold>
                                {formatCurrency(totalRevenue)}
                            </Text>
                        </HStack>
                    </VStack>

                    <VStack alignItems="center" width="1/3">
                        <Text fontSize="sm" color="gray.500" pb={1.5}>
                            Giá vốn
                        </Text>
                        <HStack alignItems={"flex-end"}>
                            <Text fontSize="lg" bold>
                                {formatCurrency(totalCost)}
                            </Text>
                        </HStack>
                    </VStack>

                    <VStack alignItems="center" width="1/3">
                        <Text fontSize="sm" color="gray.500" pb={1.5}>
                            Lợi nhuận khác
                        </Text>
                        <Text fontSize="lg" bold>
                            {formatCurrency(0)}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        )
    }
    const ProfitChart = () => {
        return (
            <VStack borderRadius="lg" bg="#fff" p={4} my={4} shadow={1}>
                <Text fontSize="md" fontWeight="bold" mb={2}>
                    Xu hướng lợi nhuận
                </Text>
                <LineChart
                    data={profitChartData || chartData}
                    width={SH - 60}
                    height={250}
                    yAxisInterval={1}
                    formatYLabel={(c) => convertNumberToCurrency(c).val}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "4",
                            strokeWidth: "1",
                            stroke: "#ffa726",
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        marginHorizontal: 'auto',
                        borderRadius: 16,
                    }}
                />
            </VStack>
        )
    }
    const ProfitDetail = () => {
        const DetailItem = memo(({item}) => {
            return (
                <HStack px={1} justifyContent="space-between" my={2}>
                    <Text fontSize={16} fontWeight={'bold'}>{new Date(item.createdAt).toLocaleString()}</Text>
                    <Text fontSize={16} textAlign={'right'}
                          color={item.income > 0 ? 'green.500' : 'red.500'}>{formatCurrency(item.income)}</Text>
                </HStack>
            )
        })

        const EmptyList = () => {
            return (
                <VStack backgroundColor={"white"}>
                    <Box
                        alignItems="center"

                        p={4}
                        borderRadius="md"
                    >
                        <Image
                            source={require('../../../assets/bill.png')}
                            alt="bill icon"
                            size="md"
                        />
                        <Text color="#555" fontSize="sm" mt={1}>
                            Thu chi dài dòng - ghi lại là xong!
                        </Text>
                    </Box>
                </VStack>
            )
        }
        const cached = useMemo(() => data[activeTab], [data[activeTab]]);
        return (
            <VStack borderRadius="lg" bg="#fff" p={4} mb={4} shadow={1}>
                <Text fontSize="md" fontWeight="bold" color="gray.600" mb={2}>
                    Chi tiết lãi lỗ
                </Text>
                <FlatList ListEmptyComponent={<EmptyList/>} data={cached.sort((a, b) => b.createdAt - a.createdAt)}
                          renderItem={({item}) => <DetailItem item={item}/>}
                          keyExtractor={() => stringGen(12)}/>
            </VStack>
        )
    }
    const ProfitBySection = () => {
        const EmptyData = () => {
            return (
                <VStack backgroundColor={"white"}>
                    <Box
                        alignItems="center"

                        p={4}
                        borderRadius="md"
                    >
                        <Image
                            source={require('../../../assets/bill.png')}
                            alt="bill icon"
                            size="md"
                        />
                        <Text color="#555" fontSize="sm" mt={1}>
                            Thu chi dài dòng - ghi lại là xong!
                        </Text>
                    </Box>
                </VStack>
            )
        }
        return (
            <VStack borderRadius="lg" bg="#fff" p={4} mb={4} shadow={1}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md" fontWeight="bold">
                        Lợi nhuận theo
                    </Text>
                    <Button size="sm" variant="outline" colorScheme="blue">
                        Sản phẩm
                    </Button>
                </HStack>
                {topProductData[activeTab].length <= 0 ? (
                    <EmptyData/>) : (
                    <LineChart
                        data={topProductChartData || chartData}
                        width={SH - 60}
                        height={250}
                        yAxisInterval={1}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "1",
                                stroke: "#ffa726",
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            marginHorizontal: 'auto',
                            borderRadius: 16,
                        }}
                    />
                )}
            </VStack>
        )
    }
    const Loader = () => {
        return (
            <Center flex={1} my={2}>
                <ActivityIndicator size={30} color={'black'}/>
            </Center>
        )
    }
    return (
        <VStack space={3} bg="#f4f5f7" flex={1} px={4} py={2}>
            <Filter/>
            <ScrollView style={{height: '80%'}} showsVerticalScrollIndicator={false}>
                <OverView/>
                <ProfitChart/>
                <ProfitDetail/>
                <ProfitBySection/>
            </ScrollView>
            {loading && <Loader/>}
        </VStack>

    );
}

export default ReportProfitScreen;
