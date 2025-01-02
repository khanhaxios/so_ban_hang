import {FlatList} from "native-base";
import React, {useLayoutEffect} from "react";
import {observer} from "mobx-react";
import {cartModel} from "../../models/order.cart.model";
import {CategoryItem} from "./category.item";

const CategoryRender = () => {
    useLayoutEffect(() => {

    }, [cartModel.selectedCategories]);
    useLayoutEffect(() => {
        if (cartModel.categories.length === 0) {
            cartModel.loadCategories().then();
        }
    }, []);
    return (
        <FlatList initialNumToRender={20} showsVerticalScrollIndicator={false} data={cartModel.categories}
                  renderItem={({item}) => <CategoryItem item={item} setCategory={cartModel.setSelectedCategories}
                                                        selectedCategory={cartModel.selectedCategories}/>}/>
    )
}

export default observer(CategoryRender);