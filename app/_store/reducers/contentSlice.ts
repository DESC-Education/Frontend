import { Tokens } from "@/app/_http/types";
import { IChat, ITask, IUser } from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInterface = {
    isLoading: boolean;
    isMobileDevice: boolean;
    replyCount: number;
    chats: IChat[];
    myTasks: ITask[] | null;
    myArchivedTasks: ITask[] | null;
};

const initialState: UserInterface = {
    isLoading: true,
    isMobileDevice: false,
    replyCount: 30,
    chats: [],
    myTasks: null,
    myArchivedTasks: null,
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
        updateIsMobileDevice(state, action: PayloadAction<boolean>) {
            state.isMobileDevice = action.payload;
        },
        logoutContent(state) {
            state.isLoading = true;
            state.isMobileDevice = false;
            state.replyCount = 30;
            state.chats = [];
            state.myTasks = null;
            state.myArchivedTasks = null;
        },
    },
});

export default contentSlice.reducer;
