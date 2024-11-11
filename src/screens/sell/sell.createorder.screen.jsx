import React, { useState } from "react";
import {
  Box,
  Text,
  Pressable,
  ScrollView,
  HStack,
  Input,
  Switch,
  Button,
  Modal,
} from "native-base";
import { observer } from "mobx-react";

const CreateProductScreen = () => {
  // Khởi tạo state
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState(""); // Tên danh mục
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // Trạng thái của modal
  const [isProductValid, setIsProductValid] = useState(true);
  const [isPriceValid, setIsPriceValid] = useState(true);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const handleComplete = () => {
    // Khi bấm "Hoàn tất", tiến hành kiểm tra tính hợp lệ
    setIsSubmitAttempted(true);

    const isValidProductName = productName.trim() !== "";
    const isValidPrice = price.trim() !== "";
    setIsProductValid(isValidProductName);
    setIsPriceValid(isValidPrice);

    if (isValidProductName && isValidPrice) {
      // Log tất cả dữ liệu dưới dạng object
      console.log({
        productName,
        price,
        categoryName,
      });
    } else {
      console.log("Please fill in all required fields");
    }
  };

  return (
    <ScrollView flex={1} bg="#f9f9f9">
      {/* Header */}
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

      {/* Product Name Input */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md">Tên sản phẩm *</Text>
        <Input
          placeholder="Ví dụ: Mì Hảo Hảo"
          borderWidth={1}
          borderColor={
            isSubmitAttempted && !isProductValid ? "red.500" : "gray.400"
          }
          mt={2}
          value={productName}
          onChangeText={setProductName}
        />
        {isSubmitAttempted && !isProductValid && (
          <Text color="red.500" mt={1}>
            Thông tin bắt buộc
          </Text>
        )}

        {/* Price Input */}
        <Text mt={4} fontSize="md">
          Giá bán *
        </Text>
        <Input
          placeholder="0.000"
          keyboardType="numeric"
          mt={2}
          value={price}
          onChangeText={setPrice}
          borderWidth={1}
          borderColor={
            isSubmitAttempted && !isPriceValid ? "red.500" : "gray.400"
          }
        />
        {isSubmitAttempted && !isPriceValid && (
          <Text color="red.500" mt={1}>
            Thông tin bắt buộc
          </Text>
        )}
      </Box>

      {/* Category Selection */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md">Danh mục</Text>
        <Pressable mt={2} flexDirection="row" alignItems="center">
          <Box
            borderWidth={1}
            borderColor="gray.400"
            borderRadius={4}
            px={4}
            py={2}
            onPress={() => setIsCategoryModalOpen(true)}
          >
            <Text color="blue.500">+ Tạo danh mục</Text>
          </Box>
          {categoryName && categoryName !=='' ? <Box
            mx={2}
            borderWidth={1}
            borderColor="gray.400"
            borderRadius={4}
            px={4}
            py={2}
          >
             <Text fontSize="md" color="blue.600">
                {categoryName}
              </Text>
          </Box>
          : null}
        </Pressable>
      </Box>

      {/* Inventory Management */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md" mb={2}>
          Quản lý tồn kho
        </Text>
        {/* Product Status */}
        <HStack justifyContent="space-between" alignItems="center" mt={2}>
          <Text>Tình trạng sản phẩm</Text>
          <HStack>
            <Button variant="outline" colorScheme="green" mr={2}>
              Còn hàng
            </Button>
            <Button variant="outline" colorScheme="gray">
              Hết hàng
            </Button>
          </HStack>
        </HStack>
        {/* SKU */}
        <Text mt={4}>Mã SKU</Text>
        <Input placeholder="Nhập/Quét" mt={2} />
        {/* Track Inventory Switch */}
        <HStack alignItems="center" justifyContent="space-between" mt={4}>
          <Text>Theo dõi số lượng tồn kho</Text>
          <Switch />
        </HStack>
      </Box>

      {/* Additional Information */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md" mb={2}>
          Hiển thị sản phẩm trên Website
        </Text>
        <Switch />
        <HStack mt={4} space={3}>
          <Button variant="outline" colorScheme="gray">
            Phân loại
          </Button>
          <Button variant="outline" colorScheme="gray">
            Mã vạch sản xuất
          </Button>
          <Button variant="outline" colorScheme="gray">
            Khuyến mãi
          </Button>
          <Button variant="outline" colorScheme="gray">
            Bán kèm
          </Button>
        </HStack>
      </Box>

      {/* Bottom Buttons */}
      <HStack mt={6} px={4} space={3} justifyContent="space-between">
        <Button flex={1} colorScheme="gray">
          Tạo thêm
        </Button>
        <Button flex={1} colorScheme="green" onPress={handleComplete}>
          Hoàn tất
        </Button>
      </HStack>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Tạo danh mục mới</Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Tên danh mục"
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setIsCategoryModalOpen(false);
              }}
            >
              Lưu
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

export default observer(CreateProductScreen);
