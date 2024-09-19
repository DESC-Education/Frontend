import axios from "axios";
import { $authHost, $host } from "..";
import { ICategory, ISolution, ITask } from "@/app/_types";
import { CreateTaskDTO } from "../types";

export const getTask = async (id: string) => {
    try {
        const { data } = await $authHost.get<ITask>(`/api/v1/tasks/task/${id}`);

        return {
            status: 200,
            task: data,
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
        const { data } = await $host.get<{
            count: string;
            results: ITask[];
            numPages: number;
        }>(
            `/api/v1/tasks/tasks?page=${page}&page_size=${limit}&category=${category}${filtersString}&ordering=${ordering}`,
        );

        return {
            status: 200,
            tasks: data.results,
            pageCount: data.numPages,
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

export const getMyTasks = async (
    dto: {
        page: number;
        limit: number;
        q: string;
        role: string;
        status: "active" | "archived";
    } = {
        page: 1,
        limit: 15,
        q: "",
        role: "company",
        status: "active",
    },
) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ITask[];
            numPages: number;
        }>(
            `/api/v1/tasks/my/${dto.role}?page=${dto.page}&page_size=${dto.limit}&search=${dto.q}&status=${dto.status}`,
        );

        return {
            status: 200,
            results: data.results,
            pageCount: data.numPages,
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
        }>("/api/v1/tasks/task", dto, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

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

const getPatterns = async (q: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ITask[];
        }>(`/api/v1/tasks/patterns`);

        return {
            status: 200,
            patterns: data.results,
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

export const createSolvingTask = async (dto: FormData) => {
    try {
        const { data } = await $authHost.post<{
            message: string;
        }>("/api/v1/tasks/solution", dto, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

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

export const getSolutions = async (
    task_id: string,
    ordering: "createdAt" | "-createdAt" = "createdAt",
    status: "completed" | "failed" | "pending" = "pending",
    page: number = 1,
    page_size: number = 10,
) => {
    console.log(task_id, ordering, status, page, page_size);
    
    try {
        const { data } = await $authHost.get<{
            results: ISolution[];
            numPages: number;
        }>(
            `/api/v1/tasks/solution-list/${task_id}?ordering=${ordering}&status=${status}&page=${page}&page_size=${page_size}`,
        );

        return {
            status: 200,
            solutions: data.results,
            pageCount: data.numPages,
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
