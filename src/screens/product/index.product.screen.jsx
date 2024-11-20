import React, { useState } from "react";
import {
  VStack,
  Box,
  Button,
  ScrollView,
  HStack,
  Input,
  Text,
  Pressable,
} from "native-base";

import { observer } from "mobx-react";
import ProductList from "../../models/productList.model";
import InventoryList from "../../models/InventoryList.model";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const productData = [
  { id: "SP0001", name: "Sản phẩm A", totalQuantity: 20, soldQuantity: 5 },
  { id: "SP0002", name: "Sản phẩm B", totalQuantity: 15, soldQuantity: 15 },
  { id: "SP0003", name: "Sản phẩm C", totalQuantity: 30, soldQuantity: 10 },
  { id: "SP0004", name: "Sản phẩm D", totalQuantity: 10, soldQuantity: 7 },
];

const ProductListScreen = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' hoặc 'inventory'
  const [searchText, setSearchText] = useState(""); // Dùng để lọc sản phẩm (nếu cần)

  return (
    <VStack flex={1} backgroundColor="#f3f3f3">
      {/* Thanh chọn tab */}
      <HStack alignItems="center" space={2} px={4} py={2} bg="white" shadow={1}>
        <Input
          flex={1}
          placeholder="Tìm tên, mã SKU, ..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          variant="filled"
          bg="gray.100"
          borderRadius="md"
          InputLeftElement={
            <MaterialIcons
              name="search"
              size={20}
              color="gray"
              style={{ marginLeft: 8 }}
            />
          }
        />
        <MaterialIcons name="sort" size={24} color="gray" />
        <MaterialIcons name="list" size={24} color="gray" />
      </HStack>

      <HStack bg="white" py={2} px={4} shadow={1}>
        <Box
          flex={1}
          alignItems="center"
        >
          <Button
            bg="white"
            _active={{ bg: "transparent" }}
            _hover={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            onPress={() => setActiveTab("products")}
            variant="outline"
            borderColor={0}
          >
            <Text
              fontSize="md"
              color={activeTab === "products" ? "green.500" : "gray.500"}
              fontWeight="bold"
            >
              Sản phẩm
            </Text>
          </Button>
        </Box>
        <Box
          flex={1}
          alignItems="center"
        >
          <Button
            bg="white"
            _active={{ bg: "transparent" }}
            _hover={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            onPress={() => setActiveTab("inventory")}
            variant="outline"
            borderColor={0}
          >
            <Text
              fontSize="md"
              color={activeTab === "inventory" ? "green.500" : "gray.500"}
              fontWeight="bold"
            >
              Tồn kho
            </Text>
          </Button>
        </Box>
        <Box
          flex={1}
          alignItems="center"
        >

<Button
            bg="white"
            _active={{ bg: "transparent" }}
            _hover={{ bg: "transparent" }}
            onPress={() => setActiveTab("upsell")}
            _focus={{ boxShadow: "none" }}
            variant="outline"
            borderColor={0}
          >
            <Text
              fontSize="md"
              color={activeTab === "upsell" ? "green.500" : "gray.500"}
              fontWeight="bold"
            >
              Bán kèm
            </Text>
          </Button>
         
        </Box>
        <Box
          flex={1}
          alignItems="center"
        >
            <Button
            bg="white"
            _active={{ bg: "transparent" }}
            _hover={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            variant="outline"
            onPress={() => setActiveTab("categories")}
            borderColor={0}
          >
            <Text
              fontSize="md"
              color={activeTab === "categories" ? "green.500" : "gray.500"}
              fontWeight="bold"
            >
             Danh mục
            </Text>
          </Button>
         
        </Box>
      </HStack>

      {/* Hiển thị nội dung theo tab */}
      <ScrollView flex={1} px={4} py={2}>
        {activeTab === "products" ? (
          <ProductList data={productData} />
        ) : (
          <InventoryList data={productData} />
        )}
      </ScrollView>


      <Button
        position="absolute"
        bottom={4}
        right={4}
        bg="blue.500"
        borderRadius="full"
        size={12}
        alignItems="center"
        justifyContent="center"
        
        onPress={() => navigation.navigate("manage_createoder_screen")}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </Button>
    </VStack>
  );
};

export default observer(ProductListScreen);
