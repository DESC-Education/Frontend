import { IStudentProfile, IVerificationCompanyRequest, IVerificationResult, IVerificationStudentRequest } from "@/app/_types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type ProfileVerifyInterface = {
    studentsVerifications: IVerificationResult[] | null;
    companiesVerifications: IVerificationResult[] | null;
}

const initialState: ProfileVerifyInterface = {
    studentsVerifications: [
        {
            id: "",
            createdAt: "",
            requestStatus: "pending",
            comment: "",
            admin: "",
            userType: "student",
            firstName: "",
            lastName: "",
            email: ""
        }
    ],
    companiesVerifications: [
        {
            id: "",
            createdAt: "",
            requestStatus: "pending",
            comment: "",
            admin: "",
            userType: "company",
            firstName: "",
            lastName: "",
            email: ""
        }
    ]
}

export const profileVerifySlice = createSlice({
    name: "profileVerify",
    initialState,
    reducers: {
        updateStudentsVerifications(state, action: PayloadAction<{ profiles: IVerificationResult[] }>) {
            state.studentsVerifications = action.payload.profiles;
        },

        removeStudentVerification(state, action: PayloadAction<{ studentId: string }>) {
            state.studentsVerifications = state.studentsVerifications?.filter(
                (student) => student.id !== action.payload.studentId
            )!;
        },

        updateCompaniesVerifications(state, action: PayloadAction<{ profiles: IVerificationResult[] }>) {
            state.companiesVerifications = action.payload.profiles;
        },

        removeCompanyVerification(state, action: PayloadAction<{ companyId: string }>) {
            state.companiesVerifications = state.companiesVerifications?.filter(
                (company) => company.id !== action.payload.companyId
            )!;
        },
    },
});

export default profileVerifySlice.reducer;