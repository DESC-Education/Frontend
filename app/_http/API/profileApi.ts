import axios from "axios";
import { $authHost, $host } from "..";
import {
    CreateCompanyProfileDTO,
    CreateStudentProfileDTO,
    EditCompanyDTO,
    EditStudentDTO,
} from "../types";
import {
    ICity,
    ICompanyProfile,
    IFaculty,
    IProfile,
    ISkill,
    ISpeciality,
    IStudentProfile,
    IUniversity,
    IUser,
} from "@/app/_types";

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

export const filesTest = async (files: any) => {
    try {
        const { data } = await $authHost.post("/api/v1/profiles/test", files, {
            headers: { "Content-Type": "multipart/form-data" },
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

export const createProfileCompany = async (
    dto: CreateCompanyProfileDTO,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post("/api/v1/profiles/profile", dto);

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
    dto: EditStudentDTO,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.patch(
            "/api/v1/profiles/profile/edit",
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
    dto: EditCompanyDTO,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.patch(
            "/api/v1/profiles/profile/edit",
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
    user_id?: string;
}): Promise<{
    status: number;
    message: string;
    profile?: any;
}> => {
    try {
        const { data } = await $authHost.get<any>(
            `/api/v1/profiles/profile/${dto?.user_id ? dto.user_id : "my"}`,
        );

        return {
            status: 200,
            message: "Успешно",
            profile: data,
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

export const getUniversities = async (q: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: IUniversity[];
        }>(`/api/v1/profiles/universities?search=${q}`);

        return {
            status: 200,
            universities: data.results,
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

export const getFaculties = async (q: string, universityId?: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: IFaculty[];
        }>(
            `/api/v1/profiles/faculties?universityId=${universityId}&search=${q}`,
        );

        return {
            status: 200,
            faculties: data.results,
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

export const getSpecialities = async (q: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ISpeciality[];
        }>(`/api/v1/profiles/specialties?search=${q}`);

        return {
            status: 200,
            specialities: data.results,
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

export const getSkills = async (q: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ISkill[];
        }>(`/api/v1/profiles/skills?search=${q}`);

        return {
            status: 200,
            skills: data.results,
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

export const getCities = async (q: string) => {
    try {
        const { data } = await $authHost.get<{
            count: string;
            results: ICity[];
        }>(`/api/v1/profiles/cities?search=${q}`);

        return {
            status: 200,
            cities: data.results,
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
