import { Tokens } from "@/app/_http/types";
import { IChat, ITask, IUser } from "@/app/_types";
import LocalStorage from "@/app/_utils/LocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RefObject } from "react";

type UserInterface = {
    isLoading: boolean;
    isMobileDevice: boolean;
    replyCount: number;
    myTasks: ITask[] | null;
    myArchivedTasks: ITask[] | null;
    isProfileInfoChanged: RefObject<boolean> | undefined;
};

const initialState: UserInterface = {
    isLoading: true,
    isMobileDevice: false,
    replyCount: 30,
    myTasks: null,
    myArchivedTasks: null,
    isProfileInfoChanged: undefined,
};

export const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        updateIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
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
            state.myTasks = null;
            state.myArchivedTasks = null;
        },
        updateIsProfileInfoChanged(state, action: PayloadAction<any>) {
            if (state.isProfileInfoChanged) {
                state.isProfileInfoChanged.current = action.payload;
            } else {
                state.isProfileInfoChanged = action.payload;
            }
        },
    },
});

export default contentSlice.reducer;
