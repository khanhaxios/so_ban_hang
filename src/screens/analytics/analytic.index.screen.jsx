import {AppContainer} from "../../components/layout/container.cpn";
import {observer} from "mobx-react";
import {Text} from "react-native";

const AnalyticIndexScreen = ({navigation, route}) => {
    return (
        <AppContainer>
            <Text>Manage Index Screen</Text>

        </AppContainer>
    )
}
export default observer(AnalyticIndexScreen);