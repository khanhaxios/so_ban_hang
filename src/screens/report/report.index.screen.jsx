import {AppContainer} from "../../components/layout/container.cpn";
import {observer} from "mobx-react";
import {Text} from "react-native";

const ReportIndexScreen = ({navigation, route}) => {
    return (
        <AppContainer>
            <Text>Manage Index Screen</Text>
        </AppContainer>
    )
}
export default observer(ReportIndexScreen);