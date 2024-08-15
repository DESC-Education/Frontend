import { IChat, IUser } from "@/app/_types";
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
        updateUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        updateChats(state, action: PayloadAction<IChat[]>) {
            state.chats = action.payload;
        },
        updateAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
    },
});

export default userSlice.reducer;
