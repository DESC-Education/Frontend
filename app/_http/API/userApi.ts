import axios from "axios";
import { $authHost, $host } from "..";
import { IUser } from "@/app/_types";
import { Tokens } from "../types";

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

        return { status: 200, message: data.data.message };
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
    code: string;
}): Promise<{
    status: number;
    message?: string;
    user?: IUser;
    tokens?: Tokens;
}> => {
    try {
        const { data } = await $authHost.post("/api/v1/users/registration/verify", dto);

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

export const registerUser = async (dto: {
    email: string;
    password: string;
}): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post<{
            status: number;
            data: { user: IUser; tokens: Tokens };
            message: string;
        }>("/api/v1/users/registration", dto);

        console.log("data", data);

        return {
            status: 200,
            message: data.message,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("reg error", error);

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
            data: { user: IUser; tokens: Tokens };
            message: string;
        }>("/api/v1/users/login", dto);

        console.log(data);

        return {
            status: 200,
            message: data.message,
            user: data.data.user,
            tokens: data.data.tokens,
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

export const auth = async (): Promise<{
    status: number;
    message: string;
    user?: IUser;
}> => {
    try {
        const { data } = await $authHost.get<{
            data: { user: IUser };
            message: string;
        }>("/api/v1/users/auth");

        return {
            status: 200,
            message: data.message,
            user: data.data.user,
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
    code: string;
    new_password: string;
}): Promise<{ status: number; message?: string }> => {
    try {
        const { data } = await $authHost.post("/api/v1/users/change_password", dto);

        return { status: 200, message: data.message };
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
