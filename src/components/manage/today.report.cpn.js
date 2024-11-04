import {HStack, Text, VStack} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {ScrollView} from "react-native";
import {convertNumberToCurrency, SW} from "../../ultis/helper";

export const TodayReportCpn = ({reportData}) => {
    return (
        <VStack backgroundColor={'white'} mx={3} shadow={1} borderRadius={5} px={3}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
                <Text color={'gray.500'} letterSpacing={.6} fontSize={15} fontWeight={'bold'}>Hôm nay</Text>
                <HStack py={2} space={1} alignItems={'center'} justifyContent={'center'}>
                    <Text color={'#3748e2'} fontSize={15} letterSpacing={.6}>Xem lãi lỗ</Text>
                    <Ionicons name={'chevron-forward-outline'} size={15} color={'#3748e2'}/>
                </HStack>
            </HStack>
            <HStack pt={1} width={'100%'} pb={4} justifyContent={'space-between'} alignItems={'center'}>
                <VStack space={2}>
                    <HStack space={2} alignItems={'center'}>
                        <Ionicons name={'stats-chart'} size={15} color={'#d5ae00'}/>
                        <Text letterSpacing={.6} fontSize={15} fontWeight={'bold'} color={'gray.500'}>Doanh
                            thu</Text>
                    </HStack>
                    <Text letterSpacing={.6} fontWeight={'bold'} fontSize={18} textAlign={'center'}>0</Text>
                </VStack>
                <VStack space={2}>
                    <HStack space={2} alignItems={'center'}>
                        <Ionicons name={'clipboard'} size={18} color={'#0859c2'}/>
                        <Text letterSpacing={.6} fontSize={15} fontWeight={'bold'} color={'gray.500'}>Đơn
                            hàng</Text>
                    </HStack>
                    <Text letterSpacing={.6} fontWeight={'bold'} fontSize={18} textAlign={'center'}>0</Text>
                </VStack>
                <VStack space={2}>
                    <HStack space={2} alignItems={'center'}>
                        <Ionicons name={'cash-outline'} size={18} color={'#00764e'}/>
                        <Text letterSpacing={.6} fontSize={15} fontWeight={'bold'} color={'gray.500'}>Lợi
                            nhuận</Text>
                    </HStack>
                    <Text letterSpacing={.6} fontWeight={'bold'} fontSize={18}
                          textAlign={'center'}>{convertNumberToCurrency(1243133223)}</Text>
                </VStack>
            </HStack>
        </VStack>
    )
}