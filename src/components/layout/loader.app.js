import {StyleSheet, View, Image, ActivityIndicator} from "react-native";
import loader from '../../res/img.png'

export const LoaderApp = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.loader} source={loader}/>
            <ActivityIndicator size={40} color={'black'}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        width: '50%',
        resizeMode: 'contain',
        marginBottom: 30,
        height: '50%'
    }
})