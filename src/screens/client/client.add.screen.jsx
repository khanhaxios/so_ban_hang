import React from "react";
import {Box, Text, VStack, Center, Icon, Input, HStack, Button} from "native-base";
import {MaterialIcons} from "react-native-vector-icons";
import {observer} from 'mobx-react'
import * as ImagePicker from 'expo-image-picker';
import {Pressable, Image, ToastAndroid} from "react-native";
import {copyImage} from "../../ultis/helper";
import {appDatabaseService} from "../../core/app.database";

const initState = {
    avatar: '',
    phone: '',
    name: ''
}
const AddCustomerScreen = ({route, navigation}) => {
    const [newCustomer, setNewCustomer] = React.useState(initState);
    const [avatarUploaded, setAvatarUploaded] = React.useState(null);
    const handleInput = (name, value) => {
        setNewCustomer({...newCustomer, [name]: value})
    }
    const handlePickFile = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({allowsMultipleSelection: false, quality: 1})
        if (result.canceled) {
            return;
        }
        setAvatarUploaded(result.assets[0]);
    }
    const handleAddCustomer = async () => {
        try {
            // copy image
            const finalData = {
                ...newCustomer,
                avatar: avatarUploaded ? await copyImage(avatarUploaded) : null,
            }
            console.log(finalData)
            const db = await appDatabaseService.getConnection();
            const stmt = await appDatabaseService.createInsertStatement(db, 'customers', finalData);
            await stmt.executeAsync(appDatabaseService.createInsertStatementArgs(finalData));
            ToastAndroid.show("Thêm thành công", ToastAndroid.LONG);
            setNewCustomer(initState)
            setAvatarUploaded(null)
        } catch (e) {
            console.log(e);
            ToastAndroid.show("Có lỗi xảy ra hãy thủ lại sau", ToastAndroid.LONG);
        }
    }
    return (
        <Box flex={1} safeArea p={4} alignItems="center">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Tạo khách hàng mới
            </Text>

            <Center mb={6}>
                <Pressable onPress={handlePickFile}>
                    {(avatarUploaded && avatarUploaded !== '') ? (
                        <Image source={{uri: avatarUploaded.uri}} width={100} height={100} borderRadius={100}/>
                    ) : (
                        <DefaultImage/>
                    )}
                </Pressable>
            </Center>

            <VStack space={4} width="90%">
                <VStack>
                    <Text fontSize="xs" color="gray.500">
                        Tên khách hàng
                    </Text>
                    <Input
                        defaultValue={newCustomer.name}
                        onChangeText={(t) => handleInput('name', t)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        placeholderTextColor="gray.400"
                        variant="outline"
                        _focus={{borderColor: "green.600"}}
                    />
                </VStack>
                <VStack>
                    <Text fontSize="xs" color="gray.500">
                        Số điện thoại
                    </Text>
                    <Input
                        maxLength={10}
                        minLength={10}
                        keyboardType={'phone-pad'}
                        defaultValue={newCustomer.phone}
                        onChangeText={(t) => handleInput('phone', t)}
                        placeholder="Ví dụ: 0912345678"
                        placeholderTextColor="gray.400"
                        variant="outline"
                    />
                </VStack>
            </VStack>

            <HStack space={4} mt={8} width="90%">
                <Button flex={1} colorScheme="gray" variant="outline"
                        onPress={() => navigation.navigate('manager_client_screen')}>
                    Quay lại
                </Button>
                <Button onPress={handleAddCustomer} flex={1} colorScheme="green">
                    Tạo
                </Button>
            </HStack>
        </Box>
    );
};

export const DefaultImage = () => {
    return (
        <Box
            size={100}
            borderRadius="full"
            overflow="hidden"
            bg="gray.200"
            justifyContent="center"
            alignItems="center"
        >
            <Icon as={MaterialIcons} name="person" size={12} color="gray.500"/>
            <Box
                position="absolute"
                bottom={0}
                right={0}
                bg="black"
                borderRadius="full"
                p={1}
                zIndex={909}
            >
                <Icon as={MaterialIcons} name="camera-alt" color="white" size={4}/>
            </Box>
        </Box>
    )
}
export default observer(AddCustomerScreen);
