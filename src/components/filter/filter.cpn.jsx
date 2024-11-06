import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Pressable,
  Input,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";

const { height } = Dimensions.get("window");

const TimeFilter = ({ onApply, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("today");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const timeOptions = [
    { label: "Hôm nay", value: "today" },
    { label: "Hôm qua", value: "yesterday" },
    { label: "Tháng này", value: "this_month" },
    { label: "Tháng trước", value: "last_month" },
    { label: "30 ngày", value: "last_30_days" },
    { label: "Năm nay", value: "this_year" },
    { label: "Tất cả", value: "all" },
  ];

  const handleApply = () => {
    onApply(selectedOption, startDate, endDate);
  };

  const handleReset = () => {
    setSelectedOption("today");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <View
      style={{
        justifyContent: "flex-end",
        height: height,
        backgroundColor: "#bab8b891",
      }}
    >
      <Box
        bg="white"
        borderRadius="md"
        p={5}
        width="100%"
        shadow={2}
        position="absolute" // Đặt vị trí tuyệt đối bên trong container
        bottom={0} // Đảm bảo vị trí từ dưới lên
        left={0} // Căn lề trái
        borderTopRadius={20} // Bo góc phần trên
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" bold>
            Bộ lọc
          </Text>
          <Button variant="unstyled" onPress={onClose}>
            ✖
          </Button>
        </HStack>

        {/* Time Options */}
        <VStack space={3} mt={4}>
          <Text fontSize="md">Thời gian</Text>
          <HStack flexWrap="wrap" justifyContent="space-between">
            {timeOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setSelectedOption(option.value)}
                px={4}
                py={2}
                bg={selectedOption === option.value ? "#d2e5ff" : "#f0f0f0"}
                borderRadius="md"
                mb={2}
                width="45%"
              >
                <Text
                  textAlign="center"
                  color={selectedOption === option.value ? "#007bff" : "#333"}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </VStack>

        {/* Custom Time */}
        <VStack space={3} mt={4}>
          <Text fontSize="md">Hoặc tùy chỉnh thời gian</Text>
          <HStack space={2} alignItems="center" width="100%">
            <Text>Từ</Text>
            <Pressable
              onPress={() => setShowStartDatePicker(true)}
              style={{ width: "40%" }}
            >
              <Input
                value={startDate.toISOString().split("T")[0]} // Format as YYYY-MM-DD
                isReadOnly
                variant="outline"
                p={2}
              />
            </Pressable>
            <Text>Đến</Text>
            <Pressable
              onPress={() => setShowEndDatePicker(true)}
              style={{ width: "40%" }}
            >
              <Input
                value={endDate.toISOString().split("T")[0]} // Format as YYYY-MM-DD
                isReadOnly
                variant="outline"
                p={2}
              />
            </Pressable>
          </HStack>
        </VStack>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}

        <HStack justifyContent="space-between" mt={6} space={3}>
          <Button variant="outline" onPress={handleReset} px={4} w={"50%"}>
            Thiết lập lại
          </Button>
          <Button
            onPress={handleApply}
            px={4}
            bg="#007bff"
            colorScheme="blue"
            w={"50%"}
          >
            Áp dụng
          </Button>
        </HStack>
      </Box>
    </View>
  );
};

export default TimeFilter;
