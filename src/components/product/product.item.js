import React, {memo} from 'react';
import {Box, HStack, Icon, Pressable, Text, VStack} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {formatCurrency} from "../../ultis/helper";
import {Image, Switch, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const ProductItem = memo(({product, setOpenModel, handleSetIsSelling, handleDelete, splitted = true}) => {
    const isIncome = product?.price > product?.originPrice;
    const cale = isIncome ? (product.price / product?.originPrice) : -(product.originPrice / product.price);
    const incomePercent = (cale * 100).toFixed(1);
    return (
        <HStack
            mx={2}
            width={splitted ? '48%' : '100%'}
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
                    <Box width={'100%'} height={'100%'} bg={'gray.200'} borderRadius={6}/>
                )}
            </Box>
            <VStack space={.5} flex={1}>
                <Text numberOfLines={1} fontWeight="bold">{product.name}</Text>
                <Text numberOfLines={1} color="gray.500">Có thể bán : <Text
                    color={'green.500'}>{product?.quantity} {product.quantityType}</Text></Text>
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

            {/* Edit Button */}
            <HStack space={2} justifyContent={'center'} alignItems={'center'}>
                <TouchableOpacity style={{elevation: 2, backgroundColor: 'white', borderRadius: 50, padding: 10}}
                                  onPress={() => handleDelete(product.id)}>
                    <MaterialIcons name="delete" size={24} color="blue"/>
                </TouchableOpacity>
                <TouchableOpacity style={{elevation: 2, backgroundColor: 'white', borderRadius: 50, padding: 10}}
                                  onPress={() => setOpenModel(product?.id)}>
                    <MaterialIcons name="edit" size={24} color="blue"/>
                </TouchableOpacity>

                <TouchableOpacity style={{elevation: 2, backgroundColor: 'white', borderRadius: 50, padding: 10}}
                                  onPress={() => handleSetIsSelling(product.id, !product.isSelling)}>
                    <MaterialIcons name={product.isSelling === 1 ? "arrow-forward" : 'arrow-back'} size={24}
                                   color="blue"/>
                </TouchableOpacity>
            </HStack>
        </HStack>
    )
});
