import React, { useState } from "react";
import {
  Box,
  Text,
  Pressable,
  ScrollView,
  HStack,
  Input,
  Button,
  Modal,
} from "native-base";
import { observer } from "mobx-react";

const CreateProductScreen = () => {
  // State quản lý dữ liệu
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    originalPrice: "",
    promoPrice: "",
    promoCode: "",
    categoryName: "",
    isInStock: true, // Trạng thái còn hàng/hết hàng
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [categories, setCategories] = useState([]); // State cho danh sách danh mục

  // Validation các trường
  const validations = {
    productName: formData.productName.trim() !== "",
    price: formData.price.trim() !== "" && !isNaN(formData.price),
    originalPrice:
      formData.originalPrice.trim() !== "" && !isNaN(formData.originalPrice),
    promoPrice:
      formData.promoPrice.trim() !== "" && !isNaN(formData.promoPrice),
    promoCode: formData.promoCode.trim() !== "",
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    setIsSubmitAttempted(true);

    const isValid = Object.values(validations).every(Boolean);
    if (isValid) {
      console.log({
        ...formData,
      });
    } else {
      console.log("Vui lòng điền đầy đủ thông tin hợp lệ.");
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
          mt={2}
          value={formData.productName}
          onChangeText={(text) => handleInputChange("productName", text)}
          borderColor={
            isSubmitAttempted && !validations.productName
              ? "red.500"
              : "gray.400"
          }
        />
        {isSubmitAttempted && !validations.productName && (
          <Text color="red.500" mt={1}>
            Thông tin bắt buộc
          </Text>
        )}
      </Box>

      {/* Price Inputs */}
      {["price", "originalPrice", "promoPrice"].map((field, index) => (
        <Box bg="white" px={4} py={4} mt={3} key={index}>
          <Text fontSize="md">
            {field === "price"
              ? "Giá bán *"
              : field === "originalPrice"
              ? "Giá vốn *"
              : "Giá khuyến mãi *"}
          </Text>
          <Input
            placeholder="0.000"
            keyboardType="numeric"
            mt={2}
            value={formData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
            borderColor={
              isSubmitAttempted && !validations[field] ? "red.500" : "gray.400"
            }
          />
          {isSubmitAttempted && !validations[field] && (
            <Text color="red.500" mt={1}>
              Thông tin bắt buộc
            </Text>
          )}
        </Box>
      ))}

      {/* Promo Code */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md">Mã khuyến mãi *</Text>
        <Input
          placeholder="Nhập mã"
          mt={2}
          value={formData.promoCode}
          onChangeText={(text) => handleInputChange("promoCode", text)}
          borderColor={
            isSubmitAttempted && !validations.promoCode ? "red.500" : "gray.400"
          }
        />
        {isSubmitAttempted && !validations.promoCode && (
          <Text color="red.500" mt={1}>
            Thông tin bắt buộc
          </Text>
        )}
      </Box>

      {/* Stock Status */}
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
              Đặt là Còn hàng
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onPress={() => handleInputChange("isInStock", false)}
            >
              Đặt là Hết hàng
            </Button>
          </HStack>
        </HStack>
        <HStack mt={2} alignItems="center" justifyContent="space-between">
          <Text>{formData.isInStock ? "Còn hàng" : "Hết hàng"}</Text>
        </HStack>
      </Box>

      {/* Category Selection and List */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md" mb={3}>Danh mục</Text>
        <HStack space={4} alignItems="center">
          {/* Button to Open Modal */}
          <Button
            size="sm"
            colorScheme="blue"
            onPress={() => setIsCategoryModalOpen(true)}
          >
            + Thêm danh mục
          </Button>

          {/* List of Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space={2}>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <Box
                    key={index}
                    borderWidth={1}
                    borderColor="gray.400"
                    borderRadius={4}
                    px={3}
                    py={2}
                    bg="gray.100"
                  >
                    <Text>{category}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">Chưa có danh mục nào</Text>
              )}
            </HStack>
          </ScrollView>
        </HStack>
      </Box>

      {/* Buttons */}
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
              value={formData.categoryName}
              onChangeText={(text) => handleInputChange("categoryName", text)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                if (formData.categoryName.trim() !== "") {
                  setCategories((prev) => [
                    ...prev,
                    formData.categoryName.trim(),
                  ]);
                  setFormData({ ...formData, categoryName: "" });
                  setIsCategoryModalOpen(false);
                }
              }}
            >
              Thêm danh mục
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

export default observer(CreateProductScreen);