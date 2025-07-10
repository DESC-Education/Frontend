import { IVacancy, IVacancyApplication } from "@/app/_types";
import { $authHost } from "../index";

export const getVacancies = async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    experienceLevel?: string;
    employmentType?: string;
    skills?: string[];
}): Promise<{
    vacancies: IVacancy[];
    total: number;
    page: number;
    limit: number;
}> => {
    const response = await $authHost.get("/vacancies/", { params });
    return response.data;
};

export const getVacancy = async (id: string): Promise<IVacancy> => {
    const response = await $authHost.get(`/vacancies/${id}/`);
    return response.data;
};

export const createVacancy = async (data: {
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    conditions: string;
    salary: {
        min: number;
        max: number;
        currency: string;
    };
    location: string;
    employmentType: string;
    experienceLevel: string;
    skills: string[];
    category: string;
    deadline: string;
}): Promise<IVacancy> => {
    const response = await $authHost.post("/vacancies/", data);
    return response.data;
};

export const updateVacancy = async (
    id: string,
    data: Partial<{
        title: string;
        description: string;
        requirements: string;
        responsibilities: string;
        conditions: string;
        salary: {
            min: number;
            max: number;
            currency: string;
        };
        location: string;
        employmentType: string;
        experienceLevel: string;
        skills: string[];
        category: string;
        deadline: string;
        isActive: boolean;
    }>
): Promise<IVacancy> => {
    const response = await $authHost.patch(`/vacancies/${id}/`, data);
    return response.data;
};

export const deleteVacancy = async (id: string): Promise<void> => {
    await $authHost.delete(`/vacancies/${id}/`);
};

export const applyToVacancy = async (
    vacancyId: string,
    data: {
        coverLetter: string;
        files?: File[];
    }
): Promise<IVacancyApplication> => {
    const formData = new FormData();
    formData.append("coverLetter", data.coverLetter);
    
    if (data.files) {
        data.files.forEach((file) => {
            formData.append("files", file);
        });
    }

    const response = await $authHost.post(
        `/vacancies/${vacancyId}/apply/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const getMyApplications = async (): Promise<IVacancyApplication[]> => {
    const response = await $authHost.get("/vacancies/applications/");
    return response.data;
};

export const getCompanyVacancies = async (): Promise<IVacancy[]> => {
    const response = await $authHost.get("/vacancies/my/");
    return response.data;
};

export const getVacancyApplications = async (
    vacancyId: string
): Promise<IVacancyApplication[]> => {
    const response = await $authHost.get(`/vacancies/${vacancyId}/applications/`);
    return response.data;
};

export const updateApplicationStatus = async (
    applicationId: string,
    status: "accepted" | "rejected" | "interview"
): Promise<IVacancyApplication> => {
    const response = await $authHost.patch(`/vacancies/applications/${applicationId}/`, {
        status,
    });
    return response.data;
}; 