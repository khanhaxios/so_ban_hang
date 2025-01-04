import {observer} from "mobx-react";
import {ActivityIndicator, FlatList, Pressable, ScrollView} from "react-native";
import {memo, useLayoutEffect, useMemo, useState} from "react";
import {Center, HStack, Text} from "native-base";
import {categoryService} from "../../services/category.service";
import {appDatabaseService} from "../../core/app.database";
import Ionicons from "react-native-vector-icons/Ionicons";
import {product} from "../../models/product.model";
import {ProductItem} from "../../components/product/product.item";
import {delaySync, SH, SW} from "../../ultis/helper";
import {productService} from "../../services/product.service";
import {useIsFocused} from "@react-navigation/native";

const ProductFromCategory = ({handleIsSelling, handleDelete, handleEdit}) => {
    const [categories, setCategories] = useState([]);
    const [productByCategory, setProductByCategory] = useState([]);
    const cached = useMemo(() => categories, [categories]);
    const [activeCategory, setActiveCategory] = useState(-1);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const fetchAllCategory = async () => {
        const db = await appDatabaseService.getConnection();
        const categories = await categoryService.getAllCategories(db, 1, 100);
        setCategories(categories);
    }

    const fetchAllProductByCate = async (categId) => {
        setLoading(true)
        await delaySync(1)
        const products = await productService.getAllByCategory(categId);
        setProductByCategory(products)
        setLoading(false)
    }
    useLayoutEffect(() => {
        fetchAllCategory().then();
    }, [isFocused]);

    useLayoutEffect(() => {
        if (categories.length > 0) {
            setActiveCategory(categories[0]?.id);
            fetchAllProductByCate(categories[0].id).then()
        }
    }, [categories]);

    const handleSelectCategory = (id) => {
        setActiveCategory(id);
        fetchAllProductByCate(id).then();
    }

    const CategoryItem = memo(({item}) => {
        const active = item.id == activeCategory;
        return (
            <Pressable onPress={() => handleSelectCategory(item.id)} style={{width: '100%', marginVertical: 6}}>
                <HStack px={3} width={'100%'} shadow={2} alignItems={'center'}
                        backgroundColor={active ? 'green.500' : 'white'}
                        borderRadius={6}
                        py={3}
                        justifyContent={'space-between'}>
                    <Text fontSize={18} color={active ? 'white' : 'black'}
                          textAlign={'center'}>{item?.categoryName}</Text>
                    <Ionicons size={18} color={active ? 'white' : 'black'} name={'arrow-forward'}/>
                </HStack>
            </Pressable>
        )
    });
    const ProductEmpty = () => {
        return (
            <Center width={'100%'} flex={.6}>
                <Text textAlign={'center'}
                      fontWeight={'bold'}>{activeCategory != -1 ? 'Không có sản phẩm nào thuộc danh mục này' : 'Hãy chọn một danh mục'}</Text>
            </Center>
        )
    }
    const CategoryEmpty = () => {
        return (
            <Center width={'100%'} flex={.6}>
                <Text textAlign={'center'} fontWeight={'bold'}>Hiện không có danh mục nào</Text>
            </Center>
        )
    }

    return (
        <HStack width={'100%'}  justifyContent={'center'} alignItems={'center'}>
            <FlatList style={{flex: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={{
                minHeight: '100%',
                paddingLeft:20,
                width: '100%'
            }} data={cached} renderItem={({item}) => <CategoryItem item={item}/>}/>
            {loading ? <Center flex={2}>
                <ActivityIndicator size={30} color={'black'}/>
            </Center> : (
                <FlatList style={{width: SH / 1.5}} numColumns={2} showsVerticalScrollIndicator={false}
                          ListEmptyComponent={<ProductEmpty/>}
                          contentContainerStyle={{
                              minHeight: '100%'
                          }} data={productByCategory}
                          renderItem={({item}) => <ProductItem splitted={true} handleDelete={handleDelete}
                                                               handleSetIsSelling={handleIsSelling}
                                                               setOpenModel={handleEdit}
                                                               product={item}/>}/>
            )}
        </HStack>
    )
}
export default observer(ProductFromCategory)