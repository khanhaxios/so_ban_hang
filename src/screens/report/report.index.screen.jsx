import { AppContainer } from "../../components/layout/container.cpn";
import { observer } from "mobx-react";
import { Box, Button, HStack, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";
import FilterSection from "../../components/filter/FilterSection.cpn";
import ReportSellScreen from "./report.sell.screen";
import ReportRevenueScreen from "./report.revenue.screen";
import ReportWareHouseScreen from "./report.warehouse.screen";
import ReportProfitScreen from "./report.profit.screen";

const screenWidth = Dimensions.get("window").width;

const ReportIndexScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState("Bán hàng"); 
  const [dataFake, setDataFake] = useState([
    {
      type: "Bán hàng",
      description: "Sản phẩm A",
      amount: 500000,
      isExpense: false,
      method: "Tiền mặt",
      date: "06/11/2024",
    },
    {
      type: "Mua hàng",
      description: "Sản phẩm B",
      amount: 300000,
      isExpense: true,
      method: "Chuyển khoản",
      date: "05/11/2024",
    },
    {
      type: "Bán hàng",
      description: "Sản phẩm C",
      amount: 215000,
      isExpense: false,
      method: "Ví điện tử",
      date: "06/11/2024",
    },
  ]);

  const [filteredData, setFilteredData] = useState(dataFake);

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    avgOrder: 0,
  });

  useEffect(() => {
    const sales = filteredData?.filter((item) => item.type === "Bán hàng");
    const totalRevenue = sales?.reduce((acc, sale) => acc + sale.amount, 0);
    const totalOrders = sales?.length;
    const totalCustomers = totalOrders;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStats({
      revenue: totalRevenue,
      orders: totalOrders,
      customers: totalCustomers,
      avgOrder: avgOrder,
    });
  }, [filteredData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Cập nhật tab hiện tại khi bấm vào
  };

  const getTabStyle = (tab) => {
    return {
      color: activeTab === tab ? "green" : "black",
      textDecorationLine: activeTab === tab ? "underline" : "none",
    };
  };

  return (
    <AppContainer>
      <ScrollView>
        {/* Header */}
        <VStack space={2} px={4} py={2} bg="white">

          <HStack justifyContent="space-between" alignItems="center">
            <Button variant="ghost">
              <Ionicons
                name={"chevron-back-outline"}
                color={"black"}
                size={24}
              />
            </Button>
            <Text bold fontSize={"lg"}>
              Báo cáo
            </Text>
            <Button variant="ghost">
              <Ionicons
                name={"alert-circle-outline"}
                color={"black"}
                size={24}
              />
            </Button>
          </HStack>
          <HStack space={4} justifyContent="space-between">
            <Button variant="ghost" onPress={() => handleTabChange("Bán hàng")}>
              <Text style={getTabStyle("Bán hàng")} fontSize={"sm"}>
                Bán hàng
              </Text>
            </Button>
            <Button variant="ghost" onPress={() => handleTabChange("Lãi lỗ")}>
              <Text style={getTabStyle("Lãi lỗ")} fontSize={"sm"}>
                Lãi lỗ
              </Text>
            </Button>
            <Button variant="ghost" onPress={() => handleTabChange("Kho hàng")}>
              <Text style={getTabStyle("Kho hàng")} fontSize={"sm"}>
                Kho hàng
              </Text>
            </Button>
            <Button variant="ghost" onPress={() => handleTabChange("Thu chi")}>
              <Text style={getTabStyle("Thu chi")} fontSize={"sm"}>
                Thu chi
              </Text>
            </Button>
          </HStack>
        </VStack>

        {/* Date Filter */}
        <VStack>
         
                <HStack justifyContent="space-around">
                <VStack width={"35%"}>
                <FilterSection setFilteredData={setFilteredData} data={dataFake} />
                  </VStack>
                  </HStack>
    
        </VStack>

        {/* Hiển thị các màn hình dựa trên tab được chọn */}
        {activeTab === "Bán hàng" && <ReportSellScreen stats={stats} />}
        {activeTab === "Lãi lỗ" && <ReportProfitScreen stats={stats} />}
        {activeTab === "Kho hàng" && <ReportWareHouseScreen stats={stats} />}
        {activeTab === "Thu chi" && <ReportRevenueScreen stats={stats} />}
      </ScrollView>
    </AppContainer>
  );
};

export default observer(ReportIndexScreen);
