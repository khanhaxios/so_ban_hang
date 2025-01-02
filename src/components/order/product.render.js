import {FlatList} from "native-base";
import React, {useLayoutEffect} from "react";
import {observer} from "mobx-react";
import {cartModel} from "../../models/order.cart.model";
import {ProductItem} from "./product.item";
import {product} from "../../models/product.model";

const ProductRender = () => {
    useLayoutEffect(() => {
        if (cartModel.filteredProducts.length === 0) {
            cartModel.setSelectedCategories(-1);
            cartModel.getProductByCategory().then();
        }
    }, [])
    useLayoutEffect(() => {
        cartModel.setSelectedCategories(-1);
        cartModel.getProductByCategory().then();
    }, [product.products])
    return (
        <FlatList
            contentContainerStyle={{
                paddingVertical: 8,
            }}
            data={cartModel.filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            renderItem={({item}) => <ProductItem product={item} addToCart={cartModel.addProductToCart}/>}
        />
    )
}

export default observer(ProductRender)