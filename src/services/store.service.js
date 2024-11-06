import {appDatabaseService} from "../core/app.database";

class StoreService {
    async getAllStore(page = 1, size = 20) {
        const db = appDatabaseService.getConnection();
        return await appDatabaseService.getAll(db, `SELECT * FROM ${appDatabaseService.TABLE_STORE} LIMIT ${size} OFFSET ${(page - 1) * size}`);
    }

    async getById(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createGetByIdQuery(appDatabaseService.TABLE_STORE, id);
        try {
            return await appDatabaseService.getFirst(db, statement);
        } finally {
            await statement.finalizeAsync();
        }
        return null;
    }

    async insertStore(store) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createInsertStatement(db, appDatabaseService.TABLE_STORE, store);
        try {
            await statement.executeAsync(appDatabaseService.createInsertStatementArgs(store));
            return true;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async updateStore(id, store) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_STORE, store, id);
        try {
            const result = await db.runAsync(appDatabaseService.createInsertStatementArgs(store));
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async deleteStore(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createDeleteQuery(db, appDatabaseService.TABLE_STORE, id);
        try {
            const result = await db.runAsync(statement);
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }
}

export const storeService = new StoreService();