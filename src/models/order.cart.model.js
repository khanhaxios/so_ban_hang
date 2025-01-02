import {makeAutoObservable} from "mobx";
import {appDatabaseService} from "../core/app.database";
import {categoryService} from "../services/category.service";
import {product} from "./product.model";
import {Alert, ToastAndroid} from "react-native";
import {order} from "./order.model";

class CartModel {
    cartItems = [];
    categories = [];
    filteredProducts = [];
    selectedCategories = -1;
    CART_ACTIONS = {INS: 0, DESC: 1};

    constructor() {
        makeAutoObservable(this);
    }

    setFilteredProducts = (val) => {
        this.filteredProducts = val;
    };

    setSelectedCategories = (val) => {
        this.selectedCategories = val;
        this.getProductByCategory().then();
    };

    setCategory = (categories) => {
        this.categories = categories;
    };

    searchProduct(t) {
        if (t === '') {
            this.getProductByCategory().then();
            return;
        }
        const result = product.products.filter((product) => product?.name.toLowerCase().includes(t.toLowerCase()));
        this.setFilteredProducts(result);
    }

    setCartItems = (cartItems) => {
        this.cartItems = cartItems;
    };

    handleClearCart = () => {
        Alert.alert("Xác nhận", "Bạn có thực sự muốn làm trống giỏ hàng không?", [
            {
                style: "default",
                text: "Không",
                onPress: () => {
                },
            },
            {
                style: "destructive",
                text: "Có",
                onPress: () => {
                    this.setCartItems([]);
                },
            },
        ]);
    };

    addProductToCart = (product) => {
        const temp = [...this.cartItems];
        const exists = temp.some((p) => p.id === product.id);
        if (!exists) {
            const productToCart = {
                name: product.name,
                price: product.price,
                quantity: 1,
                originPrice: product.originPrice,
                id: product.id,
            };
            temp.push(productToCart);
            this.setCartItems(temp);
        } else {
            this.updateQuantity(product.id, this.CART_ACTIONS.INS);
        }
    };

    updateQuantity = (id, actions) => {
        const temps = [...this.cartItems];
        const itemIndex = temps.findIndex((p) => p.id === id);
        if (itemIndex === -1) return;

        const quantity = temps[itemIndex]?.quantity;
        const finalQuantity = actions === this.CART_ACTIONS.INS ? quantity + 1 : quantity - 1;

        if (finalQuantity <= 0) {
            this.removeFromCart(id);
            return;
        }

        temps[itemIndex]["quantity"] = finalQuantity;
        this.setCartItems(temps);
    };

    removeFromCart = (id) => {
        const temps = [...this.cartItems];
        const index = temps.findIndex((p) => p.id === id);
        if (index !== -1) {
            temps.splice(index, 1);
            this.setCartItems(temps);
        }
    };

    getProductByCategory = async () => {
        const filteredProducts =
            this.selectedCategories === -1
                ? product.products
                : product.products.filter((p) => p.categoryId === this.selectedCategories);
        this.setFilteredProducts(filteredProducts);
    };

    async loadCategories() {
        try {
            const db = await appDatabaseService.getConnection();
            const result = await categoryService.getAllCategories(db);
            result.unshift({id: -1, categoryName: "Tất cả"});
            this.setCategory(result);
            this.setSelectedCategories(-1);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    async loadAllData() {
        try {
            await this.loadCategories();
            await product.loadAll();
            await this.getProductByCategory();
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    handleCreateOrder = async (amount, income, totalByOrigin) => {
        if (!this.cartItems.length) {
            Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.");
            return;
        }

        try {
            const newOrder = {
                order: {
                    amount,
                    income,
                    expense: totalByOrigin,
                    createdAt: new Date().getTime().toString(),
                    updatedAt: new Date().getTime().toString(),
                },
                details: this.cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    createdAt: new Date().getTime().toString(),
                })),
            };
            await order.addOrder(newOrder);
            this.setCartItems([]);

            ToastAndroid.show("Đơn hàng của bạn đã được tạo thành công!", ToastAndroid.LONG);
            // get all product tho
            await this.loadAllData();
        } catch (error) {
            console.error("Error creating order:", error);
            ToastAndroid.show("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.", ToastAndroid.LONG);
        }
    };
}

export const cartModel = new CartModel();
