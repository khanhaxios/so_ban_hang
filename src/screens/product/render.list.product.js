import Animated from "react-native-reanimated";
import ProductList from "../../models/productList.model";
import React from "react";
import {StyleSheet} from "react-native";

export const RenderListProduct = ({productData, cStyle, setOpenEditModal}) => {
    const styles = StyleSheet.create({
        container: {
            width: "300%",
            position: 'relative',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
        }
    })
    return (
        <Animated.View style={[styles.container, cStyle]}>
            <ProductList data={productData.slice(0, 40)}
                         setOpenEditModel={setOpenEditModal}/>
            <ProductList data={productData.slice(0, 2)}
                         setOpenEditModel={setOpenEditModal}/>
            <ProductList data={productData.slice(0, 1)}
                         setOpenEditModel={setOpenEditModal}/>
        </Animated.View>

    )
}