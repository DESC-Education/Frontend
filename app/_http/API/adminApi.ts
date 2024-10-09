import axios from "axios";
import { $authHost } from "..";
import { dt } from "framer-motion/client";
import { IVerificationResult } from "@/app/_types";


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