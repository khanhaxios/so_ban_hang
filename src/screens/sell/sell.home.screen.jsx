import React, {useLayoutEffect} from "react";
import {observer} from "mobx-react";
import {Pressable, TextInput} from "react-native";
import {
    Box,
    Button,
    Center,
    HStack,
    Text,
    VStack,
    Image,
} from "native-base";
import {AppContainer} from "../../components/layout/container.cpn";
import CartRender from "../../components/order/cart.render";
import ProductRender from "../../components/order/product.render";
import {cartModel} from "../../models/order.cart.model";
import CategoryRender from "../../components/order/category.render";
import {product} from "../../models/product.model";
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateOrderScreen = ({route, navigation}) => {
    useLayoutEffect(() => {
        cartModel.loadAllData().then();
    }, []);
    const handleGoListScreen = () => {
        navigation.navigate('manage_list_order_screen');
    }
    const Header = () => {
        return (
            <HStack width={'100%'} py={4} px={4} alignItems="center" justifyContent="space-between">
                <HStack width={'15%'}>
                    <Text color="black" fontSize="lg" ml={2}>
                        Tạo đơn
                    </Text>
                </HStack>
                <HStack width={'59%'} borderWidth={1} borderColor={'gray.300'} borderRadius={4} px={3} mx={4} py={2} space={2}
                        alignItems={'center'} justifyContent={'start'}>
                    <Ionicons name={'search'} size={20} color={'gray'}/>
                    <TextInput
                        style={{width: '90%'}}
                        onChangeText={(t) => cartModel.searchProduct(t)}
                        placeholder={'Tìm kiếm sản phẩm'}
                    />
                </HStack>
                <HStack style={{width: '25%'}} px={4} justifyContent={'flex-end'}>
                    <Pressable onPress={handleGoListScreen}>
                        <HStack borderWidth={1} borderRadius={4} px={3} py={2} borderColor={'blue.500'}
                                alignItems={'center'} space={1}>
                            <Text color={'blue.500'}>Danh sách bán hàng</Text>
                        </HStack>
                    </Pressable>
                </HStack>

            </HStack>
        )
    }
    const EmptyDataComponent = () => {
        return (
            <HStack flex={1} px={4}>
                {/* Left Section - Chiếm 2/3 */}
                <Center flex={2}>
                    <Box
                        maxWidth="500px"
                        w="full"
                        mx="auto"
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Image
                            source={require("../../../assets/addproduct.png")}
                            alt="Checklist"
                            size="xl"
                            mb={4}
                        />
                        <Text textAlign="center" fontSize="md" color="gray.600">
                            Bạn chưa có sản phẩm nào. Thêm sản phẩm để lên hóa đơn cho khách
                            hàng nhé
                        </Text>
                        <Button mt={4} colorScheme="green" px={8} width="full"
                                onPress={() => navigation.navigate("manage_createoder_screen")}>
                            Thêm sản phẩm
                        </Button>
                    </Box>
                </Center>

                {/* Right Section - Chiếm 1/3 */}
                <Center flex={1} bg="#f2f2f2">
                    <Image
                        source={require("../../../assets/productadd.png")}
                        alt="No products"
                        size="2xl"
                    />
                    <Text textAlign="center" fontSize="md" color="gray.600" px={5}>
                        Chưa có sản phẩm nào được thêm vào đơn này!
                    </Text>
                </Center>
            </HStack>
        )
    }
    const MainContent = () => {
        return (
            <Box flex={1} bg="white">
                <HStack flex={1} bg="#f2f2f2" px={2}>
                    <Box width={'15%'}>
                        <CategoryRender/>
                    </Box>
                    <VStack width="60%" space={4} px={2}>
                        <ProductRender/>
                    </VStack>
                    <Box width={'25%'}>
                        <CartRender/>
                    </Box>
                </HStack>
            </Box>
        )
    }

    return (
        <AppContainer>
            <Box flex={1} bg="white">
                <Header/>
                {product.products.length === 0 ?
                    (<EmptyDataComponent/>) :
                    (<MainContent/>)}
            </Box>
        </AppContainer>
    );
};

export default observer(CreateOrderScreen);
