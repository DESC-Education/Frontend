import axios from "axios";
import { $authHost, $host } from "..";
import { CreateCompanyProfileDTO, CreateStudentProfileDTO } from "../types";
import { ICompanyProfile, IStudentProfile } from "@/app/_types";

export const createProfileStudent = async (
    dto: CreateStudentProfileDTO,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post(
            "/api/v1/profiles/student_profile",
            dto,
        );

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

export const createProfileCompany = async (
    dto: CreateCompanyProfileDTO,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post(
            "/api/v1/profiles/company_profile",
            dto,
        );

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

export const editStudentProfile = async (
    dto: Partial<CreateStudentProfileDTO>,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.patch(
            "/api/v1/profiles/student_profile",
            dto,
        );

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

export const editCompanyProfile = async (
    dto: Partial<CreateCompanyProfileDTO>,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.patch(
            "/api/v1/profiles/company_profile",
            dto,
        );

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

export const getProfile = async (dto?: {
    user_id: string;
}): Promise<{
    status: number;
    message: string;
    profile?: IStudentProfile | ICompanyProfile;
}> => {
    try {
        const { data } = await $authHost.get<{
            message: string;
            profile: IStudentProfile | ICompanyProfile;
        }>(`/api/v1/profiles${dto?.user_id ? "/" + dto.user_id : ""}`);

        return { status: 200, message: data.message, profile: data.profile };
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
