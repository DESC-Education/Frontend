import { SSENotificationPayload, Tokens } from "@/app/_http/types";
import { IChat, ITask, IUser } from "@/app/_types";
import { MAX_REPLY_COUNT } from "@/app/_utils/constants";
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
    // unreadChatsCount: number;
    notifications: SSENotificationPayload[] | null;
};

const initialState: UserInterface = {
    isLoading: true,
    isMobileDevice: false,
    replyCount: MAX_REPLY_COUNT,
    myTasks: null,
    myArchivedTasks: null,
    isProfileInfoChanged: undefined,
    notifications: null,
    // unreadChatsCount: 0,
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
        updateReplyCount(state, action: PayloadAction<number>) {
            state.replyCount = action.payload;
        },
        updateNotifications(
            state,
            action: PayloadAction<SSENotificationPayload[]>,
        ) {
            state.notifications = action.payload;
        },
        sortNotifications(state) {
            if (!state.notifications) return;

            state.notifications = state.notifications.sort((a, b) => {
                if (a.isRead !== b.isRead) {
                    return Number(a.isRead) - Number(b.isRead);
                }
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            });
        },
        addNotification(state, action: PayloadAction<SSENotificationPayload>) {
            if (!state.notifications) return;
            state.notifications.push(action.payload);
        },
        updateNotificationRead(state, action: PayloadAction<string>) {
            if (!state.notifications) return;
            state.notifications = state.notifications.map((item) => {
                if (item.id === action.payload) {
                    return {
                        ...item,
                        isRead: true,
                    };
                } else {
                    return item;
                }
            });
        },
    },
});

export default contentSlice.reducer;
