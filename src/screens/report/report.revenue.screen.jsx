import { Box, HStack, Text, VStack } from "native-base";
import { useState } from "react";

function ReportRevenueScreen() {
  const [selectedFilter, setSelectedFilter] = useState("overview");

  return (
    <VStack>
      <VStack>
        <HStack justifyContent="space-around">
          <VStack width={"35%"}>
            <VStack flexDirection={"row"} justifyContent={"space-around"}>
              <HStack
                flexDirection="row"
                justifyContent="space-around"
                bg="#ecf0f6"
                py={1}
                my={2}
                borderRadius={6}
              >
                <Box
                  py={2}
                  px={4}
                  borderRadius={5}
                  bg={selectedFilter === "overview" ? "white" : "transparent"}
                  onPress={() => setSelectedFilter("overview")}
                >
                  <Text
                    fontSize="xs"
                    color={selectedFilter === "overview" ? "#17683d" : "#666"}
                    fontWeight={selectedFilter === "overview" ? "bold" : "normal"}
                  >
                    Tổng quan
                  </Text>
                </Box>

                <Box
                  py={2}
                  px={4}
                  borderRadius={5}
                  bg={selectedFilter === "analysis" ? "white" : "transparent"}
                  onPress={() => setSelectedFilter("analysis")}
                >
                  <Text
                    fontSize="xs"
                    color={selectedFilter === "analysis" ? "#17683d" : "#666"}
                    fontWeight={selectedFilter === "analysis" ? "bold" : "normal"}
                  >
                    Phân tích
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
}

export default ReportRevenueScreen;
