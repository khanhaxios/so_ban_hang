import { HStack, VStack, Text, Box, Icon, Button, Center, Image } from "native-base";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, ScrollView } from "react-native";
import FilterSection from "../../components/filter/FilterSection.cpn";

const screenWidth = Dimensions.get("window").width;

function ReportProfitScreen() {
  const [dataFake, setDataFake] = useState([
    { date: "01/11", revenue: 1000000, cost: 500000, profit: 500000 },
    { date: "08/11", revenue: 2000000, cost: 1200000, profit: 800000 },
    { date: "15/11", revenue: 1500000, cost: 1000000, profit: 500000 },
    { date: "22/11", revenue: 2500000, cost: 1300000, profit: 1200000 },
    { date: "29/11", revenue: 3000000, cost: 1500000, profit: 1500000 },
  ]);

  const [filteredData, setFilteredData] = useState(dataFake);

  // Tính tổng doanh thu, giá vốn và lợi nhuận
  const totalRevenue = dataFake.reduce((acc, item) => acc + item.revenue, 0);
  const totalCost = dataFake.reduce((acc, item) => acc + item.cost, 0);
  const totalProfit = dataFake.reduce((acc, item) => acc + item.profit, 0);

  return (
    <ScrollView bg="#f4f5f7" flex={1} px={4} py={2}>
      {/* Filter Section */}
      <VStack mb={4}>
        <HStack justifyContent="space-around">
          <VStack width="35%">
            <FilterSection
              setFilteredData={setFilteredData}
              data={dataFake}
            />
          </VStack>
        </HStack>
      </VStack>

      <VStack
        space={2}
        px={4}
        py={2}
        bg="white"
        mt={2}
        justifyContent={"center"}
        mx={4}
        borderRadius={6}
      >
        <VStack justifyContent="space-between" mt={2}>
          <Text fontSize="sm" textAlign={"center"}>
            Lợi nhuận
          </Text>
          <VStack>
            <HStack justifyContent={"center"} alignItems={"flex-end"}>
              <Text fontSize="4xl" color="green.600" bold>
              {totalProfit.toLocaleString()} ₫
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
              {totalRevenue.toLocaleString()} ₫
              </Text>
              <Text fontSize="xs" color="red.400" alignItems={"end"}>
                ↓ 15%
              </Text>
            </HStack>
          </VStack>

          <VStack alignItems="center" width="1/3">
            <Text fontSize="sm" color="gray.500" pb={1.5}>
             Giá vốn
            </Text>
            <HStack alignItems={"flex-end"}>
              <Text fontSize="lg" bold>
              {totalCost.toLocaleString()} ₫
              </Text>
              <Text fontSize="xs" color="red.400" alignItems={"end"}>
                ↓ 15%
              </Text>
            </HStack>
          </VStack>

          <VStack alignItems="center" width="1/3">
            <Text fontSize="sm" color="gray.500" pb={1.5}>
              Lợi nhuận khác
            </Text>
            <Text fontSize="lg" bold>
              {totalProfit.toLocaleString()} ₫
            </Text>
          </VStack>
        </HStack>
      </VStack>

     
      {/* Profit Trend Line Chart */}
      <VStack borderRadius="lg" bg="#fff" p={4} my={4} shadow={1}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Xu hướng lãi lỗ
        </Text>
        <LineChart
          data={{
            labels: dataFake.map(item => item.date),
            datasets: [
              {
                data: dataFake.map(item => item.profit),
                color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`, // Đường lợi nhuận
              },
            ],
          }}
          width={screenWidth - 40} // Chiều rộng biểu đồ
          height={220}
          yAxisLabel=""
          yAxisSuffix=" ₫"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0, // Số chữ số thập phân
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu của đường biểu đồ
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu của nhãn
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
            borderRadius: 16,
          }}
        />
      </VStack>

      {/* Profit Details */}
      <VStack borderRadius="lg" bg="#fff" p={4} mb={4} shadow={1}>
        <Text fontSize="md" fontWeight="bold" color="gray.600" mb={2}>
          Chi tiết lãi lỗ
        </Text>
        {dataFake.length === 0 ? (
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
        ) : (
          dataFake.map((item, index) => (
            <HStack key={index} justifyContent="space-between" my={1}>
              <Text>{item.date}</Text>
              <Text>{item.profit.toLocaleString()} ₫</Text>
            </HStack>
          ))
        )}
      </VStack>

      {/* Profit By Section */}
      <VStack borderRadius="lg" bg="#fff" p={4} mb={4} shadow={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md" fontWeight="bold">
            Lợi nhuận theo
          </Text>
          <Button size="sm" variant="outline" colorScheme="blue">
            Sản phẩm
          </Button>
        
        </HStack>
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
      </VStack>
    </ScrollView>
  );
}

export default ReportProfitScreen;
