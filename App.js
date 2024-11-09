import {NativeBaseProvider} from "native-base";
import MainRoutes from "./src/navigations/MainRoutes";
import {LogBox, ToastAndroid} from "react-native";
import {useState} from "react";
import {LoaderApp} from "./src/components/layout/loader.app";
import {SQLiteProvider} from "expo-sqlite";
import {appDatabaseService} from "./src/core/app.database";
import {useLayoutEffect} from 'react'
import {productService} from "./src/services/product.service";
import {ProductModel} from "./src/models/product.model";

import * as ScreenOrientation from 'expo-screen-orientation';




export default function App() {
    LogBox.ignoreAllLogs(true);
    const [initialState, setInitialState] = useState(false)
    // run init data base
    const initDatabase = async () => {
        if (initialState) return;
        setInitialState(true);
        await appDatabaseService.createDatabase();
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
                {initialState && (<LoaderApp/>)}
                <MainRoutes/>
            </NativeBaseProvider>
        </SQLiteProvider>

    );
}

