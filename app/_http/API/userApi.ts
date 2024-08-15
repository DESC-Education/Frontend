import axios from "axios";
import { $authHost } from "..";
import { IUser } from "@/app/_types";

export const verifyEmail = async (data: {
    email: string;
    code: string;
}): Promise<{ status: number; message?: string }> => {
    try {
        const rs = await $authHost.post("/api/v1/register/verify", data);
        return { status: 200, message: "Email подтвержден" };
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

export const registerUser = async (data: {
    email: string;
    password: string;
}): Promise<{ status: number; message?: string; user?: IUser }> => {
    try {
        const rs = await $authHost.post("/api/v1/registration", data);
        return {
            status: 200,
            message: "Регистрация прошла успешно",
            user: rs.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error);
            
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

export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    try {
        const rs = await $authHost.post("/api/v1/login", data);
        return rs;
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