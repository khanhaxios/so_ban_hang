import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {HStack, VStack} from "native-base";
import {HomeHeaderCpn} from "../../components/manage/home.header.cpn";
import {HomeHeaderOverlayCpn} from "../../components/manage/home.header.overlay.cpn";
import {TodayReportCpn} from "../../components/manage/today.report.cpn";

const ManageHomeScreen = ({route, navigation}) => {
    const handlerOpenSearch = () => {

    }
    const handleOpenShopInfo = () => {

    }
    const handleOpenMenuBar = () => {

    }
    return (
        <AppContainer>
            <VStack flex={1} backgroundColor={'white'}>
                <HomeHeaderOverlayCpn/>
                <HomeHeaderCpn/>
                <TodayReportCpn/>
            </VStack>
        </AppContainer>
    )
}
export default observer(ManageHomeScreen);