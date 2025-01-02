import {Platform, StyleSheet, SafeAreaView, StatusBar} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export const AppContainer = (props) => {
    const bottomHeight = useBottomTabBarHeight();
    return (
        <SafeAreaView style={[style.container]}>{props.children}</SafeAreaView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});
