import {makeAutoObservable} from "mobx";
import {appDatabaseService} from "../core/app.database";

class OrderModel {
    orders = [];

    orderWithDetail = [];

    constructor() {
        makeAutoObservable(this);
    }

    setOrder = (val) => this.orders = val;
    setOrderWithDetail = (val) => this.orderWithDetail = val;

    async loadAllOrder() {
        try {
            const db = await appDatabaseService.getConnection();
            const result = await appDatabaseService.getAll(db, 'SELECT * FROM orders');
            this.setOrder(result);
        } catch (e) {
            console.log(e);
        }
    }

    async loadAllOrderWithDetail() {
        try {
            const db = await appDatabaseService.getConnection();
            const result = await appDatabaseService.getAll(db, 'SELECT * FROM orders JOIN ordersDetail on orders.id = ordersDetail.orderId');
            this.setOrderWithDetail(result);
        } catch (e) {
            console.log(e);
        }
    }

    async addOrder(newOrder) {
        try {
            const db = await appDatabaseService.getConnection();
            const stmt = await appDatabaseService.createInsertStatement(db, 'orders', newOrder.order);
            const result = await stmt.executeAsync(appDatabaseService.createInsertStatementArgs(newOrder.order));
            for (let i = 0; i < newOrder.details.length; i++) {
                newOrder.details[i].orderId = result.lastInsertRowId;
                const s = await appDatabaseService.createInsertStatement(db, 'ordersDetail', newOrder.details[i]);
                await s.executeAsync(appDatabaseService.createInsertStatementArgs(newOrder.details[i]));
                await db.execAsync(`UPDATE products SET sold = sold + ${newOrder.details[i].quantity} WHERE id = ${newOrder.details[i].productId}`);
                await db.execAsync(`UPDATE products SET quantity = quantity - ${newOrder.details[i].quantity} WHERE id = ${newOrder.details[i].productId}`);
            }
            return result.lastInsertRowId;
        } catch (e) {
            console.log(e);
        }
    }

    async deleteOrder(id) {
        try {
            const db = await appDatabaseService.getConnection();
            const query = await appDatabaseService.createDeleteQuery(db, 'orders', id);
            await db.runAsync(query);
        } catch (e) {
            console.log(e);
        }
    }

    async getOrderDetail(id) {

    }


    async getAllOrder(page) {
        try {
            const limit = 20;
            const ofs = (page - 1) * limit;
            const query = `select * from orders order by orders.createdAt limit ${limit} offset ${ofs}`;
            const db = await appDatabaseService.getConnection();
            const orders = await appDatabaseService.getAll(db, query);
            const queryDetail = 'select * from ordersDetail where orderId = $orderId';
            for (let od of orders) {
                od.details = await appDatabaseService.getAll(db, queryDetail.replace('$orderId', od.id));
            }
            return orders;
        } catch (e) {
            console.log(e)
        }

    }

    async searchOrder(query) {
        try {
            const querySql = `select * from orders where orders.id = ${query} order by orders.createdAt `;
            const db = await appDatabaseService.getConnection();
            return await appDatabaseService.getAll(db, querySql);
        } catch (e) {
            console.log(e)
        }

    }

    async getTodayReport() {
        try {
            const db = await appDatabaseService.getConnection();
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();
            const query = `SELECT * FROM orders WHERE createdAt >= ${startOfDay} AND createdAt <= ${endOfDay}`;
            const allOrder = await db.getAllAsync(query);
            return {
                revenue: allOrder.reduce((cur, next) => cur + next.amount, 0),
                totalOrderCount: allOrder.length,
                income: allOrder.reduce((cur, next) => cur + next.income, 0),
            };
        } catch (e) {
            console.log(e)
        }

    }
}

export const order = new OrderModel();