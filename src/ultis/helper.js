import {Dimensions} from "react-native";
import * as FileSystem from 'expo-file-system';

export const {width: SW, height: SH} = Dimensions.get("window");
export const convertNumberToCurrency = (number) => {
    const isNegative = number < 0;
    const absNumber = Math.abs(number); // Work with the absolute value

    const units = [
        {value: 1_000_000_000, suffix: 'B',}, // Billion
        {value: 1_000_000, suffix: 'M'},     // Million
        {value: 1_000, suffix: 'K'}          // Thousand
    ];

    const unit = units.find(({value}) => absNumber >= value) || {value: 1, suffix: ''};
    const convertedValue = absNumber / unit.value;

    return {val: `${isNegative ? '-' : ''}${convertedValue.toFixed(2)} ${unit.suffix}`.trim(), isIncome: !isNegative};
};

export function getDayOfWeek(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[date.getDay()];
}

export function formatDateByMonth(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const month = date.getMonth() + 1; // getMonth() is zero-based, so add 1
    const day = date.getDate();

    return `tháng ${month}/${day}`;
}

export function getRandomSubset(array, subsetSize) {
    if (subsetSize > array.length) {
        return [];
    }

    const shuffled = [...array]; // Clone the array to avoid modifying the original
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    // Return the first `subsetSize` elements from the shuffled array
    return shuffled.slice(0, subsetSize);
}

export const formatCurrency = (amount) => {
    // tach number ra khoi string
    if (isNaN(amount)) {
        amount = splitFormattedCurrency(amount);
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
export const copyImage = async (imageUploaded) => {
    try {
        const fileName = imageUploaded.uri.split('/').pop();
        const destinationPath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.copyAsync({
            from: imageUploaded.uri,
            to: destinationPath,
        });
        return destinationPath;
    } catch (e) {
        console.log(e)
    }
    return null;
}
const splitFormattedCurrency = (formattedCurrency) => {
    const match = formattedCurrency?.match(/([\d.,]+)\s?(\D+)/);
    if (match) {
        return match[2];
    }
    return 0;
};
export const splitQuantity = (input) => {
    const match = input.match(/^(\d+)\s*(.*)$/);

    if (match) {
        const numberPart = parseInt(match[1], 10);
        const textPart = match[2];
        return {numberPart, textPart}
    }
}
export const delaySync = async (s) => {
    return await new Promise((res) => setTimeout(res, s * 1000));
}
export const stringGen = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
export const getFirstLargerThanOne = (numbers) => {
    return numbers.find(({coin}) => coin >= 1) || numbers[numbers.length - 1];
};
