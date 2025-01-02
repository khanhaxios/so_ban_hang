import React, {useLayoutEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Pressable, useWindowDimensions} from 'react-native'
import {AppContainer} from '../../components/layout/container.cpn'
import {
    Box,
    Text,
    ScrollView,
    Image,
    VStack,
    HStack,
} from 'native-base'
import {HomeHeaderCpn} from '../../components/manage/home.header.cpn'
import {HomeHeaderOverlayCpn} from '../../components/manage/home.header.overlay.cpn'
import {TodayReportCpn} from '../../components/manage/today.report.cpn'
import {store} from "../../models/store.model";
import {appDatabaseService} from "../../core/app.database";
import {order} from "../../models/order.model";
import {useIsFocused} from "@react-navigation/native";

const ManageHomeScreen = ({route, navigation}) => {
    const [reportData, setReportData] = useState({});
    const {width} = useWindowDimensions()
    const isFocused = useIsFocused();

    const isTabletLandscape = width > 768

    useLayoutEffect(() => {
        store.getStore().then();
    }, []);

    const handlerOpenSearch = () => {
        // Implement search logic here
    }

    const handleOpenShopInfo = () => {
        // Implement shop info logic here
    }

    const handleOpenMenuBar = () => {
        // Implement menu bar logic here
    }
    const getTodayReport = async () => {
        setReportData(await order.getTodayReport());
    }
    useLayoutEffect(() => {
        getTodayReport().then();
    }, [isFocused])
    return (
        <AppContainer>
            <VStack flex={1} backgroundColor="#f3f3f3">
                <HomeHeaderOverlayCpn/>
                <HomeHeaderCpn storeInfo={store.currentStore}/>
                <ScrollView flex={1}>
                    <TodayReportCpn reportData={reportData}/>
                    <Box flex={1} backgroundColor="#f3f3f3" px={3}>
                        <HStack
                            flexWrap="wrap"
                            py={4}
                            space={6}
                            alignItems={'center'}
                        >
                            <Pressable
                                style={{width: '15%'}}
                                onPress={() => navigation.navigate('manage_sell_screen')}
                            >
                                <Box
                                    alignItems="center"
                                    backgroundColor="white"
                                    width={'100%'}
                                    p={4}
                                    borderRadius="md"
                                >

                                    <Image
                                        source={require('../../../assets/shop.png')}
                                        alt="shop icon"
                                        size="sm"
                                    />
                                    <Text color="#555" fontSize="sm" mt={1}>
                                        Bán hàng
                                    </Text>

                                </Box>
                            </Pressable>
                            <Pressable
                                style={{width: '15%'}}
                                onPress={() => navigation.navigate('manager_product_screen')}
                            >
                                <Box
                                    alignItems="center"
                                    backgroundColor="white"
                                    width={'100%'}
                                    p={4}
                                    borderRadius="md"
                                >
                                    <Image
                                        source={require('../../../assets/box.png')}
                                        alt="box icon"
                                        size="sm"
                                    />
                                    <Text color="#555" fontSize="sm" mt={1}>
                                        Sản phẩm
                                    </Text>
                                </Box>
                            </Pressable>

                            <Pressable
                                style={{width: '15%'}}
                                onPress={() => navigation.navigate('manager_client_screen')}
                            >
                                <Box
                                    alignItems="center"
                                    backgroundColor="white"
                                    width={'100%'}
                                    p={4}
                                    borderRadius="md"
                                >
                                    <Image
                                        source={require('../../../assets/user.png')}
                                        alt="box icon"
                                        size="sm"
                                    />
                                    <Text color="#555" fontSize="sm" mt={1}>
                                        Khách hàng
                                    </Text>
                                </Box>
                            </Pressable>
                            <Pressable onPress={() => {
                                navigation.navigate('analytic_screen')
                            }} style={{width: '15%'}}>
                                <Box
                                    alignItems="center"
                                    backgroundColor="white"
                                    width={'100%'}
                                    p={4}
                                    borderRadius="md"
                                >
                                    <Image
                                        source={require('../../../assets/thuchi.png')}
                                        alt="thu icon"
                                        size="sm"
                                    />
                                    <Text color="#555" fontSize="sm" mt={1}>
                                        Thu chi
                                    </Text>
                                </Box>
                            </Pressable>
                            <Pressable onPress={() => {
                                navigation.navigate('report_screen')
                            }} style={{width: '15%'}}>
                                <Box
                                    alignItems="center"
                                    backgroundColor="white"
                                    width={'100%'}
                                    p={4}
                                    borderRadius="md"
                                >

                                    <Image
                                        source={require('../../../assets/kho.png')}
                                        alt="kho icon"
                                        size="sm"
                                    />
                                    <Text color="#555" fontSize="sm" mt={1}>
                                        Báo cáo
                                    </Text>
                                </Box>
                            </Pressable>
                        </HStack>
                    </Box>
                </ScrollView>
            </VStack>
        </AppContainer>
    )
}

export default observer(ManageHomeScreen)
