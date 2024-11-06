import {appDatabaseService} from "../core/app.database";

class CategoryService {

    async getAllCategories(page = 1, size = 20) {
        const db = appDatabaseService.getConnection();
        return await appDatabaseService.getAll(db, `SELECT * FROM ${appDatabaseService.TABLE_CATEGORY} LIMIT ${size} OFFSET ${(page - 1) * size}`);
    }

    async insertCategory(category) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createInsertStatement(db, appDatabaseService.TABLE_CATEGORY, category);
        try {
            const result = await statement.executeAsync(appDatabaseService.createInsertStatementArgs(category));
            return result.lastInsertRowId;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async updateCategory(category, id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_CATEGORY, category, id);
        try {
            const result = await db.runAsync(statement, appDatabaseService.createInsertStatementArgs(category));
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async deleteCategory(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_CATEGORY, id);
        try {
            const result = await db.runAsync(statement);
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async getById(id) {
        const db = await appDatabaseService.getConnection();
        const statement = await appDatabaseService.createGetByIdQuery(appDatabaseService.TABLE_CATEGORY, id);
        try {
            return await appDatabaseService.getFirst(db, statement);
        } finally {
            await statement.finalizeAsync();
        }
        return null;
    }
}

export const categoryService = new CategoryService();