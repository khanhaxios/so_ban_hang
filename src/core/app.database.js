import * as SQLite from 'expo-sqlite';
import {ToastAndroid} from "react-native";

class AppDatabaseService {
    DB_NAME = "kan_store_management.db";
    DB = null;
    TABLE_STORE = "stores";
    TABLE_PRODUCT = "products";
    TABLE_CATEGORY = "categories";
    TABLE_PRODUCT_TYPE = "product_types"

    constructor() {
    }

    async createDatabase() {
        try {
            const db = await SQLite.openDatabaseAsync("kan_store_management.db");
            let createStoreTableQuery = `
PRAGMA journal_mode = 'wal';
PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    address TEXT,
    desc TEXT,
    openTime TEXT,
    openTimeType INTEGER
);`;
            let createCategoryTableQuery = `
        CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryName TEXT,
    storeId INTEGER,
      FOREIGN KEY (storeId) REFERENCES stores(id)
);
        `;
            let createProductTypeQuery = `
        CREATE TABLE IF NOT EXISTS product_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    image TEXT,
    price REAL,
    originPrice REAL,
    code TEXT,
    discountPrice REAL,
    singlePrice REAL,
    isShow INTEGER,
       storeId INTEGER,
      FOREIGN KEY (storeId) REFERENCES stores(id)
);`
            let createProductsTableQuery = `
            CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT,
    name TEXT,
    price REAL,
    desc TEXT,
    originPrice REAL,
    discount REAL,
    barCode TEXT,
    quantity INTEGER,
    quantityType TEXT,
    categoryId INTEGER,
    productTypeId INTEGER,
    storeId INTEGER,
    FOREIGN KEY (categoryId) REFERENCES categories,
    FOREIGN KEY (productTypeId) REFERENCES product_types(id),
    FOREIGN KEY (storeId) REFERENCES stores(id)
);
        `;
            await db.execAsync(createStoreTableQuery);
            await db.execAsync(createCategoryTableQuery);
            await db.execAsync(createProductTypeQuery);
            await db.execAsync(createProductsTableQuery);

            // console.log(await db.runAsync("INSERT INTO stores (name, phone,address,openTime,openTimeType,desc) VALUES ('store test 1','0376658437','hai phong','9PM - 22PM',1,'description');"));
            console.log(await db.getAllAsync('SELECT * from stores'))
        } catch (e) {
            console.log(e)
            ToastAndroid.show("Có lỗi xảy ra khi khởi tạo ứng dụng hãy chạy lại.", ToastAndroid.LONG);
        }
    };

    async getFirst(query) {
        return await this.DB.getFirstAsync(query);
    }

    async getAll(query) {
        return await this.DB.getAllAsync(query);
    }

    async insert(query) {
        return await this.DB.runAsync(query);
    }

    async statement(query) {
        return await this.DB.prepareAsync(query)
    }

}

export const appDatabaseService = new AppDatabaseService();