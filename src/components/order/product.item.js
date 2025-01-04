import React, {memo} from "react";
import {Pressable} from "react-native";
import {Image, Text, VStack} from "native-base";
import {formatCurrency} from "../../ultis/helper";
import empty from '../../res/fast-food.png';

export const ProductItem = memo(({product, addToCart}) => {
    const inStock = product.quantity > 0;
    return (
        <Pressable
            disabled={product.quantity <= 0}
            onPress={() => addToCart(product)}
            style={{
                flex: 1,
                maxWidth: "25%",
                width: "25%",
                marginBottom: 8
            }}
        >
            <VStack
                mx={1}
                space={1}
                p={2}
                borderRadius={6}
                alignItems="center"
                backgroundColor={'white'}
            >

                <Image
                    style={{borderRadius: 8, resizeMode: product.image ? 'cover' : 'contain'}}
                    source={product?.image ? {uri: product?.image} : empty}
                    alt={product?.name}
                    width={product?.image ? '100%' : "50%"}
                    height={32}
                />
                <Text fontSize={16} fontWeight={'bold'} numberOfLines={1} ellipsizeMode="tail">
                    {product?.name}
                </Text>
                <Text color={'orange.600'} fontWeight={'bold'} fontSize={14}>{formatCurrency(product?.price)}</Text>
                <Text
                    color={inStock ? 'green.400' : 'red.500'}>{inStock ? `${product.quantity} ${product.quantityType}` : 'Hết hàng'}</Text>
            </VStack>
        </Pressable>
    )
})
