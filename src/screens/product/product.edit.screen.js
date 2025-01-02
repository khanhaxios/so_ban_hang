import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {ActivityIndicator, ImageBackground, Pressable, ScrollView, ToastAndroid} from "react-native";
import {Box, Button, HStack, Image, Input, Modal, Text, VStack} from "native-base";
import React, {useLayoutEffect, useState} from "react";
import {productService} from "../../services/product.service";
import {CategoryCreateModel} from "../../components/category/category.create.model";
import {RenderFormData} from "../sell/sell.createorder.screen";
import uploaderBg from "../../res/camera.png";
import {copyImage, formatCurrency, splitQuantity} from "../../ultis/helper";
import * as ImagePicker from "expo-image-picker";
import {store} from "../../models/store.model";
import {appDatabaseService} from "../../core/app.database";
import {categoryService} from "../../services/category.service";

const ProductEditScreen = ({route, navigation}) => {
    const {id} = route.params;

    const initState = {
        name: "",
        price: "",
        originPrice: "",
        isInStock: true,
        quantity: "0"
    }
    const [product, setProduct] = useState(initState);
    const [adding, setAdding] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imageUploaded, setImageUploaded] = useState(null);
    const [newCatData, setNewCatData] = useState({
        name: ''
    })
    const getProductDetail = async (id) => {
        const product = await productService.getById(id);
        product['quantity'] = product.quantity + " " + product.quantityType;
        setProduct(product);
    }

    const validations = {
        name: product?.name?.trim() !== "",
        price: product?.price && !isNaN(product?.price),
        originPrice:
            product.originPrice !== "" && !isNaN(product.originPrice),
        quantity: product?.quantity?.trim() !== "",
    };
    const handleInputChange = (key, value) => {
        setProduct((prev) => ({...prev, [key]: value}));
    };
    const handleComplete = async () => {
        try {
            setIsSubmitAttempted(true);
            const isValid = Object.values(validations).every(Boolean);
            if (!product?.categoryId) {
                ToastAndroid.show("Chọn danh mục cho sản phẩm", ToastAndroid.LONG);
                return;
            }
            // copy image
            if (isValid) {
                let productImage = product.image;
                if (imageUploaded) {
                    productImage = await copyImage(imageUploaded);
                }
                const quantity = splitQuantity(product.quantity);
                if (quantity?.numberPart === 0) {
                    ToastAndroid.show("Số lượng sản phẩm phải lớn hơn 0", ToastAndroid.LONG);
                    return;
                }
                if (!quantity?.textPart) {
                    ToastAndroid.show("Số lượng sản phẩm phải có định danh : 1 cái , 1 hộp , 1 vỉ", ToastAndroid.LONG);
                    return;
                }
                setAdding(true)
                const finalData = {
                    image: productImage,
                    name: product?.name,
                    quantity: quantity.numberPart,
                    quantityType: quantity.textPart,
                    originPrice: parseFloat(product.originPrice),
                    price: parseFloat(product.price),
                    categoryId: product.categoryId,
                    storeId: store.currentStore.id,
                    isSelling: product.isInStock ? 1 : 0
                };
               const result =  await productService.updateProduct(id, finalData);
               console.log(result)
                ToastAndroid.show("Cập nhật thành công", ToastAndroid.LONG);
                setAdding(false);
                navigation.goBack();
            } else {
                ToastAndroid.show("Hãy điền đúng thông tin", ToastAndroid.LONG);
            }
        } catch (e) {
            console.log(e)
        }
    };
    const formFields = [
        {
            name: 'name',
            placeholder: 'Ví Dụ : Mì Hảo Hảo',
            label: 'Tên Sản Phẩm',
            required: true,
            validValue: validations?.name,
            value: product?.name,
        },
        {
            name: 'price',
            placeholder: '0.000',
            label: 'Giá bán',
            required: true,
            validValue: validations?.price,
            value: product?.price,
            keyType: 'numeric',
            formatter: formatCurrency
        },
        {
            name: 'originPrice',
            placeholder: '0.000',
            label: 'Giá gốc',
            required: true,
            validValue: validations?.originPrice,
            value: product?.originPrice,
            keyType: 'numeric',
            formatter: formatCurrency
        },
        {
            name: 'quantity',
            placeholder: '0.000',
            label: 'Số lượng',
            required: true,
            validValue: validations?.quantity,
            value: product?.quantity,
        },
    ]

    const handleChoseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            legacy: true,
            allowsEditing: true
        });
        if (result.canceled) {
            return;
        }
        setImageUploaded(result.assets[0]);
    }
    console.log(product.originPrice)
    useLayoutEffect(() => {
        getProductDetail(id).then();
        loadCate().then()
    }, [])

    const Header = () => {
        return (
            <Box
                bg="white"
                py={4}
                px={5}
                borderBottomWidth={1}
                borderColor="gray.200"
            >
                <Text fontSize="lg" fontWeight="bold">
                    Chỉnh sửa sản phẩm
                </Text>
            </Box>
        )
    }

    const UploadImageCpn = () => {
        if (product?.image && !imageUploaded) {
            return (
                <Pressable onPress={handleChoseImage}>
                    <ImageBackground style={{paddingVertical: 8}} source={{uri: product.image}} blurRadius={9}>
                        <Image width={'100%'} height={250} resizeMode={'contain'}
                               source={{uri: product.image}}/>
                    </ImageBackground>
                </Pressable>
            )
        }
        return (
            <Pressable onPress={handleChoseImage}>
                {imageUploaded ? (
                    <ImageBackground style={{paddingVertical: 8}} source={{uri: imageUploaded?.uri}} blurRadius={9}>
                        <Image width={'100%'} height={250} resizeMode={'contain'}
                               source={{uri: imageUploaded.uri}}/>
                    </ImageBackground>
                ) : (
                    <VStack alignItems={'center'} space={3} height={250} width={'100%'} justifyContent={'center'}>
                        <Image alt={'product image'} width={120} height={120}
                               source={uploaderBg}/>
                        <Text>Thêm hình ảnh của sản phẩm</Text>
                    </VStack>
                )}
            </Pressable>
        )
    }

    const handleAddNewCat = async () => {
        try {
            if (newCatData.name.trim() === '') {
                ToastAndroid.show("Hãy Nhập Tên Danh Mục", ToastAndroid.LONG);
                return;
            }
            // check exits
            const finalData = {categoryName: newCatData.name, storeId: store.currentStore?.id};
            const db = await appDatabaseService.getConnection();
            const isExit = await categoryService.exitsByName(db, newCatData.name);
            if (isExit) {
                ToastAndroid.show("Danh mục đã tồn tại", ToastAndroid.LONG);
                return;
            }
            await categoryService.insertCategory(db, finalData);
            setNewCatData({name: ''});
            setIsCategoryModalOpen(false);
            await loadCate();
        } catch (e) {
            console.log(e);
        }
    }
    const loadCate = async () => {
        const db = await appDatabaseService.getConnection();
        const result = await categoryService.getAllCategories(db);
        setCategories(result)
    }
    const handleSetCategory = (id) => {
        setProduct({...product, categoryId: id})
    }
    return (
        <AppContainer>
            <ScrollView flex={1} bg="#f9f9f9">
                <Header/>
                <UploadImageCpn/>
                <RenderFormData formFields={formFields} handleInputChange={handleInputChange}
                                isSubmitAttempted={isSubmitAttempted}/>

                <Box bg="white" px={4} py={4} mt={3}>
                    <HStack justifyContent="space-between" alignItems="center">
                        <Box>
                            <Text fontSize="md">Trạng thái hàng</Text>
                        </Box>
                        <HStack space={2}>
                            <Button
                                size="sm"
                                colorScheme="green"
                                variant="outline"
                                onPress={() => handleInputChange("isInStock", true)}
                            >
                                Lên Kệ
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onPress={() => handleInputChange("isInStock", false)}
                            >
                                Trong kho
                            </Button>
                        </HStack>
                    </HStack>
                    <HStack mt={2} alignItems="center" justifyContent="space-between">
                        <Text>{product.isInStock ? "Lên kệ" : "Trong kho"}</Text>
                    </HStack>
                </Box>
                <CategoryCreateModel selected={product?.categoryId} setCategory={handleSetCategory}
                                     categories={categories}
                                     setOpenModel={setIsCategoryModalOpen}/>
                {/* Buttons */}
                <HStack mt={6} px={4} space={3} justifyContent="space-between">
                    <Button onPress={() => navigation.goBack()} disabled={adding} flex={1} colorScheme="gray">
                        {adding ? <ActivityIndicator size={20} color={'white'}/> : 'Trở về'}
                    </Button>
                    <Button disabled={adding} flex={1} colorScheme="green" onPress={handleComplete}>
                        {adding ? <ActivityIndicator size={20} color={'white'}/> : 'Cập nhật'}
                    </Button>
                </HStack>
                {/* Category Modal */}
                <Modal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                >
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton/>
                        <Modal.Header>Tạo danh mục mới</Modal.Header>
                        <Modal.Body>
                            <Input
                                placeholder="Tên danh mục"
                                value={newCatData.name}
                                onChangeText={(text) => setNewCatData({name: text})}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onPress={handleAddNewCat}
                            >
                                Thêm danh mục
                            </Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </ScrollView>
        </AppContainer>
    )

}
export default observer(ProductEditScreen);