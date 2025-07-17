import { $authHost, $host } from "../index";
import axios from "axios";

// Типы для вакансий
export interface IVacancy {
    id: string;
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    salary_min: number;
    salary_max: number;
    salary_currency: string;
    salary_negotiable: boolean;
    location: string;
    remote_work: boolean;
    hybrid_work: boolean;
    experience_required: string;
    education_required: string;
    employment_type: string;
    work_schedule: string;
    status: "active" | "inactive" | "moderation";
    category: {
        id: string;
        name: string;
    };
    companyProfile: {
        companyName: string;
        logoImg: string;
        id: string;
    };
    applicationsCount: number;
    createdAt: string;
    publishedAt: string;
}

export interface IVacancyApplication {
    id: string;
    vacancy: string;
    studentProfile: {
        firstName: string;
        lastName: string;
        logoImg: string;
    };
    cover_letter: string;
    expected_salary: number;
    available_from: string;
    status: "pending" | "accepted" | "rejected";
    companyComment: string;
    createdAt: string;
    respondedAt: string;
}

// Получение списка вакансий
export const getVacancies = async (params?: {
    search?: string;
    category?: string;
    salary_min?: number;
    salary_max?: number;
    remote_work?: boolean;
    location?: string;
    employment_type?: string;
    experience_required?: string;
    page?: number;
    page_size?: number;
}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const { data } = await $host.get<IVacancy[]>(`/api/v1/vacancies/vacancies?${queryParams}`);
        return {
            status: 200,
            data,
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

// Создание новой вакансии
export const createVacancy = async (vacancyData: {
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    salary_min: number;
    salary_max: number;
    salary_currency: string;
    location: string;
    remote_work: boolean;
    categoryId: string;
    filtersId?: string[];
    experience_required?: string;
    education_required?: string;
    employment_type?: string;
    work_schedule?: string;
}) => {
    try {
        const { data } = await $authHost.post<IVacancy>("/api/v1/vacancies/vacancy", vacancyData);
        return {
            status: 200,
            data,
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

// Получение деталей вакансии
export const getVacancyById = async (id: string) => {
    try {
        const { data } = await $host.get<IVacancy>(`/api/v1/vacancies/vacancy/${id}`);
        return {
            status: 200,
            data,
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

// Редактирование вакансии
export const updateVacancy = async (id: string, vacancyData: Partial<{
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    salary_min: number;
    salary_max: number;
    salary_currency: string;
    location: string;
    remote_work: boolean;
    categoryId: string;
    filtersId: string[];
    experience_required: string;
    education_required: string;
    employment_type: string;
    work_schedule: string;
}>) => {
    try {
        const { data } = await $authHost.patch<IVacancy>(`/api/v1/vacancies/vacancy/${id}`, vacancyData);
        return {
            status: 200,
            data,
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

// Получение вакансий компании
export const getCompanyVacancies = async () => {
    try {
        const { data } = await $authHost.get<IVacancy[]>("/api/v1/vacancies/my/company/vacancies");
        return {
            status: 200,
            data,
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

// Подача заявки на вакансию
export const applyToVacancy = async (applicationData: {
    vacancyId: string;
    cover_letter: string;
    expected_salary: number;
    available_from: string;
}) => {
    try {
        const { data } = await $authHost.post<IVacancyApplication>("/api/v1/vacancies/application", applicationData);
        return {
            status: 200,
            data,
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

// Получение заявок на вакансию (для компании)
export const getVacancyApplications = async (vacancyId: string) => {
    try {
        const { data } = await $authHost.get<IVacancyApplication[]>(`/api/v1/vacancies/application-list/${vacancyId}`);
        return {
            status: 200,
            data,
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

// Получение деталей заявки
export const getApplicationById = async (id: string) => {
    try {
        const { data } = await $authHost.get<IVacancyApplication>(`/api/v1/vacancies/application/${id}`);
        return {
            status: 200,
            data,
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

// Оценка заявки (принять/отклонить)
export const evaluateApplication = async (id: string, evaluation: {
    status: "accepted" | "rejected";
    comment?: string;
}) => {
    try {
        const { data } = await $authHost.post<IVacancyApplication>(`/api/v1/vacancies/application/evaluate/${id}`, evaluation);
        return {
            status: 200,
            data,
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

// Получение заявок студента
export const getStudentApplications = async () => {
    try {
        const { data } = await $authHost.get<IVacancyApplication[]>("/api/v1/vacancies/my/student/applications");
        return {
            status: 200,
            data,
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