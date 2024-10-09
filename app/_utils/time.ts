import moment from "moment";
import "moment-timezone";

export const correctTime = (time: string | number): string => {
    return time.toString().length === 1 ? `0${time}` : String(time);
};

export const getRemainingTime = (deadline: string): string => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}д ${hours}ч`;
};

export const getDaysFromDate = (date: Date) => {
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
};

export const getDateAndMonth = (date: Date) => {
    const month = date.toLocaleString("ru-RU", { month: "long" });
    const day = String(date.getDate()).padStart(2, "0");

    return `${day} ${month}`;
};

export const getDateOrTime = (dateString: string) => {
    const date = moment.utc(dateString).local();

    const now = moment().local();

    const deltaHours = now.diff(date, "hours");

    if (deltaHours < 24) {
        return date.format("HH:mm");
    } else {
        return date.format("DD.MM.YY");
    }
};
