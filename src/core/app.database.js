import * as SQLite from 'expo-sqlite';
import {ToastAndroid} from "react-native";
import {storeService} from "../services/store.service";

export const types = ['Chưa phân loại', 'Trả lãi', 'Sinh hoạt gia đình', 'Khoản chi khác', 'Quảng cáo', 'Vận chuyển', 'Giao hàng', 'Mặt bằng', 'Thuê nhà', 'Cá nhân', 'Công nhân viên', 'Thanh toán nợ', 'Thuế phí', 'Ăn uống', 'Thuê nhà', 'Quản lý,bán hàng', 'Điện,nước,internet', 'Đóng gói hàng hóa', 'Mua sắm',
    'Tặng,cho', 'Nguyên vật liệu', 'Mặt bằng', 'Nhập hàng', 'Thiết bị dụng cụ', 'Lương,thưởng'];
export const moneySources = ['Chưa phân loại', 'Tiền mặt', 'Ví điện tử', 'Ngân hàng'];

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
        const tables = ['inout']; // Replace with your table names
        const db = await SQLite.openDatabaseAsync("kan_store_management.db");
        for (const table of tables) {
            await db.execAsync(`DROP TABLE IF EXISTS ${table};`);
            console.log('dropped table : ', table);
        }
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
                    sold REAL,
                    desc TEXT,
                    originPrice REAL,
                    discount REAL,
                    barCode TEXT,
                    quantity INTEGER,
                    quantityType TEXT,
                    categoryId INTEGER,
                    storeId INTEGER,
                    isSelling INTEGER,
                    FOREIGN KEY (categoryId) REFERENCES categories,
                    FOREIGN KEY (storeId) REFERENCES stores(id)
            );`;

            let createCustomerTableQuery = `
                CREATE TABLE IF NOT EXISTS customers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    avatar TEXT,
                    name TEXT,
                    phone TEXT
            );`;

            let createOrderTableQuery = `
                 CREATE TABLE IF NOT EXISTS orders(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        amount REAL,
                        income REAL DEFAULT 0,
                        expense REAL DEFAULT 0,
                        createdAt REAL,
                        updatedAt REAL
                 );
            `;
            let createInsertProductHistoryQuery = `
             CREATE TABLE IF NOT EXISTS productsHistory(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        amount REAL,
                        productId INTEGER,
                        quantity REAL,
                        createdAt REAL,
                        updatedAt REAL,
                    FOREIGN KEY (productId) REFERENCES products(id)
                 );
            `;
            let createOrderDetailsTableQuery = `
                CREATE TABLE IF NOT EXISTS ordersDetail(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        productId INTEGER,
                        orderId INTEGER,
                        quantity INTEGER,
                        price REAL,
                        createdAt REAL,
                         FOREIGN KEY (orderId) REFERENCES orders(id),
                    FOREIGN KEY (productId) REFERENCES products(id)
                );
            `;
            let createIncomeType = `
             CREATE TABLE IF NOT EXISTS incomeType(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        unique(name)
                );
            `
            let createMoneySrc = `
             CREATE TABLE IF NOT EXISTS moneySource(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        cost REAL,
                        unique(name)
                );
            `
            let createInOutTable = `
              CREATE TABLE IF NOT EXISTS inout(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        incomeTypeId INTEGER,
                        moneySourceId INTEGER,
                        note TEXT,
                        image TEXT,
                        type INTEGER DEFAULT 0,
                        createdAt REAL,
                        cost REAL DEFAULT 0,
                    FOREIGN KEY (incomeTypeId) REFERENCES incomeType(id),
                    FOREIGN KEY (moneySourceId) REFERENCES moneySource(id)
                );
            `;
            await db.execAsync(createStoreTableQuery);
            await db.execAsync(createCategoryTableQuery);
            await db.execAsync(createProductTypeQuery);
            await db.execAsync(createProductsTableQuery);
            await db.execAsync(createCustomerTableQuery);
            await db.execAsync(createOrderTableQuery);
            await db.execAsync(createOrderDetailsTableQuery);
            await db.execAsync(createInsertProductHistoryQuery);
            await db.execAsync(createIncomeType);
            await db.execAsync(createMoneySrc);
            await db.execAsync(createInOutTable)

            // insert store
            const checkExit = await db.getFirstAsync(`SELECT name from ${this.TABLE_STORE} where name='HST store'`)
            if (!checkExit) {
                const initStoreQuery = `INSERT INTO ${this.TABLE_STORE} (name,phone,address,desc,openTime,openTimeType) values('HST store','0376658437','Hai Phong','My New Store','From 7AM To 10PM',0) `;
                await db.runAsync(initStoreQuery);
            }

            for (let type of types) {
                const query = `INSERT OR IGNORE INTO incomeType (name) VALUES ('${type}')`;
                await db.execAsync(query);
            }
            for (let string of moneySources) {
                const query = `INSERT OR IGNORE INTO moneySource (name,cost) VALUES ('${string}',0)`;
                await db.execAsync(query);
            }

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

    async createGetByQuery(table, by, value) {
        return `SELECT * FROM ${table} WHERE ${by} = '${value}'`;
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