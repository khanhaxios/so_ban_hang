
  

import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Text} from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CreateOrderScreen from "./sell.home.screen";

const SettingsScreen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'sell-home-screen'} component={CreateOrderScreen}/>
        </Stack.Navigator>
    )
}
export default observer(SettingsScreen);