import {NativeBaseProvider} from "native-base";
import MainRoutes from "./src/navigations/MainRoutes";
import {LogBox} from "react-native";
import {useState} from "react";
import {LoaderApp} from "./src/components/layout/loader.app";
import {SQLiteProvider} from "expo-sqlite";
import {appDatabaseService} from "./src/core/app.database";
import {useLayoutEffect} from 'react'

import * as ScreenOrientation from 'expo-screen-orientation';
import {delaySync} from "./src/ultis/helper";

export default function App() {
    LogBox.ignoreAllLogs(true);
    const [initialState, setInitialState] = useState(false)
    const initDatabase = async () => {
        if (initialState) return;
        setInitialState(true);
        await delaySync(1)
        await appDatabaseService.createDatabase(true);
    }
    useLayoutEffect(() => {
        initDatabase().then(async () => {
            setInitialState(false)
        });
    }, []);

    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    }

    changeScreenOrientation()
    return (
        <SQLiteProvider databaseName={appDatabaseService.DB_NAME}>
            <NativeBaseProvider>
                {initialState ? (<LoaderApp/>) : (
                    <MainRoutes/>
                )}
            </NativeBaseProvider>
        </SQLiteProvider>
    );
}

