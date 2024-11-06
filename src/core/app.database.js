import * as SQLite from 'expo-sqlite';
import {ToastAndroid} from "react-native";

class AppDatabaseService {
    DB_NAME = "kan_store_management.db";
    DB = null;
    TABLE_STORE = "stores";
    TABLE_PRODUCT = "products";
    TABLE_CATEGORY = "categories";
    TABLE_PRODUCT_TYPE = "product_types"
    getConnection = async () => {
        return await SQLite.openDatabaseAsync("kan_store_management.db");
    }

    async clearDatabase() {
        const tables = ['stores', 'products', 'categories', 'product_types']; // Replace with your table names
        const db = await appDatabaseService.getConnection();
        db.transaction(tx => {
            tables.forEach(table => {
                tx.executeSql(`DROP TABLE IF EXISTS ${table};`, [], () => {
                    console.log(`Dropped table ${table}`);
                }, (_, error) => {
                    console.error(`Error dropping table ${table}:`, error);
                    return false;
                });
            });
        });
    }

    async createDatabase(reset = false) {
        try {
            if (reset) {
                await this.clearDatabase();
            }
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
            );`;

            await db.execAsync(createStoreTableQuery);
            await db.execAsync(createCategoryTableQuery);
            await db.execAsync(createProductTypeQuery);
            await db.execAsync(createProductsTableQuery);
        } catch (e) {
            console.log(e)
            ToastAndroid.show("Có lỗi xảy ra khi khởi tạo ứng dụng hãy chạy lại.", ToastAndroid.LONG);
        }
    };

    async getFirst(db, query) {
        return await db.getFirstAsync(query);
    }

    async getAll(db, query) {
        console.log("query :: ", query);
        return await db.getAllAsync(query);
    }

    async insert(query) {
        console.log("query :: ", query);
        return await this.DB.runAsync(query);
    }

    async statement(db, query) {
        console.log("query :: ", query);
        return await db.prepareAsync(query)
    }

    async createGetByIdQuery(table, id) {
        return `SELECT * FROM ${table} WHERE id = ${id}`;
    }

    async createInsertStatement(db, table, datasource) {
        const keys = Object.keys(datasource).filter(f => f !== 'id');
        const keyQuery =
            keys.join(",");
        const keyValue = keys.map(k => '$' + k).join(",");
        const query = `INSERT INTO ${table}  (${keyQuery}) VALUES (${keyValue})`;
        return await db.prepareAsync(query);
    }

    async createUpdateQuery(db, table, datasource, id) {
        const keys = Object.keys(datasource).filter(f => f !== 'id');
        const keyValue = keys.map(k => `${k} = $${k}`).join(",");
        return `UPDATE ${table} SET ${keyValue} WHERE id = ${id}`;
    }

    async createDeleteQuery(db, table, id) {
        return `DELETE FROM ${table} WHERE id = ${id}`;
    }

    createInsertStatementArgs(datasource) {
        const keys = Object.keys(datasource).filter(f => f !== 'id');
        let dataSrcValue = {};
        keys.forEach((v, i) => {
            dataSrcValue[`$${v}`] = datasource[v];
        });
        return dataSrcValue;
    }
}

export const appDatabaseService = new AppDatabaseService();