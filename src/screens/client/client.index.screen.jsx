// CustomerListScreen.js
import React, {useEffect, useState} from "react";
import {Box, Text, ScrollView, HStack, VStack, Icon, Image, Button, Center} from "native-base";
import {MaterialIcons} from "react-native-vector-icons";
import Contacts from "react-native-contacts";
import {observer} from 'mobx-react';
import {FlatList, PermissionsAndroid, Platform} from 'react-native';
import {appDatabaseService} from "../../core/app.database";
import {useIsFocused} from "@react-navigation/native";
import {stringGen} from "../../ultis/helper";

const CustomerListScreen = ({route, navigation}) => {
    const [contacts, setContacts] = useState([]);

    const isFocused = useIsFocused();
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

    const syncFromContact = async () => {
        const hasPermission = await requestContactsPermission();
        if (hasPermission) {
            Contacts.getAll().then(contacts => {
                // Lọc danh sách chỉ lấy tên và số điện thoại
                const formattedContacts = contacts.map(contact => {
                    return {
                        name: contact.displayName,
                        phoneNumbers: contact.phoneNumbers.map(phone => phone.number)
                    };
                }).map(c => ({
                    phone: c.phoneNumbers[0],
                    ...c
                }));
                setContacts([...contacts, ...formattedContacts]);
            }).catch(error => {
                console.error("Lỗi khi lấy danh bạ:", error);
            });
        } else {
            console.log("Không có quyền truy cập danh bạ");
        }
    }
    // Hàm lấy danh bạ
    const loadContacts = async () => {
        // load from device
        // load from database
        const db = await appDatabaseService.getConnection();
        const result = await appDatabaseService.getAll(db, `select * from customers`);
        setContacts(result)
    };

    useEffect(() => {
        loadContacts();
    }, [isFocused]);

    const ContactItem = ({contact}) => {
        return (
            <HStack width={'18%'} mx={2} my={1} space={3} alignItems="center" p={4} borderRadius="md" bg="white">
                {contact?.avatar ? (
                    <Image
                        source={{uri: contact?.avatar}}
                        alt="Customer Avatar"
                        width={61}
                        height={61}
                        borderRadius="full"
                    />
                ) : (
                    <Center width={61} height={61} bgColor={'gray.200'} borderRadius={100}>
                        <Text fontSize={18}>{contact?.name[0].toUpperCase()}</Text>
                    </Center>
                )}
                <VStack>
                    <Text fontSize={18} fontWeight="bold">{contact.name || "Không có tên"}</Text>
                    <Text fontSize={16}>{contact?.phone}</Text>
                </VStack>
            </HStack>
        )
    }
    return (
        <Box flex={1} safeArea p={4}>
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold">
                    Khách hàng
                </Text>
                <Button
                    colorScheme="blue"
                    startIcon={<Icon as={MaterialIcons} name="person-add" size={5} color="white"/>}
                    onPress={() => navigation.navigate('client_add_screen')}
                >
                </Button>
            </HStack>
            <FlatList numColumns={5} keyExtractor={() => stringGen(12)} data={contacts}
                      renderItem={({item}) => <ContactItem contact={item}/>}/>

        </Box>
    );
};

export default observer(CustomerListScreen);
