import {NavigationContainer} from "@react-navigation/native";
import {observer} from "mobx-react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {MAIN_TAB} from "../ultis/constant.data";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

const MainRoutes = () => {
    // bottom tab
    const Tab = createBottomTabNavigator();
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarHideOnKeyboard: true,
                    headerShown: false,
                    tabBarActiveTintColor: '#008528',
                }}
            >
                {MAIN_TAB.map((navItem, index) => {
                    return (
                        <Tab.Screen
                            key={index.toString()}
                            name={navItem.routeName}
                            component={navItem.component}
                            options={{
                                tabBarLabel: navItem.label,
                                tabBarIcon: ({color, size, focused}) => (
                                    <MaterialCommunityIcons name={navItem.icon.name}
                                                            color={focused ? '#008528' : navItem.icon.color}
                                                            size={navItem.icon.size}/>
                                ),
                            }}
                        />
                    )
                })}
            </Tab.Navigator>
        </NavigationContainer>
    )
}
export default observer(MainRoutes);