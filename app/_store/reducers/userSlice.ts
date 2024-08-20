import { Tokens } from "@/app/_http/types";
import { IChat, ICompanyProfile, IStudentProfile, IUser } from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    user: IUser;
    chats: IChat[];
    isAuth: boolean;
    profile: IStudentProfile | ICompanyProfile;
};

const initialState: UserInterface = {
    user: {} as IUser,
    chats: [],
    isAuth: false,
    profile: {} as IStudentProfile | ICompanyProfile,
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
        updateProfile(
            state,
            action: PayloadAction<IStudentProfile | ICompanyProfile>,
        ) {
            state.profile = action.payload;
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
