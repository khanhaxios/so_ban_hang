import {useRef, useState} from "react";
import {Pressable, StyleSheet, TouchableOpacity, View} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {VStack} from "native-base";

export const Collapsible = (props) => {
    const Header = props.Header;
    return (
        <View style={styles.container}>
            <Pressable onPress={props?.handlePress} style={styles.header}>
                <Header/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        marginHorizontal: 12,
        width: '48%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f5f6f7',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#f5f6f7',
        padding: 12,
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        overflow: 'hidden',
    },
    hiddenContent: {
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
});