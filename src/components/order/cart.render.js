import {observer} from "mobx-react";
import React, {memo, useState} from "react";
import {Button, Center, Divider, FlatList, HStack, Icon, Input, Text, VStack} from "native-base";
import {convertNumberToCurrency, formatCurrency} from "../../ultis/helper";
import {Pressable} from "react-native";
import {cartModel} from "../../models/order.cart.model";
import Ionicons from "react-native-vector-icons/Ionicons";

const CartRender = ({route, navigation}) => {
    const [discount, setDiscount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const CartItem = memo(({item}) => {
        return (
            <HStack
                my={2}
                key={item.id}
                justifyContent="space-between"
                alignItems="center"
            >
                <Text fontSize="md" flex={1} width={'40%'} numberOfLines={3}>
                    {item.name}
                </Text>
                <Text fontSize="md" width={'30%'} fontWeight={'bold'}>{convertNumberToCurrency(item.price).val}</Text>
                <HStack alignItems="center" width={'30%'} justifyContent="space-between">
                    <Pressable onPress={() => cartModel.updateQuantity(item.id, cartModel.CART_ACTIONS.DESC)}>
                        <Icon color={'blue.500'} size={22} as={Ionicons} name="remove-circle-outline"/>
                    </Pressable>
                    <Text mx={2}>{item.quantity}</Text>
                    <Pressable onPress={() => cartModel.updateQuantity(item.id, cartModel.CART_ACTIONS.INS)}>
                        <Icon color={'blue.500'} size={22} as={Ionicons} name="add-circle-outline"/>
                    </Pressable>
                </HStack>
            </HStack>
        )
    });
    const totalAmount = cartModel.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalAmount = Math.max(totalAmount - discount + shippingFee, 0);
    const totalByOrigin = cartModel.cartItems.reduce((sum, item) => sum + item.originPrice * item.quantity, 0);
    const income = totalAmount - totalByOrigin;
    return (
        <VStack width="100%" height={'100%'} bg="white" p={4}>
            {cartModel.cartItems.length > 0 ? (
                <VStack space={3}>
                    <FlatList style={{maxHeight: '50%'}} data={cartModel.cartItems}
                              renderItem={({item}) => <CartItem item={item}/>}/>
                    <Divider my={2}/>
                    <HStack justifyContent="space-between">
                        <Text fontSize="md">
                            Tổng cộng {cartModel.cartItems.length} sản phẩm
                        </Text>
                        <Text fontSize="md" fontWeight={'bold'}>{convertNumberToCurrency(totalAmount).val}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="md">Giảm giá</Text>
                        <HStack alignItems="center">
                            <Input
                                width="100px"
                                defaultValue={discount.toString()}
                                onChangeText={(value) => setDiscount(Number(value))}
                                keyboardType="text"
                            />
                            <Text ml={2}>đ</Text>
                        </HStack>
                    </HStack>
                    <HStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="md">Vận chuyển</Text>
                        <HStack alignItems="center">
                            <Input
                                width="100px"
                                value={shippingFee.toString()}
                                onChangeText={(value) => setShippingFee(Number(value))}
                                keyboardType="text"
                            />
                            <Text ml={2}>đ</Text>
                        </HStack>
                    </HStack>

                    <Divider my={2}/>
                    <HStack justifyContent="space-between">
                        <Text fontSize="md" fontWeight="bold">
                            Tổng cộng tất cả
                        </Text>
                        <Text fontSize="md" fontWeight="bold">
                            {convertNumberToCurrency(finalAmount).val}
                        </Text>
                    </HStack>
                    <HStack space={2}>
                        <Button
                            py={1}
                            onPress={cartModel.handleClearCart}
                            variant="outline"
                            borderColor={"#16a34a"}
                            borderRadius={8}
                            mt={2}
                            width={"50%"}
                        >
                            <Text color={'#16a34a'}>Xóa giỏ hàng</Text>
                        </Button>
                        <Button onPress={() => cartModel.handleCreateOrder(finalAmount, income, totalByOrigin)}
                                backgroundColor="#16a34a"
                                mt={2} width={"50%"}>
                            Tạo đơn hàng
                        </Button>
                    </HStack>
                </VStack>
            ) : (
                <Center flex={1}>
                    <Text textAlign="center" fontSize="md" color="gray.600">
                        Chưa có sản phẩm nào được thêm vào đơn này!
                    </Text>
                </Center>
            )}
        </VStack>
    )
}

export default observer(CartRender);