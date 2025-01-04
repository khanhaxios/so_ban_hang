import React, {memo} from 'react';
import {Box, HStack, Icon, Pressable, Text, VStack} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {formatCurrency} from "../../ultis/helper";
import {Image, Switch, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import empty from '../../res/fast-food.png';

export const ProductItem = memo(({product, setOpenModel, splitted = true}) => {
    const isIncome = product?.price > product?.originPrice;
    const cale = isIncome ? (product.price / product?.originPrice) : -(product.originPrice / product.price);
    const incomePercent = (cale * 100).toFixed(1);
    return (
        <Pressable style={{width: splitted ? '48%' : '100%', marginHorizontal: 8}}
                   onPress={() => setOpenModel(product.id)}>
            <HStack
                mx={2}
                width={'100%'}
                bg="white"
                shadow={1}
                p={4}
                mb={4}
                borderRadius="md"
                alignItems="center"
            >
                <Box
                    size={16}
                    bg="gray.100"
                    borderRadius="md"
                    mr={4}
                    overflow="hidden"
                >
                    {product?.image ? (
                        <Image style={{width: '100%', height: '100%'}} source={{uri: product.image}}/>
                    ) : (
                        <Image style={{width: '100%', height: '100%', backgroundColor: 'white', resizeMode: 'contain'}}
                               source={empty}/>
                    )}
                </Box>
                <VStack space={.5} flex={1}>
                    <Text numberOfLines={1} fontWeight="bold">{product.name}</Text>
                    <HStack space={3} alignItems={'center'}>
                        <Text numberOfLines={1} color="gray.500">SL: <Text
                            color={'green.500'}>{product?.quantity} {product.quantityType}</Text></Text>
                        <Text numberOfLines={1} color="gray.500">Đã bán: <Text
                            color={'orange.600'}>{product?.sold || 0} {product.quantityType}</Text></Text>
                    </HStack>
                    <HStack space={6} alignItems={'center'}>
                        <Text numberOfLines={1} color="orange.500" fontWeight="bold">
                            {formatCurrency(product?.originPrice)}
                        </Text>
                        <Text numberOfLines={1} color="green.600" fontWeight="bold">
                            {formatCurrency(product?.price)}
                        </Text>
                        <HStack alignItems={'center'} space={1}>
                            <Ionicons name={isIncome ? 'arrow-up' : 'arrow-down'} size={14}
                                      color={isIncome ? 'green' : 'red'}/>
                            <Text fontFamily={'mono'} fontWeight={'bold'}
                                  color={isIncome ? 'green.500' : 'red.500'}>{incomePercent} %</Text>
                        </HStack>
                    </HStack>

                </VStack>
            </HStack>
        </Pressable>
    )
});
