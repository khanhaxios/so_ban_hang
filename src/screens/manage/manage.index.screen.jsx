import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Text} from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ManageHomeScreen from "./manage.home.screen";

const ManageIndexScreen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'manage_home_screen'} component={ManageHomeScreen}/>
        </Stack.Navigator>
    )
}
export default observer(ManageIndexScreen);