import { Box, HStack, Image, Text, VStack } from "native-base";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

function ReportSellScreen({ stats }) {
  const chartData = {
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

  return (
    <VStack>
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
            Doanh thu
          </Text>
          <VStack>
            <HStack justifyContent={"center"} alignItems={"flex-end"}>
              <Text fontSize="4xl" color="green.600" bold>
                {stats.revenue.toLocaleString()}đ
              </Text>
              <Text fontSize="lg" color="red.400" alignItems={"end"}>
                ↓ 8%
              </Text>
            </HStack>
          </VStack>
        </VStack>

        <HStack justifyContent="space-between" mt={2}>
  <VStack alignItems="flex-start" width="1/3">
    <Text fontSize="sm" color="gray.500" pb={1.5}>
      Đơn hàng
    </Text>
    <HStack alignItems={"flex-end"}>
      <Text fontSize="lg" bold>
        {stats.orders}
      </Text>
      <Text fontSize="xs" color="red.400" alignItems={"end"}>
        ↓ 15%
      </Text>
    </HStack>
  </VStack>
  <VStack alignItems="flex-start" width="1/3">
    <Text fontSize="sm" color="gray.500" pb={1.5}>
      Khách hàng
    </Text>
    <HStack alignItems={"flex-end"}>
      <Text fontSize="lg" bold>
        {stats.customers}
      </Text>
      <Text fontSize="xs" color="red.400" alignItems={"end"}>
        ↓ 15%
      </Text>
    </HStack>
  </VStack>
  <VStack alignItems="flex-start" width="1/3">
    <Text fontSize="sm" color="gray.500" pb={1.5}>
      Trung bình/đơn
    </Text>
    <Text fontSize="lg" bold>
      {stats.avgOrder.toLocaleString()}đ
    </Text>
  </VStack>
</HStack>

      </VStack>

      {/* Trend Chart */}
      <VStack pt={5}>
        <Text fontSize="lg" mb={2} mx={4} color="gray.500">
          Biểu đồ xu hướng theo
        </Text>
        <Box px={4} py={2} mt={2} bg="white">
          <LineChart
            data={chartData}
            width={screenWidth - 32} // Full width minus padding
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Box>
      </VStack>

      {/* Cash Flow Section */}
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

    
      <VStack py={5}>
      <Text fontSize="lg" mb={2} mx={4} color="gray.500">
          Doanh thu chi tiết
        </Text>

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


    </VStack>
  );
}

export default ReportSellScreen;
