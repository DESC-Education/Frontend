import { Tokens } from "@/app/_http/types";
import { IChat, IUser } from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    isLoading: boolean;
    replyCount: number;
    chats: IChat[];
};

const initialState: UserInterface = {
    isLoading: true,
    replyCount: 30,
    chats: [],
};

export const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        updateIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        updateChats(state, action: PayloadAction<IChat[]>) {
            state.chats = action.payload;
        },
    },
});

export default contentSlice.reducer;
