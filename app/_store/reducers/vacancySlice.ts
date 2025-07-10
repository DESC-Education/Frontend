import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IVacancy, IVacancyApplication } from "@/app/_types";
import {
    getVacancies,
    getVacancy,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    applyToVacancy,
    getMyApplications,
    getCompanyVacancies,
    getVacancyApplications,
    updateApplicationStatus,
} from "@/app/_http/API/vacanciesApi";

interface VacancyState {
    vacancies: IVacancy[];
    currentVacancy: IVacancy | null;
    myApplications: IVacancyApplication[];
    companyVacancies: IVacancy[];
    vacancyApplications: IVacancyApplication[];
    total: number;
    page: number;
    limit: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: VacancyState = {
    vacancies: [],
    currentVacancy: null,
    myApplications: [],
    companyVacancies: [],
    vacancyApplications: [],
    total: 0,
    page: 1,
    limit: 10,
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchVacancies = createAsyncThunk(
    "vacancy/fetchVacancies",
    async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        location?: string;
        experienceLevel?: string;
        employmentType?: string;
        skills?: string[];
    }) => {
        const response = await getVacancies(params);
        return response;
    }
);

export const fetchVacancy = createAsyncThunk(
    "vacancy/fetchVacancy",
    async (id: string) => {
        const response = await getVacancy(id);
        return response;
    }
);

export const createVacancyThunk = createAsyncThunk(
    "vacancy/createVacancy",
    async (data: {
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
    }) => {
        const response = await createVacancy(data);
        return response;
    }
);

export const updateVacancyThunk = createAsyncThunk(
    "vacancy/updateVacancy",
    async ({
        id,
        data,
    }: {
        id: string;
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
        }>;
    }) => {
        const response = await updateVacancy(id, data);
        return response;
    }
);

export const deleteVacancyThunk = createAsyncThunk(
    "vacancy/deleteVacancy",
    async (id: string) => {
        await deleteVacancy(id);
        return id;
    }
);

export const applyToVacancyThunk = createAsyncThunk(
    "vacancy/applyToVacancy",
    async ({
        vacancyId,
        data,
    }: {
        vacancyId: string;
        data: {
            coverLetter: string;
            files?: File[];
        };
    }) => {
        const response = await applyToVacancy(vacancyId, data);
        return response;
    }
);

export const fetchMyApplications = createAsyncThunk(
    "vacancy/fetchMyApplications",
    async () => {
        const response = await getMyApplications();
        return response;
    }
);

export const fetchCompanyVacancies = createAsyncThunk(
    "vacancy/fetchCompanyVacancies",
    async () => {
        const response = await getCompanyVacancies();
        return response;
    }
);

export const fetchVacancyApplications = createAsyncThunk(
    "vacancy/fetchVacancyApplications",
    async (vacancyId: string) => {
        const response = await getVacancyApplications(vacancyId);
        return response;
    }
);

export const updateApplicationStatusThunk = createAsyncThunk(
    "vacancy/updateApplicationStatus",
    async ({
        applicationId,
        status,
    }: {
        applicationId: string;
        status: "accepted" | "rejected" | "interview";
    }) => {
        const response = await updateApplicationStatus(applicationId, status);
        return response;
    }
);

const vacancySlice = createSlice({
    name: "vacancy",
    initialState,
    reducers: {
        clearCurrentVacancy: (state) => {
            state.currentVacancy = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchVacancies
        builder
            .addCase(fetchVacancies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchVacancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vacancies = action.payload.vacancies;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchVacancies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка загрузки вакансий";
            });

        // fetchVacancy
        builder
            .addCase(fetchVacancy.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchVacancy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentVacancy = action.payload;
            })
            .addCase(fetchVacancy.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка загрузки вакансии";
            });

        // createVacancy
        builder
            .addCase(createVacancyThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createVacancyThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vacancies.unshift(action.payload);
            })
            .addCase(createVacancyThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка создания вакансии";
            });

        // updateVacancy
        builder
            .addCase(updateVacancyThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateVacancyThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.vacancies.findIndex(
                    (v) => v.id === action.payload.id
                );
                if (index !== -1) {
                    state.vacancies[index] = action.payload;
                }
                if (state.currentVacancy?.id === action.payload.id) {
                    state.currentVacancy = action.payload;
                }
            })
            .addCase(updateVacancyThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка обновления вакансии";
            });

        // deleteVacancy
        builder
            .addCase(deleteVacancyThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteVacancyThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vacancies = state.vacancies.filter(
                    (v) => v.id !== action.payload
                );
                if (state.currentVacancy?.id === action.payload) {
                    state.currentVacancy = null;
                }
            })
            .addCase(deleteVacancyThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка удаления вакансии";
            });

        // applyToVacancy
        builder
            .addCase(applyToVacancyThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(applyToVacancyThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myApplications.unshift(action.payload);
            })
            .addCase(applyToVacancyThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка подачи заявки";
            });

        // fetchMyApplications
        builder
            .addCase(fetchMyApplications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myApplications = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка загрузки заявок";
            });

        // fetchCompanyVacancies
        builder
            .addCase(fetchCompanyVacancies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCompanyVacancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.companyVacancies = action.payload;
            })
            .addCase(fetchCompanyVacancies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка загрузки вакансий компании";
            });

        // fetchVacancyApplications
        builder
            .addCase(fetchVacancyApplications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchVacancyApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vacancyApplications = action.payload;
            })
            .addCase(fetchVacancyApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка загрузки заявок на вакансию";
            });

        // updateApplicationStatus
        builder
            .addCase(updateApplicationStatusThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatusThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.vacancyApplications.findIndex(
                    (a) => a.id === action.payload.id
                );
                if (index !== -1) {
                    state.vacancyApplications[index] = action.payload;
                }
            })
            .addCase(updateApplicationStatusThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка обновления статуса заявки";
            });
    },
});

export const { clearCurrentVacancy, clearError } = vacancySlice.actions;
export default vacancySlice.reducer; 