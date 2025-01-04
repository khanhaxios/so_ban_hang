import {Button, Text} from "native-base";
import React from "react";

export const CategoryItem = ({item, setCategory, selectedCategory}) => {
    return (
        <Button
            my={1}
            onPress={() => setCategory(item?.id)}
            backgroundColor={selectedCategory === item?.id ? "#04c454" : "white"}
            _hover={{
                bg: "white",
                borderColor: "#075ae0",
            }}>
            <Text color={selectedCategory === item?.id ? "white" : "grey"}>
                {item?.categoryName}
            </Text>
        </Button>
    )
}