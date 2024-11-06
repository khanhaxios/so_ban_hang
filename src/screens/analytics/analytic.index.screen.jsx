import React, { useState } from "react";
import {
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { observer } from "mobx-react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Center, HStack, Text, VStack } from "native-base";
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
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
      }}
    >
      <VStack flex={1}>
        <Text style={{ fontWeight: "bold" }}>{item.type}</Text>
        <Text style={{ color: "#666", fontSize: 12 }}>{item.description}</Text>
      </VStack>
      <VStack>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: item.isExpense ? "#EB5757" : "#27AE60",
          }}
        >
          {item?.amount?.toLocaleString()}đ
        </Text>
        <Text style={{ fontSize: 12, color: "#999" }}>{item.method}</Text>
      </VStack>
    </VStack>
  );

  return (
    <AppContainer>
      <VStack
        style={{
          backgroundColor: "#17683d",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HStack
          width={"100%"}
          px={2}
          py={1}
          style={{
            backgroundColor: "transparent",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HStack justifyContent={"center"} alignItems={"center"} space={2}>
            <Pressable>
              <Center py={1}>
                <Image source={icon} style={{ width: 50, height: 50 }} />
              </Center>
            </Pressable>
            <Pressable>
              <VStack>
                <Text
                  style={{ fontWeight: "semibold", fontSize: 16, color: "white" }}
                >
                  Dang Khanh
                </Text>
                <HStack
                  space={1}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Text
                    style={{ fontWeight: "semibold", fontSize: 12, color: "white" }}
                  >
                    Thông tin cửa hàng
                  </Text>
                  <Ionicons
                    name={"chevron-forward"}
                    color={"white"}
                    size={12}
                  />
                </HStack>
              </VStack>
            </Pressable>
          </HStack>
          <HStack space={4} alignItems={"center"} justifyContent={"center"}>
            <Pressable>
              <Ionicons name={"search-outline"} color={"white"} size={24} />
            </Pressable>
            <Pressable>
              <Ionicons
                name={"notifications-outline"}
                color={"white"}
                size={24}
              />
            </Pressable>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        {/* Filter Buttons */}
        <VStack backgroundColor="white">
          <VStack
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 8,
            }}
          >
            <FilterSection setFilteredData={setFilteredData} data={dataFake} />
            <HStack space={4} alignItems={"center"} justifyContent={"center"}>
              <Pressable>
                <Ionicons name={"search-outline"} color={"black"} size={24} />
              </Pressable>
            </HStack>
          </VStack>

          {/* Summary Section */}
          <VStack
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 10,
              backgroundColor: "white",
            }}
          >
            <VStack
              style={{
                alignItems: "center",
                backgroundColor: "#f3f3f3",
                paddingVertical: 10,
                paddingHorizontal: 10,
                width: "45%",
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 14, color: "#666" }}>Tổng chi</Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#EB5757" }}
              >
                {totalExpense.toLocaleString()}đ
              </Text>
            </VStack>
            <VStack
              style={{
                alignItems: "center",
                backgroundColor: "#f3f3f3",
                paddingVertical: 10,
                paddingHorizontal: 10,
                width: "45%",
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 14, color: "#666" }}>Tổng thu</Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#27AE60" }}
              >
                {totalIncome.toLocaleString()}đ
              </Text>
            </VStack>
          </VStack>
        </VStack>

        {/* Transaction List */}
        <VStack style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
          {Object.keys(groupedData).map((date, index) => (
            <VStack key={index}>
              {/* Date Section */}
              <VStack
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 16,
                  backgroundColor: "#F5F5F5",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#666" }}>{date}</Text>
              </VStack>
              {/* Transactions under the date */}
              {groupedData[date].map((transaction) => renderTransactionItem(transaction))}
            </VStack>
          ))}
        </VStack>
      </ScrollView>

      {/* Footer Buttons */}
      <VStack
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 16,
          backgroundColor: "white",
          marginHorizontal: 8,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 5,
            backgroundColor: "#EB5757",
            marginRight: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Khoản chi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 5,
            backgroundColor: "#27AE60",
            marginLeft: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Khoản thu</Text>
        </TouchableOpacity>
      </VStack>
    </AppContainer>
  );
};

export default observer(AnalyticIndexScreen);
