import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AnalyticIndexScreen from "./analytic.index.screen";
import AnalyticCreateIncome from "./analytic.create.income";
import AnalyticCreateOutGoing from "./analytic.create.out.going";
import {observer} from "mobx-react";

const AnaliticRoutes = (props) => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'analytic_index'} component={AnalyticIndexScreen}/>
            <Stack.Screen name={'create_income'} component={AnalyticCreateIncome}/>
            <Stack.Screen name={'create_out_going'} component={AnalyticCreateOutGoing}/>
        </Stack.Navigator>
    )
}
export default observer(AnaliticRoutes);