import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Text} from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ManageHomeScreen from "./manage.home.screen";
import CreateOrderScreen from "../sell/sell.home.screen";
import CreateProductScreen from "../sell/sell.createorder.screen";

const ManageIndexScreen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'manage_home_screen'} component={ManageHomeScreen}/>
            <Stack.Screen name={'manage_sell_screen'} component={CreateOrderScreen}/>
            <Stack.Screen name={'manage_createoder_screen'} component={CreateProductScreen}/>
        </Stack.Navigator>
    )
}
export default observer(ManageIndexScreen);