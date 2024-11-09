import React from 'react'
import { observer } from 'mobx-react'
import { useWindowDimensions } from 'react-native'
import { AppContainer } from '../../components/layout/container.cpn'
import {
  Box,
  Text,
  Pressable,
  ScrollView,
  Image,
  VStack,
  HStack,
} from 'native-base'
import { HomeHeaderCpn } from '../../components/manage/home.header.cpn'
import { HomeHeaderOverlayCpn } from '../../components/manage/home.header.overlay.cpn'
import { TodayReportCpn } from '../../components/manage/today.report.cpn'

const ManageHomeScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions()

  const isPhonePortrait = width <= 480
  const isTabletPortrait = width > 480 && width <= 768
  const isTabletLandscape = width > 768

  const handlerOpenSearch = () => {
    // Implement search logic here
  }

  const handleOpenShopInfo = () => {
    // Implement shop info logic here
  }

  const handleOpenMenuBar = () => {
    // Implement menu bar logic here
  }

  return (
    <AppContainer>
      <VStack flex={1} backgroundColor="#f3f3f3">
        <HomeHeaderOverlayCpn />

        <HomeHeaderCpn />

        <ScrollView flex={1}>
          <TodayReportCpn />
          <Box flex={1} backgroundColor="#f3f3f3" px={2}>
            {/* Warning Section */}
            <Box mt={2}>
              <Box p={8} backgroundColor="#ffecb3" mt={2} borderRadius="md">
                <Text color="#bf360c" fontSize="md" textAlign={'center'} mb={4}>
                  Đã hết lượt tạo đơn miễn phí tháng này, nâng cấp để sử dụng
                  thêm!
                </Text>
                <HStack justifyContent="space-around">
                  <Pressable
                    bg="white"
                    p={3}
                    borderRadius="md"
                    width="45%"
                    alignItems="center"
                    onPress={() => {}}
                  >
                    <Text color="#ff7043" fontWeight="bold">
                      Liên hệ tư vấn
                    </Text>
                  </Pressable>
                  <Pressable
                    bg="#42a5f5"
                    p={3}
                    borderRadius="md"
                    width="45%"
                    alignItems="center"
                    onPress={() => {}}
                  >
                    <Text color="white" fontWeight="bold">
                      Nâng cấp ngay
                    </Text>
                  </Pressable>
                </HStack>
              </Box>
            </Box>

            {/* Main Menu */}
            <HStack
              flexWrap="wrap"
              py={4}
              space={2.5}
              justifyContent={
                isTabletLandscape ? 'space-around' : 'space-between'
              }
            >
              <Box
                alignItems="center"
                backgroundColor="white"
                width={isTabletLandscape ? '19%' : '30%'}
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

              <Box
                alignItems="center"
                backgroundColor="white"
                width={isTabletLandscape ? '19%' : '30%'}
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
              <Box
                alignItems="center"
                backgroundColor="white"
                width={isTabletLandscape ? '19%' : '30%'}
                p={4}
                borderRadius="md"
              >
                <Image
                  source={require('../../../assets/user.png')}
                  alt="user icon"
                  size="sm"
                />
                <Text color="#555" fontSize="sm" mt={1}>
                  Khách hàng
                </Text>
              </Box>
              <Box
                alignItems="center"
                backgroundColor="white"
                width={isTabletLandscape ? '19%' : '30%'}
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
              <Box
                alignItems="center"
                backgroundColor="white"
                width={isTabletLandscape ? '19%' : '30%'}
                p={4}
                borderRadius="md"
              >
                <Image
                  source={require('../../../assets/kho.png')}
                  alt="kho icon"
                  size="sm"
                />
                <Text color="#555" fontSize="sm" mt={1}>
                  Tồn kho
                </Text>
              
              </Box>
            </HStack>
            {/* Advertisement Section */}
            <Box mt={4}>
              <Text fontSize="md" fontWeight="bold">
                Bán hàng có Bí kíp
              </Text>
              <ScrollView
                horizontal
                mt={4}
                showsHorizontalScrollIndicator={false}
                space={2}
              >
                {[
                  'https://sobanhang.com/wp-content/uploads/2024/01/Screenshot-2024-01-29-at-16.32.31.png',
                  'https://i.ytimg.com/vi/cOxsINR6lVM/maxresdefault.jpg',
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwOGKrWR0T3-TGogK7XCD_YLVt6rmr2GgXlqf3C02Hr4lT-tuQz1WGwEtlGpRQEvSVyDs&usqp=CAU',
                ]
                  .slice(0, isTabletLandscape ? 3 : 1)
                  .map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri }}
                      alt={`ad ${index + 1}`}
                      width={isTabletLandscape ? 400 : 300}
                      height={isTabletLandscape ? 200 : 150}
                      borderRadius="md"
                      mr={2}
                    />
                  ))}
              </ScrollView>
            </Box>
          </Box>
        </ScrollView>
      </VStack>
    </AppContainer>
  )
}

export default observer(ManageHomeScreen)
