import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(utcPlugin);
dayjs.locale('ko');

const makePaddedNumber = (_number: number) => {
    return _number.toString().padStart(2, '0');
};

const makeReducedString = (_string: string) => {
    if (_string.length <= 11) return _string;
    const parts1 = _string.slice(0, 6);
    const parts2 = _string.slice(-4);
    const curString = parts1 + '...' + parts2;
    return curString;
};

const makeDateString = (_string: string) => {
    const dayjsTime = dayjs(new Date(_string));
    const kstTime = dayjsTime.utcOffset(-540);
    const formattedDateTime = kstTime?.format('YYYY-MM-DD HH:mm');
    return formattedDateTime;
};

/* #region clipboard */

const saveTextToClipboardFunction = (text: string): void => {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
};

const saveTextToClipboard = (_text: string): void => {
    if (_text) {
        saveTextToClipboardFunction(_text);
    }
};
const dateFormat = (rowDate: number) => {
    const date = new Date(rowDate * 1000);

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : 0 + month;
    day = day >= 10 ? day : 0 + day;
    hour = hour >= 10 ? hour : 0 + hour;
    minute = minute >= 10 ? minute : 0 + minute;
    second = second >= 10 ? second : 0 + second;

    return date.getFullYear() + '-' + month + '-' + day;
};

/* #endregion */

function roundNumber(num: number | string, decimalPlaces: number): number {
    if (typeof num == 'string') {
        num = parseInt(num);
    }
    return Number(Number(num).toFixed(decimalPlaces));
}

interface IDate {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
}
function getDate(_number: number): IDate {
    const curYear = Math.floor(_number / 31536000000);
    const curMonth = Math.floor(_number / 2592000000);
    const curDay = Math.floor(_number / 86400000);
    const curHour = Math.floor(_number / 3600000) % 24;
    const curMinute = Math.floor(_number / 60000) % 60;
    const curSecond = Math.floor(_number / 1000) % 60;

    return {
        year: curYear,
        month: curMonth,
        day: curDay,
        hour: curHour,
        minute: curMinute,
        second: curSecond,
    };
}

function getDateDifference(_date: Date): IDate {
    const difference = Date.now() - _date?.getTime();
    const curDate = getDate(difference);
    return curDate;
}

export {
    makePaddedNumber,
    makeReducedString,
    saveTextToClipboard,
    makeDateString,
    roundNumber,
    getDate,
    getDateDifference,
    dateFormat,
};
