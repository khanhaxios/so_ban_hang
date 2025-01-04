import {StyleSheet} from "react-native";
import {SH, SW} from "../../ultis/helper";
import Animated from "react-native-reanimated";

export const BottomSheet = (props) => {
    return (
        <Animated.View style={[styles.container, props.cStyle]}>
            {props.children}
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '40%',
        position: 'absolute',
        top: 0,
        zIndex: 10,
        height: SW,
        backgroundColor: 'white'
    }
})