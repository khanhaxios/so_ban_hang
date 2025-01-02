import {appDatabaseService} from "../core/app.database";

class CategoryService {

    async getAllCategories(db, page = 1, size = 20) {
        return await appDatabaseService.getAll(db, `SELECT * FROM ${appDatabaseService.TABLE_CATEGORY} LIMIT ${size} OFFSET ${(page - 1) * size}`);
    }

    async getAllCategory(db) {
        return await appDatabaseService.getAll(db, `SELECT * FROM ${appDatabaseService.TABLE_CATEGORY}`);
    }

    async insertCategory(db, category) {
        const statement = await appDatabaseService.createInsertStatement(db, appDatabaseService.TABLE_CATEGORY, category);
        try {
            const result = await statement.executeAsync(appDatabaseService.createInsertStatementArgs(category));
            return result.lastInsertRowId;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async updateCategory(db, category, id) {
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_CATEGORY, category, id);
        try {
            const result = await db.runAsync(statement, appDatabaseService.createInsertStatementArgs(category));
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async deleteCategory(db, id) {
        const statement = await appDatabaseService.createUpdateQuery(db, appDatabaseService.TABLE_CATEGORY, id);
        try {
            const result = await db.runAsync(statement);
            return result.changes;
        } finally {
            await statement.finalizeAsync();
        }
        return false;
    }

    async getById(db, id) {
        const statement = await appDatabaseService.createGetByIdQuery(appDatabaseService.TABLE_CATEGORY, id);
        try {
            return await appDatabaseService.getFirst(db, statement);
        } finally {
            await statement.finalizeAsync();
        }
        return null;
    }

    async exitsByName(db, name) {
        const statement = await appDatabaseService.createGetByQuery(appDatabaseService.TABLE_CATEGORY, 'categoryName', name);
        return (await appDatabaseService.getFirst(db, statement)) != null;
    }
}

export const categoryService = new CategoryService();