export const correctTime = (time: string | number): string => {
    return time.toString().length === 1 ? `0${time}` : String(time);
};
