import React from 'react';
import { Box, Text, Pressable, ScrollView, VStack, HStack, Input, Switch, Button } from 'native-base';
import {observer} from "mobx-react";

const CreateProductScreen = () => {
  return (
    <ScrollView flex={1} bg="#f9f9f9">
      {/* Header */}
      <Box bg="white" py={4} px={5} borderBottomWidth={1} borderColor="gray.200">
        <Text fontSize="lg" fontWeight="bold">Tạo sản phẩm</Text>
      </Box>

      {/* Product Name Input */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text color="red.500" fontSize="md">Tên sản phẩm *</Text>
        <Input
          placeholder="Ví dụ: Mì Hảo Hảo"
          borderWidth={1}
          borderColor="red.500"
          mt={2}
          _focus={{ borderColor: "red.500" }}
        />
        <Text color="red.500" mt={1}>Thông tin bắt buộc</Text>

        {/* Price Input */}
        <Text mt={4} fontSize="md">Giá bán *</Text>
        <Input
          placeholder="0.000"
          keyboardType="numeric"
          mt={2}
        />
      </Box>

      {/* Category Selection */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md">Danh mục</Text>
        <Pressable mt={2} flexDirection="row" alignItems="center">
          <Box borderWidth={1} borderColor="gray.400" borderRadius={4} px={4} py={2}>
            <Text color="blue.500">+ Tạo danh mục</Text>
          </Box>
        </Pressable>
      </Box>

      {/* Inventory Management */}
      <Box bg="white" px={4} py={4} mt={3}>
        <Text fontSize="md" mb={2}>Quản lý tồn kho</Text>
        
        {/* Product Status */}
        <HStack justifyContent="space-between" alignItems="center" mt={2}>
          <Text>Tình trạng sản phẩm</Text>
          <HStack>
            <Button variant="outline" colorScheme="green" mr={2}>Còn hàng</Button>
            <Button variant="outline" colorScheme="gray">Hết hàng</Button>
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
        <Text fontSize="md" mb={2}>Hiển thị sản phẩm trên Website</Text>
        <Switch />

        <HStack mt={4} space={3}>
          <Button variant="outline" colorScheme="gray">Phân loại</Button>
          <Button variant="outline" colorScheme="gray">Mã vạch sản xuất</Button>
          <Button variant="outline" colorScheme="gray">Khuyến mãi</Button>
          <Button variant="outline" colorScheme="gray">Bán kèm</Button>
        </HStack>
      </Box>

      {/* Bottom Buttons */}
      <HStack mt={6} px={4} space={3} justifyContent="space-between">
        <Button flex={1} colorScheme="gray">Tạo thêm</Button>
        <Button flex={1} colorScheme="green">Hoàn tất</Button>
      </HStack>
    </ScrollView>
  );
};

export default observer(CreateProductScreen);
