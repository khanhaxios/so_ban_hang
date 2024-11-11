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
            <Button variant="ghost" onPress={() => handleTabChange("Bán hàng")} >
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
      

        {/* Hiển thị các màn hình dựa trên tab được chọn */}
        {activeTab === "Bán hàng" && <ReportSellScreen />}
        {activeTab === "Lãi lỗ" && <ReportProfitScreen />}
        {activeTab === "Kho hàng" && <ReportWareHouseScreen />}
        {activeTab === "Thu chi" && <ReportRevenueScreen />}
      </ScrollView>
    </AppContainer>
  );
};

export default observer(ReportIndexScreen);
