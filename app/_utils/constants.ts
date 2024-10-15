import { SSENotificationTypes } from "../_http/types";
import { ISolutionStatus, ISpecialtyType } from "../_types";

export const TIMER_TIME = 60;

export const MAX_LENGTH = 2000;
export const MIN_LENGTH = 15;
export const MAX_REPLY_COUNT = 30;

export const yearsOfEducation = {
    bachelor: 4,
    specialty: 5,
    magistracy: 2,
};

interface ITimezone {
    readonly label: string;
    readonly value: number;
}

export const timezones: ITimezone[] = [
    {
        label: "Калининград, UTC+2",
        value: 2,
    },
    {
        label: "Москва, UTC+3",
        value: 3,
    },
    {
        label: "Самара UTC+4",
        value: 4,
    },
    {
        label: "Екатеринбург, UTC+5",
        value: 5,
    },
    { label: "Омск, UTC+6", value: 6 },
    {
        label: "Красноярск, UTC+7",
        value: 7,
    },
    {
        label: "Иркутск, UTC+8",
        value: 8,
    },
    { label: "Чита, UTC+9", value: 9 },
    {
        label: "Хабаровск, UTC+10",
        value: 10,
    },
];

export const formsOfEducation = [
    { label: "Очное", value: "full_time" },
    { label: "Заочное", value: "part_time" },
    { label: "Очно-заочное", value: "full_part_time" },
];

export const typeOfSpeciality: { name: string; value: ISpecialtyType }[] = [
    { name: "Бакалавриат", value: "bachelor" },
    { name: "Специалитет", value: "specialty" },
    { name: "Магистратура", value: "magistracy" },
];

export const levels = [
    { name: "Начинающий", value: 0 },
    { name: "Средний", value: 1 },
    { name: "Продвинутый", value: 2 },
];

export const sortingOptions = [
    { name: "Сначала новые", value: "-createdAt" },
    { name: "Сначала старые", value: "createdAt" },
    // { name: "Сначала рекомендуемые", value: "relevant" },
];

export const solutionStatuses: {
    name: string;
    value: ISolutionStatus;
    color: string;
    textColor: string;
}[] = [
    {
        name: "На оценке",
        value: "pending",
        color: "#FDF5A9",
        textColor: "black",
    },
    {
        name: "Выполнено",
        value: "completed",
        color: "#D0F5CD",
        textColor: "black",
    },
    {
        name: "Не выполнено",
        value: "failed",
        color: "#DD6565",
        textColor: "white",
    },
];

// export const getMotificationRoute = (
//     type: SSENotificationTypes,
//     payload: { solutionId: string; taskId: string },
// ) => {
//     switch (type) {
//         case "evaluation":
//             return `/tasks/${payload.taskId}/solutions/${payload.solutionId}`;
//         case "review":
//             return `/tasks/${payload.taskId}/solutions/${payload.solutionId}`;
//         case "solution":
//             return `/tasks/${payload.taskId}/solutions/${payload.solutionId}`;
//     }
// };

// export const notificationTitles = {
//     verification: "Результат верификации",
//     evaluation: "Оценка решения",
//     level: "Изменение уровеня аккаунта",
//     review: "Рецензия на решение",
//     countReset: "Пополнение количества откликов",
//     solution: "Новое решение задания",
// }
