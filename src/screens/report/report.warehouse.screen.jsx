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
  const dataAvailable = false;
  const [selectedFilter, setSelectedFilter] = useState("overview");

  // Hàm để chuyển đổi giữa các tab
  const switchFilter = (filter) => {
    setSelectedFilter(filter);
  };

  // Dữ liệu giả lập cho biểu đồ
  const fakeChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: [50000, 30000, 40000, 25000, 60000, 20000, 30000, 40000, 45000, 35000, 50000, 55000],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`, // Màu của đường
      },
    ],
  };
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
                      fontWeight={
                        selectedFilter === "overview" ? "bold" : "normal"
                      }
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
                      fontWeight={
                        selectedFilter === "analysis" ? "bold" : "normal"
                      }
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
          <HStack flexWrap="wrap" justifyContent="space-between" mt={4}>
            <Box
              width="48%"
              bg="#fff"
              borderRadius="lg"
              p={4}
              mb={2}
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="bold">
                {dataAvailable ? "100,000 ₫" : "0 ₫"}
              </Text>
              <Text color="#888">Giá trị kho</Text>
            </Box>
            <Box
              width="48%"
              bg="#fff"
              borderRadius="lg"
              p={4}
              mb={2}
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="bold">
                {dataAvailable ? "10" : "0"}
              </Text>
              <Text color="#888">Sản phẩm còn bán</Text>
            </Box>
          </HStack>
          <VStack borderRadius="lg" bg="#fff" mt={6} p={3} fontSize={28}>
            <Text>Sản phẩm hết hàng</Text>
            <Center>
              <Icon
                as={MaterialIcons}
                name="search"
                size="lg"
                color="#888"
                mb={3}
              />
              <Text color="#888" mb={4}>
                Chưa có sản phẩm tồn kho
              </Text>
              <Button bg="#007bff">Nhập hàng ngay</Button>
            </Center>
          </VStack>
        </>
      )}

      {/* Analysis Content */}
      {selectedFilter === "analysis" && (
        <ScrollView bg="#f4f5f7" flex={1} px={4}>
          {/* Header */}
          <HStack borderRadius="lg" bg="#fff" mt={4} p={4} >
            <VStack justifyContent="space-between" alignItems="center" mx={3}>
              <Text fontSize="md" fontWeight="bold" mb={2}>
                Nhập kho
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={'gray'}>
                0 ₫
              </Text>
            </VStack>
            <VStack justifyContent="space-between" alignItems="center">
              <Text fontSize="md" fontWeight="bold" mb={2}>
                Xuất kho
              </Text>
              <Text fontSize="xl" fontWeight="bold"  color={'gray'}>
                0 ₫
              </Text>
            </VStack>
          </HStack>

          {/* Filter and Chart Section */}
          <VStack borderRadius="lg" bg="#fff" mt={4} p={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                Tổng nhập theo tháng này
              </Text>
              <Icon as={MaterialIcons} name="calendar-today" size="sm" color="gray.500" />
            </HStack>

            {/* Line Chart */}
            <Center my={6}>
              <LineChart
                data={fakeChartData}
                width={Dimensions.get("window").width * 0.9} // Độ rộng biểu đồ
                height={220}
                yAxisSuffix="₫"
                chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                bezier
                style={{
                  borderRadius: 16,
                }}
              />
            </Center>
          </VStack>
         

          {/* Tổng quan phân loại */}
          <VStack borderRadius="lg" bg="#fff" mt={4} p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Tổng quan phân loại
            </Text>
            <Text color="#888">Chưa phân loại</Text>
          </VStack>

          {/* Additional Data Boxes */}
          <VStack borderRadius="lg" bg="#fff" mt={4} p={4}>
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="lg" fontWeight="bold">
                Tồn kho thay đổi
              </Text>
              <Text color="red.500" fontSize="2xl" fontWeight="bold">
                0 ₫
              </Text>
            </HStack>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                Ngày tồn kho dự kiến
              </Text>
              <Text color="blue.500" fontSize="2xl" fontWeight="bold">
                0 ngày
              </Text>
            </HStack>
          </VStack>
        </ScrollView>
      )}
    </ScrollView>
  );
}

export default ReportWareHouseScreen;
