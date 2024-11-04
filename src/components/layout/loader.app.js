import {StyleSheet, View, Image, ActivityIndicator} from "react-native";
import {SH, SW} from "../../ultis/helper";
import loader from '../../res/img.png'

export const LoaderApp = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.loader} source={loader}/>
            <ActivityIndicator size={30} color={'black'}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: SW,
        height: SH,
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        width: '50%',
        height: '50%'
    }
})