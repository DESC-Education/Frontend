import axios from "axios";
import { $authHost, $host } from "..";
import {
    ICategory,
    IReview,
    ISolution,
    ISolutionStatus,
    ITask,
} from "@/app/_types";
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
    ordering: "createdAt" | "-createdAt" | "relevance" = "-createdAt",
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
        const { data } = await $authHost.post<ITask>(
            "/api/v1/tasks/task",
            dto,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return { status: 200, message: "Задание успешно создано!", task: data };
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
        const { data } = await $authHost.post<ISolution>(
            "/api/v1/tasks/solution",
            dto,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return { status: 200, solution: data };
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
    dto: {
        task_id: string;
        ordering: "createdAt" | "-createdAt";
        status: "completed" | "failed" | "pending";
        page: number;
        page_size: number;
    } = {
        ordering: "-createdAt",
        page: 1,
        page_size: 10,
        status: "pending",
        task_id: "",
    },
) => {
    try {
        const { data } = await $authHost.get<{
            results: ISolution[];
            numPages: number;
        }>(
            `/api/v1/tasks/solution-list/${dto.task_id}?ordering=${dto.ordering}&status=${dto.status}&page=${dto.page}&page_size=${dto.page_size}`,
        );

        return {
            status: 200,
            results: data.results,
            numPages: data.numPages,
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

export const getSolution = async (id: string) => {
    try {
        const { data } = await $authHost.get<ISolution>(
            `/api/v1/tasks/solution/${id}`,
        );

        return {
            status: 200,
            solution: data,
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

export const evaluateTaskSolution = async (dto: {
    id: string;
    status: ISolutionStatus;
    companyComment: string;
}) => {
    try {
        const { data } = await $authHost.post<{ status: ISolutionStatus }>(
            `/api/v1/tasks/task/evaluate/${dto.id}`,
            {
                status: dto.status,
                companyComment: dto.companyComment,
            },
        );

        return { status: 200, solutionStatus: data.status };
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

export const createReview = async (dto: {
    text: string;
    rating: number;
    solution: string;
}) => {
    try {
        const { data } = await $authHost.post<any>(
            `/api/v1/tasks/solution/review`,
            dto,
        );

        return {
            status: 200,
            message: "Отзыв успешно создан!",
            review: data,
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

export const getReviews = async (
    dto: { page: number; page_size: number } = { page: 1, page_size: 10 },
) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: IReview[];
            numPages: number;
        }>(
            `/api/v1/tasks/review-list?page=${dto.page}&page_size=${dto.page_size}`,
        );

        return {
            status: 200,
            results: data.results,
            numPages: data.numPages,
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
