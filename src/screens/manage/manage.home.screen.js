import React from 'react';
import { observer } from 'mobx-react';
import { AppContainer } from '../../components/layout/container.cpn';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { VStack } from 'native-base';
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

        <View style={{ flex: 1, backgroundColor: '#f3f3f3', paddingHorizontal: 10 }}>
          {/* Warning Section */}
          <View>
            <View style={{ padding: 16, backgroundColor: '#ffecb3', marginTop: 8 }}>
              <Text style={{ color: '#bf360c', fontSize: 14, marginBottom: 8 }}>
                Đã hết lượt tạo đơn miễn phí tháng này, nâng cấp để sử dụng thêm!
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, width: '45%', textAlign: 'center' }}>
                  <Text style={{ color: '#ff7043', textAlign: 'center', fontWeight: 'bold' }}>Liên hệ tư vấn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#42a5f5', padding: 10, borderRadius: 5, width: '45%' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Nâng cấp ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Main Menu */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', paddingVertical: 16, gap: 15 }}>
            <View style={{ alignItems: 'center', backgroundColor: 'white', width: '30%', padding: 16, borderRadius: 6 }}>
              <Image source={require('../../../assets/shop.png')} style={{ width: 45, height: 45 }} />
              <Text style={{ color: '#555', fontSize: 14, marginTop: 4 }}>Bán hàng</Text>
            </View>
            <View style={{ alignItems: 'center', backgroundColor: 'white', width: '30%', padding: 16, borderRadius: 6 }}>
              <Image source={require('../../../assets/box.png')} style={{ width: 50, height: 50 }} />
              <Text style={{ color: '#555', fontSize: 14, marginTop: 4 }}>Sản phẩm</Text>
            </View>
            <View style={{ alignItems: 'center', backgroundColor: 'white', width: '30%', padding: 16, borderRadius: 6 }}>
              <Image source={require('../../../assets/user.png')} style={{ width: 50, height: 50 }} />
              <Text style={{ color: '#555', fontSize: 14, marginTop: 4 }}>Khách hàng</Text>
            </View>
          </View>

          {/* Advertisement Section */}
          <View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Bán hàng có Bí kíp</Text>
            </View>

            <ScrollView horizontal style={{ marginTop: 16 }} showsHorizontalScrollIndicator={false}>
              <Image
                source={{ uri: 'https://sobanhang.com/wp-content/uploads/2024/01/Screenshot-2024-01-29-at-16.32.31.png' }}
                style={{ width: 300, height: 150, borderRadius: 8, marginRight: 6 }}
              />
              <Image
                source={{ uri: 'https://i.ytimg.com/vi/cOxsINR6lVM/maxresdefault.jpg' }}
                style={{ width: 300, height: 150, borderRadius: 8, marginRight: 6 }}
              />
              <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwOGKrWR0T3-TGogK7XCD_YLVt6rmr2GgXlqf3C02Hr4lT-tuQz1WGwEtlGpRQEvSVyDs&usqp=CAU' }}
                style={{ width: 300, height: 150, borderRadius: 8, marginRight: 6 }}
              />
            </ScrollView>
          </View>
        </View>
      </VStack>
    </AppContainer>
  );
};

export default observer(ManageHomeScreen);
