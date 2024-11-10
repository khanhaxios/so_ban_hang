import React from 'react';
import { Box, Button, Center, HStack, IconButton, Text, VStack, Icon, Image } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {observer} from "mobx-react";

const CreateOrderScreen = () => {
  return (
    <Box flex={1} bg="#f9f9f9">
      {/* Header */}
      <HStack bg="#4CAF50" py={4} px={4} alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <IconButton icon={<Icon as={Ionicons} name="arrow-back" color="white" />} />
          <Text color="white" fontSize="lg" ml={2}>Tạo đơn</Text>
        </HStack>
        <HStack space={3}>
          <IconButton icon={<Icon as={Ionicons} name="search" color="white" />} />
          <IconButton icon={<Icon as={Ionicons} name="scan" color="white" />} />
          <IconButton icon={<Icon as={Ionicons} name="flash" color="white" />} />
          <Button variant="outline" colorScheme="white" borderRadius={8}>Giá lẻ</Button>
        </HStack>
      </HStack>

      {/* Content */}
      <Center flex={1} px={4}>
        {/* Placeholder for checklist image */}
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          alt="Checklist"
          size="lg"
          mb={4}
        />
        <Text textAlign="center" fontSize="md" color="gray.600">
          Bạn chưa có sản phẩm nào. Thêm sản phẩm để lên hóa đơn cho khách hàng nhé
        </Text>
        <Button mt={4} colorScheme="green" borderRadius="full" px={8}>
          Thêm sản phẩm
        </Button>
      </Center>

      {/* Right Section */}
      <Center flex={1} px={4} bg="#f2f2f2">
        {/* Placeholder for image icon */}
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          alt="No products"
          size="lg"
          mb={4}
        />
        <Text textAlign="center" fontSize="md" color="gray.600">
          Chưa có sản phẩm nào được thêm vào đơn này!
        </Text>
      </Center>
    </Box>
  );
};

export default observer(CreateOrderScreen);
