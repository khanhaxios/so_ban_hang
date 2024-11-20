import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Text} from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ManageHomeScreen from "./manage.home.screen";
import CreateOrderScreen from "../sell/sell.home.screen";
import CreateProductScreen from "../sell/sell.createorder.screen";
import CustomerListScreen from "../client/client.index.screen";
import AddCustomerScreen from "../client/client.add.screen";
import ProductListScreen from "../product/index.product.screen";

const ManageIndexScreen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'manage_home_screen'} component={ManageHomeScreen}/>
            <Stack.Screen name={'manage_sell_screen'} component={CreateOrderScreen}/>
            <Stack.Screen name={'manage_createoder_screen'} component={CreateProductScreen}/>
            <Stack.Screen name={'manager_client_screen'} component={CustomerListScreen}/>
            <Stack.Screen name={'client_add_screen'} component={AddCustomerScreen}/>
            <Stack.Screen name={'manager_product_screen'} component={ProductListScreen}/>
        </Stack.Navigator>
    )
}
export default observer(ManageIndexScreen);