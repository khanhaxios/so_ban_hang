import React, { useState } from "react";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native";
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Text,
  VStack,
  Icon,
  FlatList,
  Divider,
  Image,
  Input,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

const CreateOrderScreen = ({ route, navigation }) => {
  const allProducts = [
    {
      id: 1,
      name: "Bm pate",
      price: 10000,
      category: "Bánh mì",
      imageUrl: "https://via.placeholder.com/80",
      quantity: 0,
    },
    {
      id: 2,
      name: "Bm bò khô",
      price: 10000,
      category: "Bánh mì",
      imageUrl: "https://via.placeholder.com/80",
      quantity: 0,
    },
    {
      id: 3,
      name: "Bm pate heo quay",
      price: 10000,
      category: "Bánh mì",
      imageUrl: "https://via.placeholder.com/80",
      quantity: 0,
    },
    {
      id: 4,
      name: "Bm thập cẩm",
      price: 20000,
      category: "Bánh mì",
      imageUrl: "https://via.placeholder.com/80",
      quantity: 0,
    },
    {
      id: 5,
      name: "Trà đào",
      price: 5000,
      category: "Đồ uống pha sẵn",
      imageUrl: "https://via.placeholder.com/80",
      quantity: 0,
    },
    {
      id: 6,
      name: "Trà ổi",
      price: 5000,
      category: "Đồ uống pha sẵn",
      imageUrl: "https://via.placeholder.com/80",
      quantity: 0,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0); // Trạng thái cho giảm giá
  const [shippingFee, setShippingFee] = useState(0); // Trạng thái cho phí vận chuyển

  const filteredProducts =
    selectedCategory === "Tất cả"
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, action) => {
    setCartItems(
      (prevCart) =>
        prevCart
          .map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity:
                    action === "increase"
                      ? item.quantity + 1
                      : item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove items with quantity 0
    );
  };
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const finalAmount = totalAmount - discount + shippingFee; // Tính toán tổng cộng sau khi trừ giảm giá và cộng phí vận chuyển

  return (
    <Box flex={1} bg="white">
      {/* Header */}
      <HStack py={4} px={4} alignItems="center" justifyContent="space-between">
        {/* Left Section - Tạo đơn và các icon */}
        <HStack justifyContent={"space-between"} flex={2}>
          <HStack space={3} ml={4}>
            <Text color="black" fontSize="lg" ml={2}>
              Tạo đơn
            </Text>
          </HStack>

          <HStack space={3} ml={4}>
            <IconButton
              icon={<Icon as={Ionicons} name="search" color="black" />}
            />
            <IconButton
              icon={<Icon as={Ionicons} name="scan" color="black" />}
            />
            <IconButton
              icon={<Icon as={Ionicons} name="flash" color="black" />}
            />
          </HStack>
        </HStack>

        {/* Right Section - Giá lẻ */}
        <HStack flex={1} justifyContent="flex-start">
          <Button
            variant="outline"
            borderColor="#075ae0"
            borderRadius={8}
            _text={{ color: "#075ae0" }}
          >
            Giá lẻ
          </Button>
        </HStack>
      </HStack>

      {/* Main Content */}
      {filteredProducts.length === 0 ? (
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
      ) : (
        <Box flex={1} bg="white">
          <HStack flex={1} bg="#f2f2f2">
            {/* Danh mục sản phẩm bên trái */}
            <VStack width="17%" space={2} px={4}>
              {["Tất cả", "Bánh mì", "Đồ uống pha sẵn"].map((category) => (
                <Button
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  backgroundColor={selectedCategory === category ? "#075ae0" : "white"}
                  _hover={{
                    bg: "white",  // Đổi màu nền khi hover thành màu trắng
                    borderColor: "#075ae0", // Nếu cần, có thể thêm viền màu xanh để tạo hiệu ứng hover rõ ràng hơn
                  }}
                >
                  <Text
                    color={selectedCategory === category ? "white" : "grey"}
                  >
                    {category}
                  </Text>
                </Button>
              ))}
            </VStack>

            {/* Danh sách sản phẩm bên trái */}
            <VStack width="48%" space={4}>
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={
                  filteredProducts.length >= 4 ? 4 : filteredProducts.length
                } // Điều chỉnh số cột dựa trên số lượng sản phẩm
                key={`flatlist-${filteredProducts.length}`} // Thay đổi key để buộc FlatList render lại khi số lượng sản phẩm thay đổi
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                    style={{
                      flex: 1,
                      maxWidth: "25%",
                      width: "25%",
                    }}
                  >
                    <VStack
                      p={2}
                      alignItems="center"
                      borderBottomWidth={1}
                      borderColor="gray.200"
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        alt={item.name}
                        width="100%"
                        height={32}
                      />
                      <Text numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                      </Text>
                      <Text>{item.price} đ</Text>
                    </VStack>
                  </TouchableOpacity>
                )}
              />

              <Button
                mt={4}
                colorScheme="green"
                px={8}
                width="full"
                onPress={() => navigation.navigate("manage_createoder_screen")}
              >
                Thêm sản phẩm
              </Button>
            </VStack>

            {/* Hóa đơn bên phải */}
            <VStack width="35%" bg="white" p={4}>
              {cartItems.length > 0 ? (
                <VStack space={3}>
                  {cartItems.map((item) => (
                    <HStack
                      key={item.id}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="md" flex={1}>
                        {item.name}
                      </Text>
                      <Text fontSize="md">{item.price} đ</Text>
                      <HStack alignItems="center">
                        <IconButton
                          icon={
                            <Icon as={Ionicons} name="remove-circle-outline" />
                          }
                          onPress={() => updateQuantity(item.id, "decrease")}
                        />
                        <Text mx={2}>{item.quantity}</Text>
                        <IconButton
                          icon={
                            <Icon as={Ionicons} name="add-circle-outline" />
                          }
                          onPress={() => updateQuantity(item.id, "increase")}
                        />
                      </HStack>
                    </HStack>
                  ))}
                  <Divider my={2} />
                  <HStack justifyContent="space-between">
                    <Text fontSize="md">
                      Tổng cộng {cartItems.length} sản phẩm
                    </Text>
                    <Text fontSize="md">{totalAmount} đ</Text>
                  </HStack>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md">Giảm giá</Text>
                    <HStack alignItems="center">
                      <Input
                        width="100px"
                        value={discount.toString()}
                        onChangeText={(value) => setDiscount(Number(value))}
                        keyboardType="text"
                      />
                      <Text ml={2}>đ</Text>
                    </HStack>
                  </HStack>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md">Vận chuyển</Text>
                    <HStack alignItems="center">
                      <Input
                        width="100px"
                        value={shippingFee.toString()}
                        onChangeText={(value) => setShippingFee(Number(value))}
                        keyboardType="text"
                      />
                      <Text ml={2}>đ</Text>
                    </HStack>
                  </HStack>

                  <Divider my={2} />
                  <HStack justifyContent="space-between">
                    <Text fontSize="md" fontWeight="bold">
                      Tổng cộng tất cả
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                      {finalAmount} đ
                    </Text>
                  </HStack>
                  <HStack space={2}>
                    <Button
                      variant="outline"
                      colorScheme="#16a34a"
                      borderColor={"#16a34a"}
                      borderRadius={8}
                      mt={2}
                      width={"50%"}
                    >
                      Giao sau
                    </Button>
                    <Button backgroundColor="#16a34a" mt={2} width={"50%"}>
                      Bán nhanh
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <Center flex={1}>
                  <Text textAlign="center" fontSize="md" color="gray.600">
                    Chưa có sản phẩm nào được thêm vào đơn này!
                  </Text>
                </Center>
              )}
            </VStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default observer(CreateOrderScreen);
