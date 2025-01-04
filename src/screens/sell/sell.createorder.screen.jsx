import React, {useLayoutEffect, useState} from "react";
import {
    Box,
    Text,
    ScrollView,
    HStack,
    Input,
    Button,
    Modal, VStack, Image,
} from "native-base";
import {observer} from "mobx-react";
import {CategoryCreateModel} from "../../components/category/category.create.model";
import {ProductCreateFormInput} from "../../components/product/product.create.form.input";
import {AppContainer} from "../../components/layout/container.cpn";
import {copyImage, formatCurrency, splitQuantity} from "../../ultis/helper";
import {ActivityIndicator, Alert, FlatList, ImageBackground, Pressable, ToastAndroid} from 'react-native';
import uploaderBg from '../../res/camera.png'
import * as ImagePicker from 'expo-image-picker';
import {categoryService} from "../../services/category.service";
import {appDatabaseService} from "../../core/app.database";
import {store} from "../../models/store.model";
import {productService} from "../../services/product.service";
import {useNavigation} from "@react-navigation/native";

const CreateProductScreen = () => {
    const navigation = useNavigation();
    // State quản lý dữ liệu
    const initState = {
        productName: "",
        price: "",
        originalPrice: "",
        isInStock: true,
        quantity: "0"
    }
    const [formData, setFormData] = useState(initState);
    const [adding, setAdding] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imageUploaded, setImageUploaded] = useState(null);
    const [newCatData, setNewCatData] = useState({
        name: ''
    })

    const validations = {
        productName: formData.productName.trim() !== "",
        price: formData.price.trim() !== "" && !isNaN(formData.price),
        originalPrice:
            formData.originalPrice.trim() !== "" && !isNaN(formData.originalPrice),
        quantity: formData?.quantity.trim() !== "",
    };
    const handleInputChange = (key, value) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };
    const handleComplete = async (redirect = true) => {
        try {
            setIsSubmitAttempted(true);
            const isValid = Object.values(validations).every(Boolean);
            if (!formData?.categoryId) {
                ToastAndroid.show("Chọn danh mục cho sản phẩm", ToastAndroid.LONG);
                return;
            }
            // copy image
            if (isValid) {
                const productImage = await copyImage(imageUploaded);
                const quantity = splitQuantity(formData.quantity);
                if (quantity?.numberPart === 0) {
                    ToastAndroid.show("Số lượng sản phẩm phải lớn hơn 0", ToastAndroid.LONG);
                    return;
                }
                // console.log(quantity);
                // if (!quantity?.textPart) {
                //     ToastAndroid.show("Số lượng sản phẩm phải có định danh : 1 cái , 1 hộp , 1 vỉ", ToastAndroid.LONG);
                //     return;
                // }
                setAdding(true)
                const finalData = {
                    image: productImage,
                    name: formData.productName,
                    quantity: quantity.numberPart,
                    quantityType: quantity.textPart,
                    originPrice: parseFloat(formData.originalPrice),
                    price: parseFloat(formData.price),
                    categoryId: formData.categoryId,
                    storeId: store.currentStore.id,
                    isSelling: formData.isInStock ? 1 : 0
                };
                const db = await appDatabaseService.getConnection();
                // validate
                const exits = await productService.exitsWithName(db, finalData.name);
                if (exits) {
                    ToastAndroid.show("Đã có sản phẩm cùng tên", ToastAndroid.LONG);
                    setAdding(false);
                    return;
                }
                const insertedId = await productService.insertProduct(db, finalData);
                // insert to history
                const historyQuery = {
                    amount: finalData.originPrice * finalData.quantity,
                    productId: insertedId,
                    quantity: finalData.quantity,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
                }
                const insertQuery = await appDatabaseService.createInsertStatement(db, 'productsHistory', historyQuery);
                await insertQuery.executeAsync(appDatabaseService.createInsertStatementArgs(historyQuery));
                ToastAndroid.show("Đã thêm sản phẩm", ToastAndroid.LONG);
                setAdding(false);
                if (!redirect) {
                    setFormData(initState);
                    setImageUploaded(null);
                    return;
                }
                navigation.goBack();
            } else {
                ToastAndroid.show("Hãy điền đúng thông tin", ToastAndroid.LONG);
            }
        } catch (e) {
            console.log(e)
        }
    };

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
                    Tạo sản phẩm
                </Text>
            </Box>
        )
    }
    const formFields = [
        {
            name: 'productName',
            placeholder: 'Ví Dụ : Mì Hảo Hảo',
            label: 'Tên Sản Phẩm',
            required: true,
            validValue: validations.productName,
            value: formData.productName,
        },
        {
            name: 'price',
            placeholder: '0.000',
            label: 'Giá bán',
            required: true,
            validValue: validations.price,
            value: formData.price,
            keyType: 'numeric',
            formatter: formatCurrency
        },
        {
            name: 'originalPrice',
            placeholder: '0.000',
            label: 'Giá gốc',
            required: true,
            validValue: validations.originalPrice,
            value: formData.originalPrice,
            keyType: 'numeric',
            formatter: formatCurrency
        },
        {
            name: 'quantity',
            placeholder: '0.000',
            label: 'Số lượng',
            required: true,
            validValue: validations.quantity,
            value: formData.quantity,
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
    const UploadImageCpn = () => {
        return (
            <Pressable onPress={handleChoseImage}>
                {imageUploaded ? (
                    <ImageBackground style={{paddingVertical: 8}} source={{uri: imageUploaded.uri}} blurRadius={9}>
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
        setFormData({...formData, categoryId: id})
    }
    useLayoutEffect(() => {
        loadCate().then();
    }, []);

    async function handleCompleteAndAddMore() {
        await handleComplete(false);
    }

    const handleDeleteCategory = async (id) => {
        Alert.alert("Xác nhận", "Bạn có muốn xóa danh mục này?tất cả các sản phẩm thuộc danh mục này sẽ bị xóa đi", [
            {
                text: "Không", style: "default", onPress: () => {
                }
            },
            {
                text: 'Xóa', style: 'destructive', onPress: async () => {
                    try {
                        const db = await appDatabaseService.getConnection();
                        const query = `delete from categories where id=${id}`;
                        await db.execAsync(query);
                        loadCate().then();
                    } catch (e) {
                        console.log(e)
                        ToastAndroid.show("Danh mục chứa sản phẩm không thể xóa", ToastAndroid.LONG);
                    }
                }
            }
        ])
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
                                Còn hàng
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onPress={() => handleInputChange("isInStock", false)}
                            >
                                Hết hàng
                            </Button>
                        </HStack>
                    </HStack>
                    <HStack mt={2} alignItems="center" justifyContent="space-between">
                        <Text>{formData.isInStock ? "Còn hàng" : "Hết hàng"}</Text>
                    </HStack>
                </Box>
                <CategoryCreateModel handleDeleteCategory={handleDeleteCategory} setCategory={handleSetCategory}
                                     categories={categories}
                                     setOpenModel={setIsCategoryModalOpen}/>
                <HStack mt={6} px={4} space={3} justifyContent="space-between">
                    <Button onPress={handleCompleteAndAddMore} disabled={adding} flex={1} colorScheme="gray">
                        {adding ? <ActivityIndicator size={20} color={'white'}/> : 'Tạo thêm'}
                    </Button>
                    <Button disabled={adding} flex={1} colorScheme="green" onPress={handleComplete}>
                        {adding ? <ActivityIndicator size={20} color={'white'}/> : 'Hoàn tất'}
                    </Button>
                </HStack>
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
    );
};

export const RenderFormData = ({formFields, handleInputChange, isSubmitAttempted}) => {
    return (
        <FlatList renderItem={({item}) => <ProductCreateFormInput
            name={item.name}
            placeholder={item.placeholder}
            label={item.label}
            formatter={item?.formatter}
            required={item.required}
            value={item.value}
            validValue={item.validValue}
            handleSetChange={handleInputChange}
            keyType={item?.keyType}
            isAttempted={isSubmitAttempted}
        />} data={formFields}/>
    )
}

export default observer(CreateProductScreen);