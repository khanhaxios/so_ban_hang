import {useRef, useState} from "react";
import {Animated, StyleSheet, TouchableOpacity, View} from "react-native";

export const Collapsible = ({Header, children}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const animationHeight = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(0);

    const toggleExpand = () => {
        if (isExpanded) {
            // Collapse
            Animated.timing(animationHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsExpanded(false));
        } else {
            // Expand
            setIsExpanded(true);
            Animated.timing(animationHeight, {
                toValue: contentHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity onPress={toggleExpand} style={styles.header}>
                <Header/>
            </TouchableOpacity>

            {/* Content */}
            <Animated.View style={[styles.contentContainer, {height: animationHeight}]}>
                <View
                    style={styles.hiddenContent}
                    onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
                >
                    {children}
                </View>
            </Animated.View>
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
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#007BFF',
        padding: 15,
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