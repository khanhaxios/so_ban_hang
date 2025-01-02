import {Box, Center, HStack, Image, Text, VStack} from "native-base";
import {LineChart} from "react-native-chart-kit";
import {ActivityIndicator, Dimensions, ScrollView} from "react-native";
import React, {useEffect, useLayoutEffect, useState} from "react";
import FilterSection from "../../components/filter/FilterSection.cpn";
import {appDatabaseService} from "../../core/app.database";
import DateTimePicker from "@react-native-community/datetimepicker";
import {delaySync, formatCurrency, SH} from "../../ultis/helper";

const screenWidth = Dimensions.get("window").width;
export const chartData = {
    labels: ["0h", "4h", "8h", "12h", "16h", "20h"], // Giờ biểu đồ
    datasets: [
        {
            data: [0, 180000, 92000, 450000, 140000, 23000], // Dữ liệu doanh thu hôm nay
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Màu xanh
            strokeWidth: 2,
        },
        {
            data: [0, 190000, 100000, 360000, 200000, 40000], // Dữ liệu hôm qua
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Màu đỏ
            strokeWidth: 2,
        },
    ],
    legend: ["Hôm nay", "Hôm qua"],
};

function ReportSellScreen() {
    const [activeTab, setActiveTab] = useState('today');
    const [showDate, setShowDate] = useState(false);
    const [data, setData] = useState({prevDay: [], today: [], monthly: [], prevMonthly: []});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [chartsData, setChartsData] = useState(chartData);
    const [detailData, setDetailData] = useState(chartData);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || currentDate;
        setCurrentDate(currentDate);
        setShowDate(false)
    }
    const loadData = async () => {
        if (loading) return;
        setLoading(true);
        await delaySync(1);
        setData({today: [], monthly: [], prevMonthly: []})
        const db = await appDatabaseService.getConnection();
        const today = currentDate;
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();
        const query = `SELECT * FROM orders WHERE createdAt >= ${startOfDay} AND createdAt <= ${endOfDay}`;
        const allTodayOrder = await db.getAllAsync(query);
        const prevDayStart = new Date(today.setDate(today.getDate() - 1));
        prevDayStart.setHours(0, 0, 0, 0);
        const prevDayEnd = new Date(today.setDate(today.getDate()));
        prevDayEnd.setHours(23, 59, 59, 999);
        const prevDayQuery = `SELECT * FROM orders WHERE createdAt >= ${prevDayStart.getTime()} AND createdAt <= ${prevDayEnd.getTime()}`;
        const prevDayOrder = await db.getAllAsync(prevDayQuery);

        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
        const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        const queryCurrentMonth = `SELECT * FROM orders WHERE createdAt >= ${startOfCurrentMonth} AND createdAt <= ${endOfCurrentMonth}`;
        const allCurrentMonthOrders = await db.getAllAsync(queryCurrentMonth);
        const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime();
        const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999).getTime();

        const queryPreviousMonth = `SELECT * FROM orders WHERE createdAt >= ${startOfPreviousMonth} AND createdAt <= ${endOfPreviousMonth}`;
        const allPreviousMonthOrders = await db.getAllAsync(queryPreviousMonth);
        setData({
            prevDay: prevDayOrder,
            today: allTodayOrder,
            monthly: allCurrentMonthOrders,
            prevMonthly: allPreviousMonthOrders
        });
        await getDataOfDetail(allCurrentMonthOrders);
        setLoading(false);
    }
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
                    todayData[hour] += order.amount;
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
            labels = ["1", "8", "16", "24", "30"];
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
                        monthlyData[index] += order.amount;
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

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0, // Số lượng chữ số thập phân
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
        },
    };

    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        avgOrder: 0,
    });


    useEffect(() => {
        const totalRevenue = data[activeTab]?.reduce((acc, sale) => acc + sale.amount, 0);
        const totalOrders = data[activeTab]?.length;
        const totalCustomers = totalOrders;
        const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        let percents = {}

        if (activeTab === 'today') {
            const prevData = data?.prevDay?.reduce((a, c) => a + c.amount, 0);
            const revenuePercent = (totalRevenue / Math.max(prevData, 1)) * 100;
            if (!isNaN(revenuePercent)) {
                percents['revenue'] = revenuePercent;
            }
            const orderPercent = data?.prevDay?.length / totalOrders * 100;
            if (!isNaN(orderPercent)) {
                percents['orders'] = orderPercent;
            }
        }
        if (activeTab === "monthly") {
            const prevData = data?.prevMonthly?.reduce((a, c) => a + c.amount, 0);
            const revenuePercent = (totalRevenue / Math.max(prevData, 1)) * 100;
            if (!isNaN(revenuePercent)) {
                percents['revenue'] = revenuePercent;
            }
            const orderPercent = data?.prevDay?.length / totalOrders * 100;
            if (!isNaN(orderPercent)) {
                percents['orders'] = orderPercent;
            }
        }
        setStats({
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
            avgOrder: avgOrder,
            percents
        });
        setChartsData(generateChartData(data[activeTab], activeTab));
    }, [data, activeTab]);

    useLayoutEffect(() => {
        loadData().then();
    }, [currentDate]);
    const getDataOfDetail = async (data) => {
        try {
            const db = await appDatabaseService.getConnection();
            const allOrderInMonth = data;
            const allDetails = [];
            let allProduct = [];
            for (let od of allOrderInMonth) {
                const details = await db.getAllAsync(`select productId,quantity from ordersDetail where orderId=${od.id}`);
                allDetails.push(...details);
            }
            const uniqueDetails = allDetails.reduce((acc, current) => {
                // Check if product already exists in the accumulator
                const existing = acc.find(item => item.productId === current.productId);
                if (existing) {
                    existing.quantity += current.quantity;
                } else {
                    acc.push({...current});
                }
                return acc;
            }, []);
            for (let p of uniqueDetails) {
                allProduct.push(await db.getFirstAsync(`select name,price from products where id=${p.productId}`));
            }
            if (allProduct.length > 16) {
                allProduct = allProduct.slice(0, 15).sort((a, b) => b.quantity - a.quantity);
            }

            if (allProduct.length <= 0) {
                return;
            }
            let labels = allProduct.map((p) => p?.name);
            const datasets = [{
                data: uniqueDetails.map((d) => d?.quantity),
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                strokeWidth: 2,
            }];
            const legend = ['Doanh số sản phẩm tháng này'];
            setDetailData({labels, datasets, legend});
        } catch (e) {
            console.log(e)
        }
    }
    const DetailSellReport = () => {
        return (<VStack py={5}>
            <Text fontSize="lg" mb={2} mx={4} color="gray.500">
                Doanh thu chi tiết
            </Text>
            <Box px={4} py={2} mt={2} bg="white">
                <LineChart
                    data={detailData}
                    width={SH}
                    height={250}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        marginLeft: 20,
                        borderRadius: 16,
                    }}
                />
            </Box>
        </VStack>)
    }
    const CashFollowSection = () => {
        return (
            <VStack pt={5}>
                <Text fontSize="lg" mb={2} mx={4} color="gray.500">
                    Dòng tiền theo phương thức thanh toán
                </Text>

                <VStack space={2} px={4} py={2} bg="white" mt={2}>
                    <HStack justifyContent="space-between">
                        <Text>Tiền mặt</Text>
                        <Text>{stats.revenue.toLocaleString()}đ</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Text>Đã ghi nợ</Text>
                        <Text>0đ</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Text>Chưa thanh toán</Text>
                        <Text>0đ</Text>
                    </HStack>
                </VStack>
            </VStack>
        )
    }
    const TrendChart = () => {
        return (
            <VStack pt={5}>
                <Text fontSize="lg" mb={2} mx={4} color="gray.500">
                    Biểu đồ xu hướng theo thời gian bán hàng
                </Text>
                <Box px={4} py={2} mt={2} bg="white">
                    <LineChart
                        data={chartsData}
                        width={SH}
                        height={250}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            marginLeft: 20,
                            borderRadius: 16,
                        }}
                    />
                </Box>
            </VStack>
        )
    }
    const OverView = () => {
        return (
            <VStack
                width={'70%'}
                space={3}
                px={4}
                py={3}
                bg="white"
                mt={2}
                justifyContent={"center"}
                mx={'auto'}
                borderRadius={6}
            >
                <VStack justifyContent="space-between" mt={2} space={2}>
                    <Text fontSize="md" textAlign={"center"}>
                        Doanh thu
                    </Text>
                    <VStack>
                        <HStack justifyContent={"center"} alignItems={"flex-end"}>
                            <Text fontSize="4xl" color="green.600" bold>
                                {formatCurrency(stats.revenue)}
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>

                <HStack justifyContent={'space-between'} alignItems={'center'} mt={2}>
                    <VStack width="1/3" alignItems={'center'}>
                        <Text fontSize="sm" color="gray.500" pb={1.5}>
                            Đơn hàng
                        </Text>
                        <HStack alignItems={"flex-end"}>
                            <Text fontSize="lg" bold>
                                {stats.orders}
                            </Text>
                            <Text fontSize="xs" color={stats.percents?.orders > 0 ? "green.400" : "red.400"}
                                  alignItems={"end"}>
                                {Number.isFinite(stats.percents?.orders) ? 0 : stats.percents?.orders > 0 ? '↑' : '↓'} {stats.percents?.orders?.toFixed(2) || 0}%
                            </Text>
                        </HStack>
                    </VStack>
                    <VStack alignItems={'center'} width="1/3">
                        <Text fontSize="sm" color="gray.500" pb={1.5}>
                            Khách hàng
                        </Text>
                        <HStack alignItems={"flex-end"}>
                            <Text fontSize="lg" bold>
                                {stats.customers}
                            </Text>
                            <Text fontSize="xs" color={stats.percents?.orders > 0 ? "green.400" : "red.400"}
                                  alignItems={"end"}>
                                {Number.isFinite(stats.percents?.orders) ? 0 : stats.percents?.orders > 0 ? '↑' : '↓'} {stats.percents?.orders?.toFixed(2) || 0}%
                            </Text>
                        </HStack>
                    </VStack>
                    <VStack alignItems={'center'} width="1/3">
                        <Text fontSize="sm" color="gray.500" pb={1.5}>
                            Trung bình/đơn
                        </Text>
                        <Text fontSize="lg" bold>
                            {formatCurrency(stats.avgOrder)}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        )
    }
    const Filter = () => {
        return (
            <VStack>
                <HStack justifyContent="space-around">
                    <VStack width={"35%"}>
                        <FilterSection
                            setShowDate={setShowDate}
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                        />
                    </VStack>
                </HStack>
            </VStack>
        )
    }

    return (
        <VStack px={2}>
            <Filter/>
            <ScrollView style={{height: '80%'}} showsVerticalScrollIndicator={false}>
                <OverView/>
                <TrendChart/>
                <CashFollowSection/>
                <DetailSellReport/>
                {(showDate && showDate === true) && (
                    <DateTimePicker
                        value={currentDate || new Date()}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </ScrollView>
            {loading && (<Center flex={1} my={10}>
                <ActivityIndicator size={30} color={'black'}/>
            </Center>)}
        </VStack>
    );
}

export default ReportSellScreen;
