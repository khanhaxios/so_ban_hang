import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Text} from 'react-native'

const ManageIndexScreen = () => {
    return (
        <AppContainer>
            <Text>Manage Index Screen</Text>
        </AppContainer>
    )
}
export default observer(ManageIndexScreen);