import React, { useState } from "react";
import {
  Box,
  Text,
  ScrollView,
  HStack,
  Button,
  VStack,
  Center,
  Icon,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";

function ReportWareHouseScreen() {
  const [selectedFilter, setSelectedFilter] = useState("overview");

  // Fake data for warehouse products
  const products = [
    { name: "Sản phẩm A", code: "SP0001", quantity: 50, value: 100000, sold: 10 },
    { name: "Sản phẩm B", code: "SP0002", quantity: 0, value: 0, sold: 50 },
    { name: "Sản phẩm C", code: "SP0003", quantity: 30, value: 75000, sold: 20 },
    { name: "Sản phẩm D", code: "SP0004", quantity: 20, value: 50000, sold: 15 },
  ];

  // Fake data for chart
  const fakeChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        data: [
          50000, 60000, 70000, 55000, 80000, 90000, 85000, 95000, 100000, 120000, 110000, 130000,
        ],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
      },
    ],
  };

  // Function to switch between tabs
  const switchFilter = (filter) => {
    setSelectedFilter(filter);
  };

  // Calculate total values
  const totalValue = products.reduce((total, product) => total + product.value, 0);
  const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
  const inStockProducts = products.filter((product) => product.quantity > 0);
  const outOfStockProducts = products.filter((product) => product.quantity === 0);
  const inStockValue = inStockProducts.reduce((total, product) => total + product.value, 0);
  const outOfStockQuantity = outOfStockProducts.length;

  const totalSold = products.reduce((total, product) => total + product.sold, 0); // Tổng số lượng đã bán
  const totalSalesValue = products.reduce((total, product) => total + (product.sold * product.value / (product.sold + product.quantity)), 0); // Tổng giá trị hàng đã bán (giả định giá trị dựa trên tỷ lệ số lượng bán)
  const inventoryChange = totalValue - totalSalesValue; // Chênh lệch giá trị tồn kho

  const averageDailySales = totalSold / 30; // Giả định bán hết trong 30 ngày
  const estimatedStockDays = averageDailySales > 0 ? Math.round(totalQuantity / averageDailySales) : 0; // Ngày tồn kho dự kiến

  return (
    <ScrollView bg="#f4f5f7" flex={1} px={4}>
      {/* Filter Buttons */}
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

      {/* Overview Content */}
      {selectedFilter === "overview" && (
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
            {outOfStockProducts.length > 0 ? (
              <VStack mt={2}>
                <Text fontSize="sm" color={"#888"}>
                  Sản phẩm
                </Text>
                <VStack>
                  {outOfStockProducts.map((product, index) => (
                    <VStack key={index}>
                      <HStack
                        justifyContent="space-between"
                        my={2}
                        p={2}
                        borderRadius={4}
                      >
                        <HStack>
                          <VStack
                            mx={3}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            <Text>{index + 1}</Text>
                          </VStack>
                          <VStack>
                            <Text fontSize={"md"} fontWeight={"medium"}>
                              {product.name}
                            </Text>
                            <Text fontSize={"sm"} color={"#888"}>
                              {product.code}
                            </Text>
                          </VStack>
                        </HStack>

                        <VStack>
                          <Text>Giá trị</Text>
                          <Text color={"red.400"}>{product.value} ₫</Text>
                          <Text>SL: {product.quantity}</Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  ))}
                </VStack>
              </VStack>
            ) : (
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
                <Button bg="#007bff">Nhập hàng ngay</Button>
              </Center>
            )}
          </VStack>
        </>
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
                {inStockValue.toLocaleString()} ₫
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
              data={fakeChartData}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
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
                {inventoryChange.toLocaleString()} ₫
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
    </ScrollView>
  );
}

export default ReportWareHouseScreen;
