// AddCustomerScreen.js
import React from "react";
import { Box, Text, VStack, Center, Icon, Input, HStack, Button } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { observer } from 'mobx-react'

const AddCustomerScreen = ({ route, navigation }) => {
  return (
    <Box flex={1} safeArea p={4} alignItems="center">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Tạo khách hàng mới
      </Text>
      
      <Center mb={6}>
        <Box
          size={100}
          borderRadius="full"
          overflow="hidden"
          bg="gray.200"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={MaterialIcons} name="person" size={12} color="gray.500" />
          <Box
            position="absolute"
            bottom={0}
            right={0}
            bg="black"
            borderRadius="full"
            p={1}
            zIndex={909}
          >
            <Icon as={MaterialIcons} name="camera-alt" color="white" size={4} />
          </Box>
        </Box>
      </Center>

      <VStack space={4} width="90%">
        <VStack>
        <Text fontSize="xs" color="gray.500">
          Tên khách hàng
        </Text>
        <Input
          placeholder="Ví dụ: Nguyễn Văn A"
          placeholderTextColor="gray.400"
          variant="outline"
          _focus={{ borderColor: "green.600" }}
        />
        </VStack>
        <VStack>
        <Text fontSize="xs" color="gray.500">
          Số điện thoại
        </Text>
        <Input
          placeholder="Ví dụ: 0912345678"
          placeholderTextColor="gray.400"
          variant="outline"
        />
        </VStack>
      </VStack>

      <HStack space={4} mt={8} width="90%">
        <Button flex={1} colorScheme="gray" variant="outline" onPress={() => navigation.navigate('manager_client_screen')}>
          Quay lại
        </Button>
        <Button flex={1} colorScheme="green">
          Tạo
        </Button>
      </HStack>
    </Box>
  );
};

export default observer(AddCustomerScreen);
