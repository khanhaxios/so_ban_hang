import {Box, Input, Text} from "native-base";
import React from "react";

export const ProductCreateFormInput = ({
                                           isAttempted,
                                           name,
                                           validValue,
                                           value,
                                           handleSetChange,
                                           placeholder,
                                           label,
                                           required,
                                           keyType,
                                           formatter
                                       }) => {
        return (
        <Box bg="white" px={4} py={4} mt={3}>
            <Text fontSize="md">{label} {required ? '*' : ''}</Text>
            {formatter && (
                <Text fontSize={'xs'}>{formatter(value)}</Text>
            )}
            <Input
                keyboardType={keyType || 'default'}
                placeholder={placeholder}
                mt={2}
                defaultValue={value}
                onChangeText={(text) => {
                    handleSetChange(name, text)
                }}
                borderColor={
                    isAttempted && !validValue
                        ? "red.500"
                        : "gray.400"
                }
            />
            {isAttempted && !validValue && (
                <Text color="red.500" mt={1}>
                    Thông tin bắt buộc
                </Text>
            )}
        </Box>
    )
}