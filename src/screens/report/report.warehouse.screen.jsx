import React, {useLayoutEffect, useState} from "react";
import {
    Box,
    Text,
    ScrollView,
    HStack,
    Button,
    VStack,
    Center,
    Icon, Image,
} from "native-base";
import {MaterialIcons} from "react-native-vector-icons";
import {Dimensions, FlatList, TouchableOpacity} from "react-native";
import {LineChart} from "react-native-chart-kit";
import {product} from "../../models/product.model";
import {convertNumberToCurrency, formatCurrency, stringGen} from "../../ultis/helper";
import {useNavigation} from "@react-navigation/native";
import {appDatabaseService} from "../../core/app.database";

function ReportWareHouseScreen() {
    const nav = useNavigation();
    const [selectedFilter, setSelectedFilter] = useState("overview");
    const [insertProductHis, setInsertProductHis] = useState([]);
    const switchFilter = (filter) => {
        setSelectedFilter(filter);
    };
    const products = [...product.products, ...product.inStorageProduct]

    const generateChartData = (data, allProducts) => {
        const labels = [];
        let datasets = [];
        const groupedData = {};
        let legend = ["Tháng này"];
        data.forEach((item) => {
            const date = new Date(item.createdAt).toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
            if (!groupedData[date]) {
                groupedData[date] = [];
            }
            groupedData[date].push(item);
        });

        // Extract labels (unique dates sorted)
        const sortedDates = Object.keys(groupedData).sort();
        labels.push(...sortedDates);
        const chartData = sortedDates.map((date) => {
            const dayData = groupedData[date];
            return dayData.reduce((total, product) => {
                const foundP = allProducts.find((p) => product.productId === p.id);
                const price = foundP?.originPrice || 0;
                return total + product.quantity * price;
            }, 0);
        });
        datasets.push({
            data: chartData, // Computed data for the chart
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue color
            strokeWidth: 2,
        });
        return {labels, datasets, legend};
    }
    const chartData = generateChartData(insertProductHis, products);
    // Calculate total values
    const totalValue = products.reduce((total, product) => total + (product.originPrice * (product.quantity + product.sold)), 0);
    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
    const inStockProducts = products.filter((product) => product.isSelling);
    const outOfStockProducts = products.filter((product) => product.quantity <= 0);
    const inStockValue = inStockProducts.reduce((total, product) => total + (product.originPrice * product.quantity), 0);
    const outOfStockQuantity = outOfStockProducts.length;

    const totalSold = products.reduce((total, product) => total + product?.sold, 0); // Tổng số lượng đã bán
    const totalSalesValue = products.reduce((total, product) => total + (product?.sold * product.originPrice / (product.sold + product.quantity)), 0); // Tổng giá trị hàng đã bán (giả định giá trị dựa trên tỷ lệ số lượng bán)
    const inventoryChange = totalValue - totalSalesValue; // Chênh lệch giá trị tồn kho

    const averageDailySales = totalSold / 30; // Giả định bán hết trong 30 ngày
    const estimatedStockDays = averageDailySales > 0 ? Math.round(totalQuantity / averageDailySales) : 0; // Ngày tồn kho dự kiến
    const getAllInsertProductHistory = async () => {
        const current = new Date();
        const month = current.getMonth();
        const year = current.getFullYear();
        const db = await appDatabaseService.getConnection();
        const startOfMonth = new Date(year, month, 1).getTime();
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
        const query = `select * from productsHistory WHERE createdAt >= ${startOfMonth} AND createdAt <= ${endOfMonth}`;
        const result = await db.getAllAsync(query);
        setInsertProductHis(result);
    }
    useLayoutEffect(() => {
        if (products.length === 0) {
            product.loadAll().then();
        }
        getAllInsertProductHistory().then();
    }, []);
    useLayoutEffect(() => {
    }, [product.products])
    const Filter = () => {
        return (
            <VStack>
                <HStack justifyContent="space-around">
                    <VStack width={"35%"}>
                        <VStack flexDirection={"row"} justifyContent={"space-around"}>
                            <HStack
                                flexDirection="row"
                                justifyContent="space-around"
                                bg="#ecf0f6"
                                py={1}
                                my={2}
                                borderRadius={6}
                            >
                                <TouchableOpacity onPress={() => switchFilter("overview")}>
                                    <Box
                                        py={2}
                                        px={4}
                                        borderRadius={5}
                                        bg={selectedFilter === "overview" ? "white" : "transparent"}
                                    >
                                        <Text
                                            fontSize="xs"
                                            color={selectedFilter === "overview" ? "#17683d" : "#666"}
                                            fontWeight={selectedFilter === "overview" ? "bold" : "normal"}
                                        >
                                            Tổng quan
                                        </Text>
                                    </Box>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => switchFilter("analysis")}>
                                    <Box
                                        py={2}
                                        px={4}
                                        borderRadius={5}
                                        bg={selectedFilter === "analysis" ? "white" : "transparent"}
                                    >
                                        <Text
                                            fontSize="xs"
                                            color={selectedFilter === "analysis" ? "#17683d" : "#666"}
                                            fontWeight={selectedFilter === "analysis" ? "bold" : "normal"}
                                        >
                                            Phân tích
                                        </Text>
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </VStack>
                </HStack>
            </VStack>
        )
    }
    const OutSlotProductItem = ({product, index}) => {
        return (
            <HStack
                justifyContent="space-between"
                my={2}
                alignItems={'flex-start'}
                p={2}
                borderRadius={4}
            >
                <HStack space={4}>
                    <Image src={product.image} width={62} height={62} borderRadius={6}/>
                    <VStack>
                        <Text fontSize={"md"} fontWeight={"bold"}>
                            {product.name}
                        </Text>
                        <Text color={'orange.600'}>
                            {formatCurrency(product.originPrice)}
                        </Text>
                        <Text color={'gray.400'}>
                            {product.isSelling ? 'đang bán' : 'tồn kho'}
                        </Text>
                    </VStack>
                </HStack>

                <VStack alignItems={'flex-end'}>
                    <Text>Giá trị</Text>
                    <Text color={"green.500"}>{formatCurrency(product.price)}</Text>
                    <Text>SL: {product.quantity}</Text>
                </VStack>
            </HStack>
        )
    }
    const OutSlotProductEmpty = () => {
        return (
            <Center>
                <Icon
                    as={MaterialIcons}
                    name="search"
                    size="lg"
                    color="#888"
                    mb={3}
                />
                <Text color="#888" mb={4}>
                    Chưa có sản phẩm hết hàng
                </Text>
                <Button onPress={() => nav.navigate('manage_createoder_screen')} bg="#007bff">Nhập hàng ngay</Button>
            </Center>
        )
    }
    const OverView = () => {
        return (
            <>
                <HStack flexWrap="wrap" justifyContent="space-between" mt={2}>
                    <Box
                        width="49%"
                        bg="#fff"
                        borderRadius="lg"
                        p={4}
                        mb={2}
                        alignItems="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold">
                            {totalValue.toLocaleString()} ₫
                        </Text>
                        <Text color="#888">Giá trị kho</Text>
                    </Box>
                    <Box
                        width="49%"
                        bg="#fff"
                        borderRadius="lg"
                        p={4}
                        mb={2}
                        alignItems="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold">
                            {totalQuantity}
                        </Text>
                        <Text color="#888">Số lượng</Text>
                    </Box>
                </HStack>
                <HStack flexWrap="wrap" justifyContent="space-between" mt={2}>
                    <Box
                        width="49%"
                        bg="#fff"
                        borderRadius="lg"
                        p={4}
                        mb={2}
                        alignItems="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold">
                            {inStockValue.toLocaleString()} ₫
                        </Text>
                        <Text color="#888">Sản phẩm còn bán</Text>
                    </Box>
                    <Box
                        width="49%"
                        bg="#fff"
                        borderRadius="lg"
                        p={4}
                        mb={2}
                        alignItems="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold">
                            {outOfStockQuantity}
                        </Text>
                        <Text color="#888">Sản phẩm hết hàng</Text>
                    </Box>
                </HStack>
                {/* Out-of-Stock Products Section */}
                <VStack borderRadius="lg" bg="#fff" mt={6} p={3}>
                    <Text fontSize="md" fontWeight="bold">
                        Sản phẩm hết hàng
                    </Text>
                    <VStack mt={2}>
                        <Text fontSize="sm" color={"#888"}>
                            Sản phẩm
                        </Text>
                        <FlatList ListEmptyComponent={<OutSlotProductEmpty/>}
                                  keyExtractor={() => stringGen(12)}
                                  data={products.filter((p) => p.quantity <= 0)}
                                  renderItem={({item, index}) => <OutSlotProductItem index={index} product={item}/>}/>
                    </VStack>
                </VStack>
            </>
        )
    }
    return (
        <VStack bg="#f4f5f7" flex={1} px={4}>
            <Filter/>
            {selectedFilter === "overview" && (
                <OverView/>
            )}
            {/* Analysis Content */}
            {selectedFilter === "analysis" && (
                <ScrollView bg="#f4f5f7" flex={1} px={4}>
                    {/* Inventory Analysis Header */}
                    <HStack borderRadius="lg" bg="#fff" mt={4} p={4}>
                        <VStack alignItems="center" mx={3}>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                Nhập kho
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color="gray.600">
                                {formatCurrency(totalValue)}
                            </Text>
                        </VStack>
                        <VStack alignItems="center">
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                Xuất kho
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color="gray.600">
                                {(totalValue - inStockValue).toLocaleString()} ₫
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Chart Section */}
                    <VStack borderRadius="lg" bg="#fff" mt={4} p={4}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="lg" fontWeight="bold">
                                Tổng nhập theo tháng này
                            </Text>
                        </HStack>
                        <LineChart
                            formatYLabel={(t) => convertNumberToCurrency(t).val}
                            data={chartData}
                            width={Dimensions.get("window").width - 40}
                            height={250}
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {borderRadius: 16},
                            }}
                        />
                    </VStack>
                    <HStack justifyContent="space-between" mt={4}>
                        <Box
                            width="49%"
                            bg="#fff"
                            borderRadius="lg"
                            p={4}
                            mb={2}
                            alignItems="center"
                        >
                            <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                {formatCurrency(inventoryChange)}
                            </Text>
                            <Text color="#888">Tồn kho thay đổi</Text>
                        </Box>
                        <Box
                            width="49%"
                            bg="#fff"
                            borderRadius="lg"
                            p={4}
                            mb={2}
                            alignItems="center"
                        >
                            <Text fontSize="2xl" fontWeight="bold">
                                {estimatedStockDays} ngày
                            </Text>
                            <Text color="#888">Ngày tồn kho dự kiến</Text>
                        </Box>
                    </HStack>
                </ScrollView>
            )}
        </VStack>
    );
}

export default ReportWareHouseScreen;
