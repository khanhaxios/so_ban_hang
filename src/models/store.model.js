import {makeAutoObservable} from "mobx";
import {storeService} from "../services/store.service";
import {appDatabaseService} from "../core/app.database";
import * as SQLite from 'expo-sqlite';

export function StoreModel(id, name, phone, address, openTime, openTimeType) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.openTime = openTime;
    this.openTimeType = openTimeType;
}

class Store {
    currentStore = null;

    constructor() {
        makeAutoObservable(this)
    }

    setStore = (val) => this.currentStore = val;

    async getStore() {
        try {
            const db = await appDatabaseService.getConnection();
            const store = await storeService.getAllStore(db);
            this.setStore(store[0]);
        } catch (e) {
            console.log(e)
        }
    }
}

export const store = new Store();