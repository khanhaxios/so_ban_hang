import {HStack, Text, VStack} from "native-base";
import {Pressable, StyleSheet, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

function FilterSection({setActiveTab, activeTab, setShowDate, isShowPickDate = true}) {
    const handleFilterPress = (filterOption) => {
        setActiveTab(filterOption);
    };
    return (
        <>
            <VStack flexDirection={"row"} justifyContent={"space-around"}>
                {isShowPickDate && (
                    <HStack
                        space={2}
                        alignItems={"center"}
                        justifyContent={"center"}
                        px={3}
                    >
                        <Pressable onPress={() => setShowDate(true)}>
                            <Ionicons name={"calendar-outline"} color={"black"} size={24}/>
                        </Pressable>
                    </HStack>
                )}
                <VStack style={styles.filterButtons} px={2}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeTab === "today" && styles.activeFilterButton,
                        ]}
                        onPress={() => handleFilterPress("today")}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeTab === "today" && styles.activeFilterButtonText,
                            ]}
                        >
                            Hôm nay
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeTab === "monthly" && styles.activeFilterButton,
                        ]}
                        onPress={() => handleFilterPress("monthly")}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeTab === "monthly" &&
                                styles.activeFilterButtonText,
                            ]}
                        >
                            Tháng này
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeTab === "prevMonthly" && styles.activeFilterButton,
                        ]}
                        onPress={() => handleFilterPress("prevMonthly")}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeTab === "prevMonthly" &&
                                styles.activeFilterButtonText,
                            ]}
                        >
                            Tháng trước
                        </Text>
                    </TouchableOpacity>
                </VStack>
            </VStack>
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
        backgroundColor: "white",
    },
    activeFilterButtonText: {
        color: "#17683d",
        fontWeight: "bold",
    },
});
