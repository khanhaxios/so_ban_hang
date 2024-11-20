import React from 'react';
import { Box, Text, HStack, Pressable } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";

const ProductList = ({ data }) => {
  return (
    <Box>
      {data.map((product) => (
          <HStack
          key={product.id}
          bg="white"
          shadow={1}
          p={4}
          mb={4}
          borderRadius="md"
          alignItems="center"
        >
          {/* Product Image */}
          <Box
            size={12}
            bg="gray.100"
            borderRadius="md"
            mr={4}
            overflow="hidden"
          >
            {/* Replace the image below with actual product image */}
            <Box flex={1} bg="gray.300" />
          </Box>

          {/* Product Info */}
          <Box flex={1}>
            <Text fontWeight="bold">{product.name}</Text>
            <Text color="gray.500">Có thể bán: {product.stock}</Text>
            <Text color="orange.500" fontWeight="bold">
              {product.price}
            </Text>
          </Box>

          {/* Edit Button */}
          <Pressable onPress={() => setModalVisible(true)}>
            <MaterialIcons name="edit" size={24} color="blue" />
          </Pressable>
        </HStack>
      ))}
    </Box>
  );
};

export default ProductList;
