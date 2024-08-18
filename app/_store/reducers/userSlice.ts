import { Tokens } from "@/app/_http/types";
import { IChat, IUser } from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    user: IUser;
    chats: IChat[];
    isAuth: boolean;
};

const initialState: UserInterface = {
    user: {} as IUser,
    chats: [],
    isAuth: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        authUser(state, action: PayloadAction<{user: IUser, tokens?: Tokens}>) {
            state.user = action.payload.user;
            state.isAuth = true;
            if (action.payload.tokens) {
                LocalStorage.setTokens(action.payload.tokens.accessToken, action.payload.tokens.refreshToken);
            }
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
