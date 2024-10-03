import { ISolutionStatus, ISpecialtyType } from "../_types";

export const TIMER_TIME = 60;

export const yearsOfEducation = {
    bachelor: 4,
    specialty: 5,
    magistracy: 2,
};

export const timezones = [
    {
        name: "Калининград, UTC+2",
        value: 2,
    },
    {
        name: "Москва, UTC+3",
        value: 3,
    },
    {
        name: "Самара UTC+4",
        value: 4,
    },
    {
        name: "Екатеринбург, UTC+5",
        value: 5,
    },
    { name: "Омск, UTC+6", value: 6 },
    {
        name: "Красноярск, UTC+7",
        value: 7,
    },
    {
        name: "Иркутск, UTC+8",
        value: 8,
    },
    { name: "Чита, UTC+9", value: 9 },
    {
        name: "Хабаровск, UTC+10",
        value: 10,
    },
];

export const formsOfEducation = [
    { name: "", value: "" },
    { name: "Очное", value: "part_time" },
    { name: "Очно-заочное", value: "full_time" },
    { name: "Заочное", value: "part_full_time" },
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
    { name: "Сначала новые", value: "createdAt" },
    { name: "Сначала старые", value: "-createdAt" },
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
