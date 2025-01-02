import {Box, Button, HStack, Pressable, ScrollView, Text, VStack} from "native-base";
import React, {memo, useLayoutEffect, useState} from "react";
import {FlatList} from "react-native";
import {stringGen} from "../../ultis/helper";

export const CategoryCreateModel = ({setOpenModel, categories, setCategory, selected = null, handleDeleteCategory}) => {
    const [selectedId, setSelectedId] = useState();

    const handleSelectCategory = (categoryId) => {
        setCategory(categoryId);
        setSelectedId(categoryId);
    }
    useLayoutEffect(() => {
        if (selected != null) setSelectedId(selected);
    }, []);
    const CategoryItem = memo(({item}) => {
        const active = selectedId == item.id;
        return (
            <Pressable onLongPress={() => handleDeleteCategory(item.id)} onPress={() => {
                handleSelectCategory(item.id)
            }}>
                <Box
                    backgroundColor={active ? 'green.500' : 'gray.100'}
                    borderWidth={1}
                    borderColor="gray.400"
                    borderRadius={4}
                    px={3}
                    py={2}
                >
                    <Text color={active ? 'white' : 'black'}>{item?.categoryName}</Text>
                </Box>
            </Pressable>
        )
    })
    const EmptyList = () => {
        return (
            <Text color="gray.500">Chưa có danh mục nào</Text>
        )
    }
    return (
        <Box bg="white" px={4} py={4} mt={3}>
            <Text fontSize="md" mb={3}>Danh mục</Text>
            <VStack space={4}>
                <Button
                    width={150}
                    size="sm"
                    colorScheme="blue"
                    onPress={() => setOpenModel(true)}
                >
                    + Thêm danh mục
                </Button>
                <FlatList contentContainerStyle={{gap: 10}} keyExtractor={() => stringGen(20)} data={categories}
                          renderItem={({item}) => <CategoryItem item={item}/>}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          ListEmptyComponent={<EmptyList/>}/>
            </VStack>
        </Box>
    )
}
