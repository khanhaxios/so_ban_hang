import React, { useState } from "react";
import { observer } from "mobx-react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Center, HStack, Text, VStack, ScrollView, Pressable, Image, Button } from "native-base";
import { AppContainer } from "../../components/layout/container.cpn";
import icon from "../../res/icon.png";
import FilterSection from "../../components/filter/FilterSection.cpn";

const AnalyticIndexScreen = ({ navigation, route }) => {
  const [dataFake, setDataFake] = useState([
    {
      type: "Bán hàng",
      description: "Sản phẩm A",
      amount: 500000,
      isExpense: false,
      method: "Tiền mặt",
      date: "06/11/2024",
    },
    {
      type: "Mua hàng",
      description: "Sản phẩm B",
      amount: 300000,
      isExpense: true,
      method: "Chuyển khoản",
      date: "05/11/2024",
    },
    {
      type: "Bán hàng",
      description: "Sản phẩm C",
      amount: 215000,
      isExpense: false,
      method: "Ví điện tử",
      date: "06/11/2024",
    },
    {
      type: "Bán hàng",
      description: "Sản phẩm A",
      amount: 500000,
      isExpense: false,
      method: "Tiền mặt",
      date: "06/11/2024",
    },
    {
      type: "Mua hàng",
      description: "Sản phẩm B",
      amount: 300000,
      isExpense: true,
      method: "Chuyển khoản",
      date: "05/11/2024",
    },
    {
      type: "Bán hàng",
      description: "Sản phẩm C",
      amount: 215000,
      isExpense: false,
      method: "Ví điện tử",
      date: "06/11/2024",
    },
  ]);
  const [filteredData, setFilteredData] = useState(dataFake);

  const calculateTotals = (data) => {
    const totalIncome = data
      .filter((item) => !item.isExpense)
      .reduce((acc, item) => acc + item.amount, 0);
    const totalExpense = data
      .filter((item) => item.isExpense)
      .reduce((acc, item) => acc + item.amount, 0);

    return {
      totalIncome,
      totalExpense,
    };
  };

  const { totalIncome, totalExpense } = calculateTotals(filteredData);

  const groupByDate = (data) => {
    return data.reduce((groups, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };

  const groupedData = groupByDate(filteredData);

  const renderTransactionItem = (item) => (
    <VStack
      key={item.description}
      flexDirection="row"
      justifyContent="space-between"
      p={4}
      bg="white"
      borderBottomWidth={1}
      borderBottomColor="#EAEAEA"
    >
      <VStack flex={1}>
        <Text fontWeight="bold">{item.type}</Text>
        <Text color="#666" fontSize="xs">
          {item.description}
        </Text>
      </VStack>
      <VStack>
        <Text fontWeight="bold" fontSize="lg" color={item.isExpense ? "#EB5757" : "#27AE60"}>
          {item?.amount?.toLocaleString()}đ
        </Text>
        <Text fontSize="xs" color="#999">
          {item.method}
        </Text>
      </VStack>
    </VStack>
  );

  return (
    <AppContainer>
      {/* Header */}
      <VStack bg="#17683d" flexDirection="row" alignItems="center" justifyContent="center">
        <HStack
          width="100%"
          px={2}
          py={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack space={2} justifyContent="center" alignItems="center">
            <Pressable>
              <Center py={1}>
                <Image source={icon} alt="icon" size={12} />
              </Center>
            </Pressable>
            <Pressable>
              <VStack>
                <Text fontWeight="semibold" fontSize="md" color="white">
                  Dang Khanh
                </Text>
                <HStack space={1} alignItems="center" justifyContent="center">
                  <Text fontWeight="semibold" fontSize="xs" color="white">
                    Thông tin cửa hàng
                  </Text>
                  <Ionicons name="chevron-forward" color="white" size={12} />
                </HStack>
              </VStack>
            </Pressable>
          </HStack>
          <HStack space={4} alignItems="center">
            <Pressable>
              <Ionicons name="search-outline" color="white" size={24} />
            </Pressable>
            <Pressable>
              <Ionicons name="notifications-outline" color="white" size={24} />
            </Pressable>
          </HStack>
        </HStack>
      </VStack>

      {/* Content */}
      <ScrollView flex={1} bg="#F5F5F5">
        {/* Filter Section */}
        <VStack bg="white">
          <HStack justifyContent="space-between" px={2}>
            <FilterSection setFilteredData={setFilteredData} data={dataFake} />
            <Pressable>
              <Ionicons name="search-outline" color="black" size={24} />
            </Pressable>
          </HStack>

          {/* Summary Section */}
          <HStack justifyContent="space-around" py={2} bg="white">
            <VStack alignItems="center" bg="#f3f3f3" p={4} width="45%" borderRadius="md">
              <Text fontSize="sm" color="#666">
                Tổng chi
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="#EB5757">
                {totalExpense.toLocaleString()}đ
              </Text>
            </VStack>
            <VStack alignItems="center" bg="#f3f3f3" p={4} width="45%" borderRadius="md">
              <Text fontSize="sm" color="#666">
                Tổng thu
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="#27AE60">
                {totalIncome.toLocaleString()}đ
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Transaction List */}
        <VStack flex={1} bg="#F5F5F5">
          {Object.keys(groupedData).map((date, index) => (
            <VStack key={index}>
              {/* Date Section */}
              <VStack flexDirection="row" justifyContent="space-between" p={4} bg="#F5F5F5">
                <Text fontWeight="bold" color="#666">
                  {date}
                </Text>
              </VStack>
              {/* Transactions under the date */}
              {groupedData[date].map((transaction) => renderTransactionItem(transaction))}
            </VStack>
          ))}
        </VStack>
      </ScrollView>

      {/* Footer Buttons */}
      <HStack justifyContent="space-around" py={4} bg="white" mx={2}>
        <Button flex={1} py={3} bg="#EB5757" mr={2}>
          <Text color="white" fontWeight="bold">
            Khoản chi
          </Text>
        </Button>
        <Button flex={1} py={3} bg="#27AE60" ml={2}>
          <Text color="white" fontWeight="bold">
            Khoản thu
          </Text>
        </Button>
      </HStack>
    </AppContainer>
  );
};

export default observer(AnalyticIndexScreen);
