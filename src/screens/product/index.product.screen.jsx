import React, {memo, useState, useMemo, useRef, useLayoutEffect, useCallback} from "react";
import {
    VStack,
    Button,
    HStack,
    Input,
    Text,
} from "native-base";
import {observer} from "mobx-react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {AppContainer} from "../../components/layout/container.cpn";
import {Alert, Pressable, StyleSheet, ToastAndroid} from "react-native";
import {ProductListTabHead} from "./product.list.tab.head";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {SH, SW} from "../../ultis/helper";
import {RenderListProduct} from "./render.list.product";
import ProductList from "../../models/productList.model";
import PagerView from 'react-native-pager-view';
import {product} from "../../models/product.model";
import {useFocusEffect} from "@react-navigation/native";
import {productService} from "../../services/product.service";
import ProductFromCategory from "./product.from.category";

const productData = [
    {id: "SP0001", name: "Sản phẩm A", totalQuantity: 20, soldQuantity: 5},
    {id: "SP0002", name: "Sản phẩm B", totalQuantity: 15, soldQuantity: 15},
    {id: "SP0003", name: "Sản phẩm C", totalQuantity: 30, soldQuantity: 10},
    {id: "SP0003", name: "Sản phẩm C", totalQuantity: 30, soldQuantity: 10},
    {id: "SP0003", name: "Sản phẩm C", totalQuantity: 30, soldQuantity: 10},
    {id: "SP0003", name: "Sản phẩm C", totalQuantity: 30, soldQuantity: 10},
    {id: "SP0003", name: "Sản phẩm C", totalQuantity: 30, soldQuantity: 10},
];
export const TAB_LIST = {
    PRODUCTS: {id: 0, title: "Sản Phẩm"},
    INVENTORY: {id: 1, title: "Tồn Kho"},
    CATEGORIES: {id: 2, title: "Danh mục"}
}
export const TabListItem = memo(({item, activeTab, setActiveTab}) => (
    <Pressable
        style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            backgroundColor: activeTab === item.id ? 'rgba(2, 222, 16,.1)' : 'white'
        }}
        onPress={() => {
            setActiveTab(item.id);
        }}>
        <Text
            fontSize="lg"
            color={activeTab === item.id ? "green.500" : "gray.500"}
            fontWeight="bold">
            {item?.title}
        </Text>
    </Pressable>
));
const ProductListScreen = ({route, navigation}) => {
    const [activeTab, setActiveTab] = useState(TAB_LIST.PRODUCTS.id);
    const [searchText, setSearchText] = useState("");
    const pagerRef = useRef();

    const handleSetSelling = async (productId, selling) => {
        await product.syncProductSelling(productId, selling);
        await product.loadAll();
        ToastAndroid.show(selling == 1 ? "Đã lên kệ" : 'Đã chuyển vào kho', ToastAndroid.LONG);
    }
    useLayoutEffect(() => {
        product.loadAll().then();
    }, []);
    const handleOpenEditModal = (id) => {
        navigation.navigate('product_edit_screen', {id})
    }
    const handleDeleteProduct = async (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sản phẩm này?", [
            {
                style: 'default', text: 'Không', onPress: () => {
                }
            },
            {
                style: 'cancel', text: 'Xóa', onPress: async () => {
                    await productService.deleteProduct(id);
                    await product.loadAll();
                    ToastAndroid.show("Đã xóa", ToastAndroid.LONG);
                }
            }
        ])
    }
    useFocusEffect(useCallback(() => {
        product.loadAll().then();
    }, []));
    useLayoutEffect(() => {
        product.searchProduct(searchText).then();
    }, [searchText])

    return (
        <AppContainer>
            <VStack flex={1} backgroundColor="#f3f3f3">
                <HStack alignItems="center" space={2} px={4} py={2} bg="white" shadow={1}>
                    <Input
                        flex={1}
                        placeholder="Tìm tên, mã SKU, ..."
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                        variant="filled"
                        bg="gray.100"
                        borderRadius="md"
                        InputLeftElement={
                            <MaterialIcons
                                name="search"
                                size={20}
                                color="gray"
                                style={{marginLeft: 8}}
                            />
                        }
                    />
                </HStack>
                <ProductListTabHead activeTab={activeTab} setActiveTab={setActiveTab}/>
                <PagerView ref={pagerRef} onPageSelected={(e) => {
                    const {position} = e.nativeEvent;
                    setActiveTab(position)
                }} style={{width: '100%', height: '80%'}} initialPage={0}>
                    <ProductList handleDelete={handleDeleteProduct} handleSetSelling={handleSetSelling}
                                 loading={product.loading} data={product.searchResultByProduct}
                                 emptyTitle={"Hiện không có sản phẩm nào lên kệ"}
                                 setOpenEditModel={handleOpenEditModal}/>
                    <ProductList handleDelete={handleDeleteProduct} handleSetSelling={handleSetSelling}
                                 loading={product.loading}
                                 emptyTitle={"Hiện không có sản phẩm nào trong kho"}
                                 data={product.searchResultByInStorageProduct}
                                 setOpen setOpenEditModel={handleOpenEditModal}/>
                    <ProductFromCategory handleDelete={handleDeleteProduct} handleIsSelling={handleSetSelling}
                                         handleEdit={handleOpenEditModal}/>
                </PagerView>
                <Button
                    position="absolute"
                    bottom={4}
                    right={4}
                    bg="blue.500"
                    borderRadius="full"
                    size={12}
                    alignItems="center"
                    justifyContent="center"
                    onPress={() => navigation.navigate("manage_createoder_screen")}>
                    <MaterialIcons name="add" size={24} color="white"/>
                </Button>
            </VStack>
        </AppContainer>
    );
};

export default observer(ProductListScreen);
