import {Dimensions} from "react-native";
import * as SQLite from 'expo-sqlite';
export const {width: SW, height: SH} = Dimensions.get("window");
export const convertNumberToCurrency = (number) => {
    const numberOfK = number / 1000;
    // 1200
    const numberOfM = number / 1000000;
    const numberOfT = number / 1000000000;
    const arr = [
        {coin: numberOfT, suffix: 'B'},
        {coin: numberOfM, suffix: 'M'},
        {coin: numberOfK, suffix: 'K'}
    ];
    const sortS = getFirstLargerThanOne(arr);
    return `${sortS?.coin.toFixed(2)} ${sortS?.suffix}`;
}

export const getFirstLargerThanOne = (numbers) => {
    let rs = numbers[numbers.length - 1];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i]?.coin >= 1) {
            rs = numbers[i];
            break
        }
    }
    return rs;
}
