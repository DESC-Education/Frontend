export const correctTime = (time: string | number): string => {
    return time.toString().length === 1 ? `0${time}` : String(time);
};

export const getRemainingTime = (deadline: string): string => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h`;
};