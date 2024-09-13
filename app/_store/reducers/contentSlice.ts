import { Tokens } from "@/app/_http/types";
import { IChat, ITask, IUser } from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    isLoading: boolean;
    replyCount: number;
    chats: IChat[];
    myTasks: ITask[];
    myArchivedTasks: ITask[];
};

const initialState: UserInterface = {
    isLoading: true,
    replyCount: 30,
    chats: [],
    myTasks: [],
    myArchivedTasks: [],
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
        updateMyTasks(state, action: PayloadAction<ITask[]>) {
            state.myTasks = action.payload;
        },
        updateMyArchivedTasks(state, action: PayloadAction<ITask[]>) {
            state.myArchivedTasks = action.payload;
        },
    },
});

export default contentSlice.reducer;
