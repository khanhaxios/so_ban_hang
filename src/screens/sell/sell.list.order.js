import {observer} from "mobx-react";
import {AppContainer} from "../../components/layout/container.cpn";
import {Box, Button, Center, Divider, FormControl, HStack, Modal, Text, VStack} from "native-base";
import {useLayoutEffect, useState} from "react";
import {ActivityIndicator, FlatList, Image, Pressable, TextInput, ToastAndroid} from "react-native";
import {order} from "../../models/order.model";
import Ionicons from "react-native-vector-icons/Ionicons";
import {delaySync, formatCurrency} from "../../ultis/helper";
import {appDatabaseService} from "../../core/app.database";

const SellListOrder = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState('');
    const OrderItem = ({order}) => {
        const [open, setOpen] = useState(false);
        const [details, setDetails] = useState([]);
        const getOrderDetail = async () => {
            const db = await appDatabaseService.getConnection();
            return await db.getAllAsync(`select products.image , products.name ,products.price,ordersDetail.quantity from ordersDetail join products on products.id = ordersDetail.productId where orderId = ${order.id}`);
        }
        const handleOpenDetail = () => {
            getOrderDetail().then((res) => {
                setOpen(true);
                console.log(res)
                setDetails(res);
            })
        }
        const DetailItem = ({item}) => {
            return (
                <HStack my={1} p={1} space={2} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <HStack space={2} alignItems={'flex-start'}>
                        <Image style={{borderRadius: 6}} source={{uri: item.image}} width={36} height={48}/>
                        <VStack>
                            <Text fontSize={16} fontWeight={'bold'}>{item.name} x {item.quantity}</Text>
                            <Text fontSize={12} color={'gray.400'}>{formatCurrency(item.price)}</Text>
                        </VStack>
                    </HStack>
                    <Text color={'green.700'}>{formatCurrency(item.quantity * item.price)}</Text>
                </HStack>
            )
        }
        return <Pressable style={{width: '31%'}} onPress={handleOpenDetail}>
            <HStack backgroundColor={'white'} shadow={1} p={2} borderRadius={6} my={2} mx={3}
                    alignItems={'center'} space={3}>
                <Box width={81} height={81} borderRadius={6} backgroundColor={'gray.200'}></Box>
                <VStack>
                    <Text fontSize={18} fontWeight={'bold'}>Đơn hàng số {order.id}</Text>
                    <Text fontSize={16} color={'green.500'}>{formatCurrency(order.amount)}</Text>
                    <Text color={'gray.400'}>{new Date(order.createdAt).toLocaleString()}</Text>
                </VStack>
                <Modal isOpen={open} onClose={() => setOpen(false)}>
                    <Modal.Content>
                        <Modal.CloseButton/>
                        <Modal.Header>
                            <Text fontWeight={'bold'}>Chi tiết đơn hàng</Text>
                        </Modal.Header>
                        <Modal.Body>
                            <VStack>
                                <Text fontWeight={'bold'}>Đơn hàng {order.id}</Text>
                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                    <Text fontWeight={'bold'}>Tổng thu : </Text>
                                    <Text color={'yellow.700'}>{formatCurrency(order.amount)}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                    <Text fontWeight={'bold'}>Lợi nhận : </Text>
                                    <Text color={'green.500'}>{formatCurrency(order.income)}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                    <Text fontWeight={'bold'}>Chi : </Text>
                                    <Text color={'orange.600'}>{formatCurrency(order.expense)}</Text>
                                </HStack>
                            </VStack>
                            <Divider/>
                            <FlatList data={details} renderItem={({item}) => <DetailItem item={item}/>}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setOpen(false);
                                }}>
                                    Đóng
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </HStack>
        </Pressable>
    }
    useLayoutEffect(() => {
        setLoadingMore(true)
        order.getAllOrder(page).then(async (res) => {
            await delaySync(1);
            setOrders(res);
            setLoadingMore(false);
        });
    }, []);
    const Header = () => {
        return (
            <HStack borderWidth={1} borderRadius={6} px={4} py={2} alignItems={'center'} space={3} width={'100%'}>
                <Ionicons name={'search'} size={20} color={'black'}/>
                <TextInput defaultValue={query} onChangeText={t => setQuery(t)} placeholder={'Tìm kiếm đon hàng'}
                           style={{width: '90%', backgroundColor: 'transparent'}}/>
            </HStack>
        )
    }
    const loadMore = async () => {
        if (loadingMore || isEnd) return;
        setLoadingMore(true)
        await delaySync(1);
        order.getAllOrder(page + 1).then((res) => {
            if (!res || res.length === 0) {
                setIsEnd(true);
                setLoadingMore(false);
                ToastAndroid.show("Đã hết", ToastAndroid.LONG);
                return;
            }
            setOrders((prevState) => [...prevState, ...res]);
            setPage(page + 1);
            setLoadingMore(false)
        }).catch((e) => {
            setLoadingMore(false);
        })
    }
    useLayoutEffect(() => {
        searchOrder(query).then();
    }, [query])
    const LoadingCpn = () => {
        return (
            <>
                {loadingMore && (
                    <Center>
                        <ActivityIndicator size={30} color={'black'}/>
                    </Center>
                )}
            </>

        )
    }
    const searchOrder = async (query) => {
        if (query === '') {
            setOrders(await order.getAllOrder(1));
            setPage(1);
            return;
        }
        const result = await order.searchOrder(query);
        console.log(result);
        setOrders(result);
    }
    return (
        <AppContainer>
            <VStack px={6} my={2}>
                <Header/>
                <FlatList ListFooterComponent={<LoadingCpn/>} onEndReached={loadMore} onEndReachedThreshold={0.1}
                          contentContainerStyle={{paddingVertical: 20}} numColumns={3} data={orders}
                          renderItem={({item}) => <OrderItem order={item}/>}/>
            </VStack>

        </AppContainer>
    )
}
export default observer(SellListOrder);