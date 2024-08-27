import { Tokens } from "@/app/_http/types";
import {
    IChat,
    ICity,
    ICompanyProfile,
    IFaculty,
    IFile,
    ISpeciality,
    IStudentProfile,
    IUniversity,
    IUser,
} from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    user: IUser;
    chats: IChat[];
    isAuth: boolean;
    isProfileLoading: boolean;
    isProfileVerified: boolean;
    companyProfile: ICompanyProfile;
    studentProfile: IStudentProfile;
};

const initProfileStudent: IStudentProfile = {
    id: "",
    isVerified: false,
    admissionYear: 0,
    description: "",
    firstName: "",
    lastName: "",
    logoImg: "",
    phone: "",
    emailVisibility: false,
    phoneVisibility: false,
    timezone: 0,
    university: {} as IUniversity,
    speciality: {} as ISpeciality,
    faculty: {} as IFaculty,
    formOfEducation: "part_time",
    telegramLink: "",
    vkLink: "",
    city: {} as ICity,
    skills: [],
};

const initProfileCompany: ICompanyProfile = {
    id: "",
    isVerified: false,
    description: "",
    logoImg: {} as IFile,
    city: {} as ICity,
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
    emailVisibility: false,
    phoneVisibility: false,
    timezone: 0,
    linkToCompany: "",
    telegramLink: "",
    vkLink: "",
};

const initialState: UserInterface = {
    user: {} as IUser,
    chats: [],
    isAuth: false,
    isProfileLoading: true,
    isProfileVerified: false,
    companyProfile: initProfileCompany,
    studentProfile: initProfileStudent,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        authUser(
            state,
            action: PayloadAction<{ user: IUser; tokens?: Tokens }>,
        ) {
            state.user = action.payload.user;
            state.isAuth = true;
            if (action.payload.tokens) {
                LocalStorage.setTokens(
                    action.payload.tokens.accessToken,
                    action.payload.tokens.refreshToken,
                );
            }
        },
        updateProfile(state, action: PayloadAction<any>) {
            state.isProfileLoading = false;

            if (action.payload.isVerified) {
                state.isProfileVerified = true;
            }
            if (state.user.role === "student") {
                state.studentProfile = action.payload;
            } else {
                state.companyProfile = action.payload;
            }
        },
        updateStudentProfile(state, action: PayloadAction<IStudentProfile>) {
            state.studentProfile = action.payload;
        },
        updateCompanyProfile(state, action: PayloadAction<ICompanyProfile>) {
            state.companyProfile = action.payload;
        },
        updateUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        updateChats(state, action: PayloadAction<IChat[]>) {
            state.chats = action.payload;
        },
        logoutUser(state) {
            state.user = {} as IUser;
            state.isAuth = false;
            LocalStorage.logout();
        },
        updateAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
    },
});

export default userSlice.reducer;
