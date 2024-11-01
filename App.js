    import {NativeBaseProvider} from "native-base";
import MainRoutes from "./src/navigations/MainRoutes";
    import {LogBox} from "react-native";

export default function App() {
    LogBox.ignoreAllLogs(true)
    return (
        <NativeBaseProvider>
            <MainRoutes/>
        </NativeBaseProvider>
    );
}

