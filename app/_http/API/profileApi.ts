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
    ISpecialty,
    IStudentProfile,
    IUniversity,
    IUser,
} from "@/app/_types";

export const createProfileStudent = async (
    dto: any,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post("/api/v1/profiles/profile", dto, {
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

export const createProfileCompany = async (
    dto: any,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post("/api/v1/profiles/profile", dto, {
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

export const editStudentProfile = async (
    dto: EditStudentDTO,
): Promise<{ status: number; message: string }> => {
    try {
        const { data } = await $authHost.post(
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
        const { data } = await $authHost.post(
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
            results: ISpecialty[];
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

export const changeLogo = async (formdata: FormData) => {
    try {
        const { data } = await $authHost.post(
            "/api/v1/profiles/logo",
            formdata,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return {
            status: 200,
            logo: data.logo.logo,
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

export const sendPhoneVerificationCode = async (dto: {
    phone: string;
}): Promise<{ status: number; message: string }> => {
    try {
        console.log(dto);
        
        const { data } = await $authHost.post("/api/v1/profiles/phone/code", dto);

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

export const verifyPhone = async (dto: {
    phone: string;
    code: number;
}): Promise<{ status: number; message?: string; phone?: string }> => {
    try {
        console.log("verifyPhone", dto);
        
        const { data } = await $authHost.post<{ phone?: string }>("/api/v1/profiles/phone", dto);

        return { status: 200, message: "Успешно", phone: data.phone };
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