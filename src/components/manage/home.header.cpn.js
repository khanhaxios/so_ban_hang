import {Center, HStack, VStack, Text} from "native-base";
import {Image, Pressable} from "react-native";
import icon from '../../res/icon.png'
import Ionicons from "react-native-vector-icons/Ionicons";

export const HomeHeaderCpn = ({handleSearch, handleShowShopInfo, handleOpenMenuBar}) => {
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
                        <Text fontWeight={'semibold'} fontSize={16} color={'white'}>Dang Khanh</Text>
                        <HStack space={1} alignItems={'center'} justifyContent={'center'}>
                            <Text fontWeight={'semibold'} my={0} fontSize={12} color={'white'}>Thông tin cửa hàng</Text>
                            <Ionicons name={'chevron-forward'} color={'white'} size={12}/>
                        </HStack>
                    </VStack>
                </Pressable>
            </HStack>
            <HStack space={4} alignItems={'center'} justifyContent={'center'}>
                <Pressable>
                    <Ionicons name={'search-outline'} color={'white'} size={24}/>
                </Pressable>
                <Pressable>
                    <Ionicons name={'notifications-outline'} color={'white'} size={24}/>
                </Pressable>
            </HStack>

        </HStack>
    )
}
