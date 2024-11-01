import {Platform, StyleSheet, SafeAreaView, StatusBar} from "react-native";

export const AppContainer = (props) => (
    <SafeAreaView style={style.container}>{props.children}</SafeAreaView>
)
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});
