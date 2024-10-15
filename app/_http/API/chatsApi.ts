import axios from "axios";
import { $authHost } from "..";
import {
    IChat,
    IChatCompanion,
    IFile,
    IMessage,
    IMiniChat,
} from "@/app/_types";

export const createChat = async (dto: {
    companionId: string;
    taskId?: string;
}) => {
    try {
        // const { data } = await $authHost.post("/api/v1/chats/chat", dto);
        const { data } = await $authHost.post<IChat>("/api/v1/chats/chat", dto);

        return { status: 200, chat: data };
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

export const getChats = async (
    dto: { page: number; page_size: number; q: string } = {
        page: 1,
        page_size: 50,
        q: "",
    },
) => {
    try {
        const { data } = await $authHost.get<{
            results: IChat[];
            count: number;
            numPages: number;
        }>(
            `/api/v1/chats/chats?page=${dto.page}&page_size=${dto.page_size}&search=${dto.q}`,
        );

        return {
            status: 200,
            count: data.count,
            numPages: data.numPages,
            results: data.results,
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

export const getChat = async (id: string, messageId?: string) => {
    try {
        const { data } = await $authHost.get<IChat>(
            `/api/v1/chats/chat/${id}${
                messageId ? `?message_id=${messageId}` : ""
            }`,
        );

        return {
            status: 200,
            chat: data,
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

export const createFile = async (dto: FormData) => {
    try {
        const { data } = await $authHost.post<IFile>(
            `/api/v1/chats/send_file`,
            dto,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return {
            status: 200,
            file: data,
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

export const changeFavouriteChat = async (id: string) => {
    try {
        const { data } = await $authHost.get<{ results: IChat[] }>(
            `/api/v1/chats/chat/${id}/favorite`,
        );

        return {
            status: 200,
            chats: data.results,
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
