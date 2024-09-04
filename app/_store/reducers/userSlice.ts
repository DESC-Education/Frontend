import { Tokens } from "@/app/_http/types";
import {
    IChat,
    ICity,
    ICompanyProfile,
    IFaculty,
    IFile,
    ISpecialty,
    IStudentProfile,
    IUniversity,
    IUser,
    IVerification,
    VerificationStatuses,
} from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    user: IUser;
    chats: IChat[];
    isAuth: boolean;
    isProfileLoading: boolean;
    profileVerification: IVerification;
    companyProfile: ICompanyProfile;
    studentProfile: IStudentProfile;
};

const initProfileStudent: IStudentProfile = {
    id: "",
    verification: { status: "not_verified" },
    admissionYear: null,
    description: "",
    firstName: "",
    lastName: "",
    logoImg: "",
    phone: "",
    emailVisibility: false,
    phoneVisibility: false,
    timezone: null,
    university: {} as IUniversity,
    specialty: {} as ISpecialty,
    faculty: {} as IFaculty,
    formOfEducation: "",
    telegramLink: "",
    vkLink: "",
    city: {} as ICity,
    skills: [],
};

const initProfileCompany: ICompanyProfile = {
    id: "",
    verification: { status: "not_verified" },
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
    skills: [],
};

const initialState: UserInterface = {
    user: {} as IUser,
    chats: [],
    isAuth: false,
    isProfileLoading: true,
    profileVerification: { status: "not_verified" },
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

            state.profileVerification = action.payload.verification;
            if (state.user.role === "student") {
                state.studentProfile = action.payload;
            } else {
                state.companyProfile = action.payload;
            }
        },
        updateProfileVerification(state, action: PayloadAction<IVerification>) {
            state.profileVerification = action.payload;
        },
        updateIsProfileLoading(state, action: PayloadAction<boolean>) {
            state.isProfileLoading = action.payload;
        },
        updateStudentProfile(state, action: PayloadAction<IStudentProfile>) {
            state.studentProfile = {
                ...action.payload,
                telegramLink: action.payload.telegramLink
                    ? `https://t.me/${action.payload.telegramLink}`
                    : undefined,
                vkLink: action.payload.vkLink
                    ? `https://vk.com/${action.payload.vkLink}`
                    : undefined,
            };
        },
        updateCompanyProfile(state, action: PayloadAction<ICompanyProfile>) {
            state.companyProfile = {
                ...action.payload,
                telegramLink: action.payload.telegramLink
                    ? `https://t.me/${action.payload.telegramLink}`
                    : undefined,
                vkLink: action.payload.vkLink
                    ? `https://vk.com/${action.payload.vkLink}`
                    : undefined,
            };
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
