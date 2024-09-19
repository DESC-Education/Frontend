import { IStudentProfile, IVerificationCompanyRequest, IVerificationStudentRequest } from "@/app/_types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type ProfileVerifyInterface = {
    studentsVerifications: any[] | null;
    companiesVerifications: any[] | null;
}

const initialState: ProfileVerifyInterface = {
    studentsVerifications: [
        {
            id: "",
            createdAt: "",
            requestStatus: "",
            comment: "",
            admin: "",
            userType: "",
            firstName: "",
            lastName: "",
            email: ""
        }
    ],
    companiesVerifications: [
        {
            id: "",
            createdAt: "",
            requestStatus: "",
            comment: "",
            admin: "",
            userType: "",
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
        updateStudentsVerifications(state, action: PayloadAction<{ profiles: IVerificationStudentRequest[] }>) {
            state.studentsVerifications = action.payload.profiles;
        },

        removeStudentVerification(state, action: PayloadAction<{ studentId: string }>) {
            state.studentsVerifications = state.studentsVerifications?.filter(
                (student) => student.id !== action.payload.studentId
            )!;
        },

        updateCompaniesVerifications(state, action: PayloadAction<{ profiles: IVerificationCompanyRequest[] }>) {
            state.companiesVerifications = action.payload.profiles;
        },
    },
});

export default profileVerifySlice.reducer;