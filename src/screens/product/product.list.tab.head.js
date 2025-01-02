import {HStack} from "native-base";
import React, {useState} from "react";
import {TAB_LIST, TabListItem} from "./index.product.screen";

export const ProductListTabHead = ({activeTab, setActiveTab}) => {
    return (
        <HStack
            px={5}
            pt={5}
            pb={2}
            justifyContent={'flex-start'} space={6} alignItems={'center'}>
            {Object.values(TAB_LIST).map((item, index) => (
                <TabListItem item={item} activeTab={activeTab} setActiveTab={() => {
                }} key={index.toString()}/>
            ))}
        </HStack>
    )
}