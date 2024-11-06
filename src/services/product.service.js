import {appDatabaseService} from "../core/app.database";
class ProductService {
    async getAllProduct(page = 1, size = 20) {
        const db = await appDatabaseService.getConnection();
        const query = `SELECT * FROM ${appDatabaseService.TABLE_PRODUCT} LIMIT ${size} OFFSET ${(page - 1) * size}`;
        return await appDatabaseService.getAll(db, query);
    }

    async insertProduct(product) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createInsertStatement(db, appDatabaseService.TABLE_PRODUCT, product);
        try {
            const result = await statement.executeAsync(appDatabaseService.createInsertStatementArgs(product));
            return result.lastInsertRowId;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async insertProducts(products) {
        for (const product of products) {
            await this.insertProduct(product);
        }
        return true;
    }

    async getById(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createGetByIdQuery(appDatabaseService.TABLE_PRODUCT, id);
        try {
            return await appDatabaseService.getFirst(db, statement);
        } finally {
            await statement.finalizeAsync();
        }
        return null;
    }

    async updateProduct(id, updateData) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_PRODUCT, updateData, id);
        try {
            const result = await db.runAsync(statement, appDatabaseService.createInsertStatementArgs(updateData));
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async deleteProduct(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createDeleteQuery(db, appDatabaseService.TABLE_PRODUCT, id);
        try {
            await db.runAsync(statement);
            return true;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }
}

export const productService = new ProductService();