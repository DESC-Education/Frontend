import axios from "axios";
import { $authHost } from "..";
import { ICategory, ITask } from "@/app/_types";
import { CreateTaskDTO } from "../types";

export const getTasks = async (
    q: string = "",
    page: number = 1,
    limit: number = 15,
) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ITask[];
        }>(`/api/v1/tasks/tasks?page=${page}&limit=${limit}&search=${q}`);

        return {
            status: 200,
            tasks: data.results,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data.message,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};

export const createTask = async (dto: FormData) => {
    try {
        const { data } = await $authHost.post<{
            message: string;
        }>("/api/v1/tasks/task", dto);

        return { status: 200, message: data.message };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data.message,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};

export const getCategory = async (q: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ICategory[];
        }>(`/api/v1/tasks/task/categories`);

        return {
            status: 200,
            categories: data.results,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data.message,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};
