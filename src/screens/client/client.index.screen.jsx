// CustomerListScreen.js
import React, { useEffect, useState } from "react";
import { Box, Text, ScrollView, HStack, VStack, Icon, Image, Button } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Contacts from "react-native-contacts";
import { observer } from 'mobx-react';
import { PermissionsAndroid, Platform } from 'react-native';

const CustomerListScreen = ({ route, navigation }) => {
  const [contacts, setContacts] = useState([]);

  // Hàm yêu cầu quyền truy cập danh bạ trên Android
  const requestContactsPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Quyền truy cập danh bạ",
          message: "Ứng dụng của bạn cần quyền truy cập danh bạ để thu thập số điện thoại.",
          buttonNeutral: "Hỏi lại sau",
          buttonNegative: "Từ chối",
          buttonPositive: "Đồng ý"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Hàm lấy danh bạ
  const loadContacts = async () => {
    const hasPermission = await requestContactsPermission();
    if (hasPermission) {
      Contacts.getAll().then(contacts => {
        // Lọc danh sách chỉ lấy tên và số điện thoại
        const formattedContacts = contacts.map(contact => {
          return {
            name: contact.displayName,
            phoneNumbers: contact.phoneNumbers.map(phone => phone.number)
          };
        });
        setContacts(formattedContacts);
      }).catch(error => {
        console.error("Lỗi khi lấy danh bạ:", error);
      });
    } else {
      console.log("Không có quyền truy cập danh bạ");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <Box flex={1} safeArea p={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Khách hàng
        </Text>
        <Icon as={MaterialIcons} name="filter-list" size={6} color="gray.600" />
      </HStack>

      <ScrollView>
        <VStack space={4}>
          {contacts.map((contact, index) => (
            <HStack key={index} space={3} alignItems="center" p={4} borderRadius="md" bg="white">
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                alt="Customer Avatar"
                size="sm"
                borderRadius="full"
              />
              <VStack>
                <Text fontWeight="bold">{contact.name || "Không có tên"}</Text>
                {contact.phoneNumbers.map((phone, idx) => (
                  <Text key={idx} color="gray.500">{phone}</Text>
                ))}
              </VStack>
            </HStack>
          ))}
        </VStack>
      </ScrollView>

      <Button
        position="absolute"
        bottom={4}
        left={4}
        right={4}
        colorScheme="blue"
        startIcon={<Icon as={MaterialIcons} name="person-add" size={5} color="white" />}
        onPress={() => navigation.navigate('client_add_screen')}
      >
        Thêm khách hàng
      </Button>
    </Box>
  );
};

export default observer(CustomerListScreen);
