import React from 'react';
import { observer } from 'mobx-react';
import { AppContainer } from '../../components/layout/container.cpn';
import { Box, Text, Pressable, ScrollView, Image, VStack, HStack } from 'native-base'; // Native-base components
import { HomeHeaderCpn } from '../../components/manage/home.header.cpn';
import { HomeHeaderOverlayCpn } from '../../components/manage/home.header.overlay.cpn';
import { TodayReportCpn } from '../../components/manage/today.report.cpn';

const ManageHomeScreen = ({ route, navigation }) => {
  const handlerOpenSearch = () => {
    // Implement search logic here
  };

  const handleOpenShopInfo = () => {
    // Implement shop info logic here
  };

  const handleOpenMenuBar = () => {
    // Implement menu bar logic here
  };

  return (
    <AppContainer>
      <VStack flex={1} backgroundColor="#f3f3f3">
        <HomeHeaderOverlayCpn />
        <HomeHeaderCpn />
        <TodayReportCpn />

        <Box flex={1} backgroundColor="#f3f3f3" px={2}>
          {/* Warning Section */}
          <Box mt={2}>
            <Box p={4} backgroundColor="#ffecb3" mt={2} borderRadius="md">
              <Text color="#bf360c" fontSize="sm" mb={2}>
                Đã hết lượt tạo đơn miễn phí tháng này, nâng cấp để sử dụng thêm!
              </Text>
              <HStack justifyContent="space-between">
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
          <HStack flexWrap="wrap" py={4} space={4}>
            <Box alignItems="center" backgroundColor="white" width="30%" p={4} borderRadius="md">
              <Image source={require('../../../assets/shop.png')} alt="shop icon" size="lg" />
              <Text color="#555" fontSize="sm" mt={1}>
                Bán hàng
              </Text>
            </Box>
            <Box alignItems="center" backgroundColor="white" width="30%" p={4} borderRadius="md">
              <Image source={require('../../../assets/box.png')} alt="box icon" size="lg" />
              <Text color="#555" fontSize="sm" mt={1}>
                Sản phẩm
              </Text>
            </Box>
            <Box alignItems="center" backgroundColor="white" width="30%" p={4} borderRadius="md">
              <Image source={require('../../../assets/user.png')} alt="user icon" size="lg" />
              <Text color="#555" fontSize="sm" mt={1}>
                Khách hàng
              </Text>
            </Box>
          </HStack>

          {/* Advertisement Section */}
          <Box>
            <Text fontSize="md" fontWeight="bold">
              Bán hàng có Bí kíp
            </Text>

            <ScrollView horizontal mt={4} showsHorizontalScrollIndicator={false}>
              <Image
                source={{ uri: 'https://sobanhang.com/wp-content/uploads/2024/01/Screenshot-2024-01-29-at-16.32.31.png' }}
                alt="ad 1"
                width={300}
                height={150}
                borderRadius="md"
                mr={2}
              />
              <Image
                source={{ uri: 'https://i.ytimg.com/vi/cOxsINR6lVM/maxresdefault.jpg' }}
                alt="ad 2"
                width={300}
                height={150}
                borderRadius="md"
                mr={2}
              />
              <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwOGKrWR0T3-TGogK7XCD_YLVt6rmr2GgXlqf3C02Hr4lT-tuQz1WGwEtlGpRQEvSVyDs&usqp=CAU' }}
                alt="ad 3"
                width={300}
                height={150}
                borderRadius="md"
              />
            </ScrollView>
          </Box>
        </Box>
      </VStack>
    </AppContainer>
  );
};

export default observer(ManageHomeScreen);
