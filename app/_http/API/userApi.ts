import axios from "axios";
import { $authHost, $host } from "..";
import { IUser } from "@/app/_types";
import { SSENotificationPayload, Tokens } from "../types";

export const sendVerificationCode = async (dto: {
    type: "RG" | "PW" | "EM";
    email?: string;
}): Promise<{ status: number; message: string }> => {
    try {
        let data;
        if (dto.type === "EM") {
            data = await $authHost.post("/api/v1/users/send_verify_code", dto);
        } else if (dto.type === "RG") {
            data = await $host.post("/api/v1/users/send_verify_code", dto);
        } else {
            data = await $host.post("/api/v1/users/send_verify_code", dto);
        }

        return { status: 200, message: "Успешно" };
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

export const verifyEmail = async (dto: {
    email: string;
    code: number;
}): Promise<{
    status: number;
    message?: string;
    user?: IUser;
    tokens?: Tokens;
}> => {
    try {
        const { data } = await $host.post(
            "/api/v1/users/registration/verify",
            dto,
        );

        return {
            status: 200,
            user: data.user,
            tokens: data.tokens,
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

export const registerUser = async (dto: {
    email: string;
    password: string;
    role: "student" | "company";
}): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $host.post<{
            message: string;
        }>("/api/v1/users/registration", dto);

        return {
            status: 200,
            message: "Успешно",
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

export const loginUser = async (dto: {
    email: string;
    password: string;
}): Promise<{
    status: number;
    message: string;
    user?: IUser;
    tokens?: Tokens;
}> => {
    try {
        const { data } = await $host.post<{
            user: IUser;
            tokens: Tokens;
        }>("/api/v1/users/login", dto);

        return {
            status: 200,
            message: "Успешно",
            user: data.user,
            tokens: data.tokens,
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

export const auth = async () => {
    try {
        const { data } = await $authHost.get<
            IUser & {
                notifications: SSENotificationPayload[];
                unreadChatsCount: number;
            }
        >("/api/v1/users/auth");

        return {
            status: 200,
            message: "Успешно",
            user: data,
            unreadChatsCount: data.unreadChatsCount,
            notifications: data.notifications,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};

export const recoverPassword = async (dto: {
    email: string;
    code: number;
    new_password: string;
}): Promise<{ status: number; message?: string }> => {
    try {
        const { data } = await $authHost.post(
            "/api/v1/users/change_password",
            dto,
        );

        return { status: 200, message: "Успешно" };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};

export const changeEmail = async (dto: {
    code: number;
}): Promise<{ status: number; message?: string }> => {
    try {
        const { data } = await $authHost.post(
            "/api/v1/users/change_email",
            dto,
        );

        return { status: 200, message: "Успешно" };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};

export const verifyEmailChange = async (dto: {
    code: number;
}): Promise<{ status: number; message?: string }> => {
    try {
        const { data } = await $authHost.post(
            "/api/v1/users/change_email",
            dto,
        );

        return { status: 200, message: "Успешно" };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};
