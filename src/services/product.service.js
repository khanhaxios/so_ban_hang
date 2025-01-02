import {appDatabaseService} from "../core/app.database";

class ProductService {
    async getAllProduct(page = 1, size = 20) {
        const db = await appDatabaseService.getConnection();
        const query = `SELECT * FROM ${appDatabaseService.TABLE_PRODUCT} LIMIT ${size} OFFSET ${(page - 1) * size}`;
        return await appDatabaseService.getAll(db, query);
    }

    async insertProduct(db, product) {
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
        } catch (e) {
            console.log(e)
            await statement.finalizeAsync();
        }
        return null;
    }

    async updateProduct(id, updateData) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_PRODUCT, updateData, id);
        console.log(statement)
        try {
            const result = await db.runAsync(statement, appDatabaseService.createInsertStatementArgs(updateData));
            return result.changes;
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    async deleteProduct(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createDeleteQuery(db, appDatabaseService.TABLE_PRODUCT, id);
        try {
            await db.runAsync(statement);
            return true;
        } catch (e) {
            console.log(e)
        }
        return false;
    }

    async exitsWithName(db, name) {
        const statement = await appDatabaseService.createGetByQuery(appDatabaseService.TABLE_PRODUCT, 'name', name);
        try {
            return (await appDatabaseService.getFirst(db, statement) != null);
        } catch (e) {
            return false;
        }
    }

    async getAllByCategory(categId) {
        try {
            const db = await appDatabaseService.getConnection();
            const query = `SELECT * FROM ${appDatabaseService.TABLE_PRODUCT} WHERE categoryId=${categId}`;
            return await appDatabaseService.getAll(db, query);
        } catch (e) {
            console.log(e);
        }
        return []

    }
}

export const productService = new ProductService();