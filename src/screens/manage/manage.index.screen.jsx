import {observer} from "mobx-react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ManageHomeScreen from "./manage.home.screen";
import CreateOrderScreen from "../sell/sell.home.screen";
import CreateProductScreen from "../sell/sell.createorder.screen";
import CustomerListScreen from "../client/client.index.screen";
import AddCustomerScreen from "../client/client.add.screen";
import ProductListScreen from "../product/index.product.screen";
import ProductEditScreen from "../product/product.edit.screen";
import SellListOrder from "../sell/sell.list.order";

const ManageIndexScreen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'manage_home_screen'} component={ManageHomeScreen}/>
            <Stack.Screen name={'manage_sell_screen'} component={CreateOrderScreen}/>
            <Stack.Screen name={'manage_createoder_screen'} component={CreateProductScreen}/>
            <Stack.Screen name={'manage_list_order_screen'} component={SellListOrder}/>
            <Stack.Screen name={'manager_client_screen'} component={CustomerListScreen}/>
            <Stack.Screen name={'client_add_screen'} component={AddCustomerScreen}/>
            <Stack.Screen name={'manager_product_screen'} component={ProductListScreen}/>
            <Stack.Screen name={'product_edit_screen'} component={ProductEditScreen}/>
        </Stack.Navigator>
    )
}
export default observer(ManageIndexScreen);