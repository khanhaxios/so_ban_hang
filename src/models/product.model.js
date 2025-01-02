import {makeAutoObservable} from "mobx";
import {productService} from "../services/product.service";
import {appDatabaseService} from "../core/app.database";
import app from "react-native/template/App";

export function ProductModel(id, image, name, price, desc, originPrice, discount, barCode, quantity, quantityType, categoryId, productTypeId, storeId) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.price = price;
    this.desc = desc;
    this.originPrice = originPrice;
    this.discount = discount;
    this.barCode = barCode;
    this.quantity = quantity;
    this.quantityType = quantityType;
    this.categoryId = categoryId;
    this.productTypeId = productTypeId;
    this.storeId = storeId;
}

class Product {
    products = [];
    inStorageProduct = [];
    byCategoryProduct = [];
    searchResultByProduct = [];
    searchResultByInStorageProduct = [];

    loading = false;

    constructor() {
        makeAutoObservable(this)
    }

    setProduct = (val) => this.products = val;

    setInStorageProduct = (val) => this.inStorageProduct = val;
    setByCategoryProduct = (val) => this.byCategoryProduct = val;
    setLoading = (val) => this.loading = val;
    setResultOfProduct = (val) => this.searchResultByProduct = val;
    setResultOfProductInStorage = (val) => this.searchResultByInStorageProduct = val;

    async getProducts() {
        const db = await appDatabaseService.getConnection();
        const query = `SELECT * FROM ${appDatabaseService.TABLE_PRODUCT} WHERE isSelling = 1`;
        const result = await appDatabaseService.getAll(db, query);
        this.setProduct(result);
        this.setResultOfProduct(result);
    }

    async getStorageProduct() {
        const db = await appDatabaseService.getConnection();
        const query = `SELECT * FROM ${appDatabaseService.TABLE_PRODUCT} WHERE isSelling = 0`;
        const result = await appDatabaseService.getAll(db, query);
        this.setInStorageProduct(result);
        this.setResultOfProductInStorage(result)
    }

    async getProductByCategory(categoryId) {

    }

    async loadAll() {
        try {
            this.setLoading(true)
            setTimeout(async () => {
                await this.getProducts();
                await this.getStorageProduct();
                this.setLoading(false);
            }, 100)
        } catch (e) {
            console.log(e);
        }
        this.setLoading(false)
    }

    async searchProduct(query) {
        const products = [];
        const productByInStorage = [];
        const queryq = query.toLowerCase();
        for (let pro of this.products) {
            if (pro?.name?.toLowerCase()?.includes(queryq)) {
                products.push(pro);
            }
        }
        for (let pro of this.inStorageProduct) {
            if (pro?.name?.toLowerCase()?.includes(queryq)) {
                productByInStorage.push(pro);
            }
        }
        this.setResultOfProductInStorage(productByInStorage);
        this.setResultOfProduct(products)
    }

    async syncProductSelling(productId, selling) {
        try {
            const db = await appDatabaseService.getConnection();
            const query = `UPDATE ${appDatabaseService.TABLE_PRODUCT} SET isSelling = ${selling ? 1 : 0} WHERE id = ${productId}`;
            await db.execAsync(query);
        } catch (e) {
            console.log(e);
        }
    }
}

export const product = new Product();