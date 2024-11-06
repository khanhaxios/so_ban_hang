import { HStack, Text, VStack } from "native-base";
import { useState } from "react";
import { Pressable, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TimeFilter from "./filter.cpn";

function FilterSection({ setFilteredData, data }) {
  const [selectedFilter, setSelectedFilter] = useState("this_month");
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Hiển thị TimeFilter
  const filterDataByTime = (filterOption, startDate, endDate) => {
    let filtered = data; // Dữ liệu ban đầu

    switch (filterOption) {
      case "today":
        const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay với định dạng YYYY-MM-DD
        filtered = data.filter((item) => {
          const itemDate = item.date.split("/").reverse().join("-"); // Chuyển item.date từ DD/MM/YYYY sang YYYY-MM-DD
          return itemDate === today; // So sánh theo định dạng YYYY-MM-DD
        });
        break;
      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        filtered = data.filter((item) => {
          const itemDate = item.date.split("/").reverse().join("-");
          return itemDate === yesterdayStr;
        });
        break;
      case "this_month":
        const thisMonth = new Date().getMonth();
        filtered = data.filter(
          (item) =>
            new Date(item.date.split("/").reverse().join("-")).getMonth() ===
            thisMonth
        );
        break;
      case "last_month":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = data.filter(
          (item) =>
            new Date(item.date.split("/").reverse().join("-")).getMonth() ===
            lastMonth.getMonth()
        );
        break;
      case "last_30_days":
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        filtered = data.filter((item) => {
          const itemDate = new Date(item.date.split("/").reverse().join("-"));
          return itemDate >= thirtyDaysAgo && itemDate <= now;
        });
        break;
      case "this_year":
        const thisYear = new Date().getFullYear();
        filtered = data.filter(
          (item) =>
            new Date(item.date.split("/").reverse().join("-")).getFullYear() ===
            thisYear
        );
        break;
      case "all":
        filtered = data;
        break;
      default:
        filtered = data.filter((item) => {
          const itemDate = new Date(item.date.split("/").reverse().join("-"));
          return (
            itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
          );
        });
        break;
    }

    return filtered;
  };

  const handleFilterPress = (filterOption) => {
    setSelectedFilter(filterOption); // Cập nhật bộ lọc đã chọn
    const filtered = filterDataByTime(filterOption); // Lọc dữ liệu dựa trên bộ lọc
    setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
  };

  // Hàm này sẽ nhận kết quả lọc từ TimeFilter và cập nhật dữ liệu
  const handleApplyFilter = (filterOption, startDate, endDate) => {
    setIsFilterVisible(false); // Ẩn bộ lọc sau khi áp dụng
    const filtered = filterDataByTime(filterOption, startDate, endDate); // Lọc dữ liệu dựa vào các tuỳ chọn
    setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
  };

  return (
    <>
      <VStack flexDirection={"row"} justifyContent={"space-around"}>
        <HStack
          space={2}
          alignItems={"center"}
          justifyContent={"center"}
          px={3}
        >
          <Pressable onPress={() => setIsFilterVisible(true)}>
            <Ionicons name={"calendar-outline"} color={"black"} size={24} />
          </Pressable>
        </HStack>
        <VStack style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "today" && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterPress("today")}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === "today" && styles.activeFilterButtonText,
              ]}
            >
              Hôm nay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "this_month" && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterPress("this_month")}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === "this_month" &&
                  styles.activeFilterButtonText,
              ]}
            >
              Tháng này
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "last_month" && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterPress("last_month")}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === "last_month" &&
                  styles.activeFilterButtonText,
              ]}
            >
              Tháng trước
            </Text>
          </TouchableOpacity>
        </VStack>
      </VStack>
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <VStack style={styles.modalContainer}>
          <TimeFilter
            onApply={handleApplyFilter}
            onClose={() => setIsFilterVisible(false)}
          />
        </VStack>
      </Modal>
    </>
  );
}

export default FilterSection;

const styles = StyleSheet.create({
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ecf0f6",
    paddingVertical: 5,
    marginVertical: 10,
    borderRadius: 6,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#666",
    fontSize: 12,
  },
  activeFilterButton: {
    backgroundColor: "#E5F3FF",
  },
  activeFilterButtonText: {
    color: "#2D9CDB",
    fontWeight: "bold",
  },
});
