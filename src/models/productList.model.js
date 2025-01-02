import React from 'react';
import {Text, FlatList, Center} from 'native-base';
import {ProductItem} from "../components/product/product.item";
import {stringGen, SW} from "../ultis/helper";
import Animated from "react-native-reanimated";
import {ActivityIndicator, StyleSheet} from "react-native";

const ProductList = ({data, setOpenEditModel, emptyTitle, handleSetSelling, loading, handleDelete}) => {
    const styles = StyleSheet.create({
        container: {width: '100%', height: '100%'}
    })
    const EmptyComponent = () => {
        return (
            <Text color="gray.500" textAlign="center" mt={10}>
                {emptyTitle}
            </Text>
        )
    }
    return (
        <Animated.View style={[styles.container]}>
            {loading ? (
                <Center
                    flex={1}>
                    <ActivityIndicator size={30} color={'black'}/>
                </Center>
            ) : (
                <FlatList numColumns={2} ListEmptyComponent={<EmptyComponent/>}
                          contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 20}}
                          onEndReachedThreshold={1}
                          initialNumToRender={10} keyExtractor={() => stringGen(12)}
                          data={data}
                          renderItem={({item}) => <ProductItem handleDelete={handleDelete}
                                                               handleSetIsSelling={handleSetSelling}
                                                               product={item}
                                                               setOpenModel={setOpenEditModel}/>}/>
            )}

        </Animated.View>
    );
};

export default ProductList;
