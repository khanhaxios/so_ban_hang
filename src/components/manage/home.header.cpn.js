import {Center, HStack, VStack, Text} from "native-base";
import {Image, Pressable} from "react-native";
import icon from '../../res/icon.png'
import Ionicons from "react-native-vector-icons/Ionicons";
import {useLayoutEffect} from "react";
import {store} from "../../models/store.model";

export const HomeHeaderCpn = ({handleSearch, handleShowShopInfo, handleOpenMenuBar, storeInfo}) => {

    return (
        <HStack width={'100%'} px={2} py={1} backgroundColor={'transparent'} justifyContent={'space-between'}
                alignItems={'center'}>
            <HStack justifyContent={'center'} alignItems={'center'} space={2}>
                <Pressable onPress={handleOpenMenuBar}>
                    <Center py={1}>
                        <Image source={icon} style={{width: 50, height: 50}}/>
                    </Center>
                </Pressable>
                <Pressable onPress={handleShowShopInfo}>
                    <VStack>
                        <Text fontWeight={'semibold'} fontSize={16} color={'white'}>{storeInfo?.name}</Text>
                        <HStack space={1} alignItems={'center'} justifyContent={'center'}>
                            <Text fontWeight={'semibold'} my={0} fontSize={12} color={'white'}>Thông tin cửa hàng</Text>
                            <Ionicons name={'chevron-forward'} color={'white'} size={12}/>
                        </HStack>
                    </VStack>
                </Pressable>
            </HStack>
        </HStack>
    )
}
