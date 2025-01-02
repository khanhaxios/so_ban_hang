import {AppContainer} from "../../components/layout/container.cpn";
import {observer} from "mobx-react";
import {Button, HStack, ScrollView, Text, VStack} from "native-base";
import {useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Dimensions} from "react-native";
import ReportSellScreen from "./report.sell.screen";
import ReportWareHouseScreen from "./report.warehouse.screen";
import ReportProfitScreen from "./report.profit.screen";
import PagerView from "react-native-pager-view";
import {useNavigation} from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const ReportIndexScreen = ({navigation, route}) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getTabStyle = (tab) => {
        return {
            color: activeTab === tab ? "green" : "black",
            textDecorationLine: activeTab === tab ? "underline" : "none",
        };
    };
    const nav = useNavigation();

    return (
        <AppContainer>
            <VStack space={2} px={4} py={2} bg="white">
                <HStack justifyContent="space-between" alignItems="center">
                    <Button variant="ghost" onPress={() => nav.goBack()}>
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
                    <Button variant="ghost" onPress={() => handleTabChange(0)}>
                        <Text style={getTabStyle(0)} fontSize={"sm"}>
                            Bán hàng
                        </Text>
                    </Button>
                    <Button variant="ghost" onPress={() => handleTabChange(1)}>
                        <Text style={getTabStyle(1)} fontSize={"sm"}>
                            Lãi lỗ
                        </Text>
                    </Button>
                    <Button variant="ghost" onPress={() => handleTabChange(2)}>
                        <Text style={getTabStyle(2)} fontSize={"sm"}>
                            Kho hàng
                        </Text>
                    </Button>
                </HStack>
            </VStack>
            <PagerView onPageSelected={(e) => {
                const {position} = e.nativeEvent;
                setActiveTab(position);
            }} style={{width: '100%', height: '100%'}} initialPage={0}>
                <ReportSellScreen/>
                <ReportProfitScreen/>
                <ReportWareHouseScreen/>
            </PagerView>
        </AppContainer>
    );
};

export default observer(ReportIndexScreen);
