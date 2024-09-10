import axios from "axios";
import { $authHost } from "..";
import { ICategory, ITask } from "@/app/_types";
import { CreateTaskDTO } from "../types";

export const getTasks = async (
    page: number = 1,
    limit: number = 15,
    category: string = "",
    filters: string[] = [],
    ordering: "createdAt" | "-createdAt" | "relevance" = "createdAt",
) => {
    try {
        const filtersString =
            filters.length > 0 ? `&filters=${filters.join("&filters=")}` : "";
        const { data } = await $authHost.get<{
            count: string;
            results: ITask[];
        }>(
            `/api/v1/tasks/tasks?page=${page}&limit=${limit}&category=${category}${filtersString}&ordering=${ordering}`,
        );

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

export const getCategories = async (q: string = "") => {
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
