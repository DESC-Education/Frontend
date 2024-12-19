import axios from "axios";
import { $authHost } from "..";
import { dt } from "framer-motion/client";
import { IChat, ICompanyProfile, ISolution, IUsersRequest, IVerificationResult } from "@/app/_types";


export const getRequests = async (
    status: "pending" | "approved" | "rejected",
    role: "student" | "company",
    q?: string,
) => {
    try {
        const { data } = await $authHost.get<{
            results: IVerificationResult[];
            status: "pending" | "approved" | "rejected",
            role: "student" | "company",
            q: "",
        }>(`/api/v1/admins/profile/requests?status=${status}&role=${role}&search=${q}`);

        return {
            status: 200,
            requests: data.results,
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

export const getRequest = async (id: string) => {
    try {
        const { data } = await $authHost.get<any>(`/api/v1/admins/profile/request/${id}`);

        return {
            status: 200,
            request: data,
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

export const answerVerifyRequest = async (id: string, dto: {
    status: "approved" | "rejected" | "pending";
    comment?: string;
}) => {
    try {
        const { data } = await $authHost.post<{
            message: string;
        }>(`/api/v1/admins/profile/request/${id}`, dto);

        return {
            status: 200,
            message: data.message,
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

export const getUsers = async (
    role: "student" | "company",
    q?: string,
) => {
    try {
        const { data } = await $authHost.get<{
            results: IUsersRequest[];
            role: "student" | "company",
            q: "",
        }>(`/api/v1/admins/users/?role=${role}&search=${q}`);

        return {
            status: 200,
            users: data.results,
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
}

export const getUser = async (companyId: string) => {
    try {
        const { data } = await $authHost.get<any>(`/api/v1/admins/user/${companyId}`);
        return data;
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
}


export const getUserChats = async (userId: string) => {
    try {
        const { data } = await $authHost.get<any>(`/api/v1/admins/user/${userId}/chats`);

        return {
            status: 200,
            chats: data,
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
}

export const getUserChat = async (dto: {
    chatId: string,
    userId: string,
    messageId?: string,
}) => {
    try {
        const { data } = await $authHost.get<IChat & { hasMoreMessages: boolean }>(`/api/v1/admins/user/${dto.userId}/chat/${dto.chatId}${dto.messageId ? `?messageId=${dto.messageId}` : ""}`);
        return {
            status: 200,
            chat: data,
            hasMoreMessages: data.hasMoreMessages,
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
}


export const getStudentSolutions = async (userId: string) => {
    try {
        const { data } = await $authHost.get<any>(`/api/v1/admins/student/${userId}/solutions`);
        return {
            status: 200,
            solutions: data,
        }
    } catch (e) {
        return {
            status: 500,
            message: "Ошибка сервера",
        };
    }
}


export const statsRegUsers = async (dto: {
    fromDate: string,
    toDate: string,
}) => {
    try {
        if (dto.fromDate === "" || dto.toDate === "") {
            const { data } = await $authHost.post<{
                fromDate: string,
                toDate: string,
            }>('/api/v1/admins/stats/users')

            return {
                status: 200,
                stats: data,
            };
        }

        const { data } = await $authHost.post<{
            fromDate: string,
            toDate: string,
        }>('/api/v1/admins/stats/users', dto)

        return {
            status: 200,
            stats: data,
        };

    }
    catch (error) {
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
}


export const statsTasks = async (dto: {
    fromDate: string,
    toDate: string,
}) => {
    try {

        if (dto.fromDate === "" || dto.toDate === "") {
            const { data } = await $authHost.post<{
                fromDate: string,
                toDate: string,
            }>('/api/v1/admins/stats/tasks')

            return {
                status: 200,
                stats: data,
            };
        }

        const { data } = await $authHost.post<{
            fromDate: string,
            toDate: string,
        }>('/api/v1/admins/stats/tasks', dto)

        return {
            status: 200,
            stats: data,
        };

    }
    catch (error) {
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
}