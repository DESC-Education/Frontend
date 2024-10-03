import { IChat, IMessage, ISolution } from "@/app/_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatState = {
    chats: IChat[] | null;
    currentChat: IChat | null;
};

const initialState: ChatState = {
    chats: null,
    currentChat: null,
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        updateCurrentChat: (state, action: PayloadAction<IChat | null>) => {
            state.currentChat = action.payload;
        },
        updateChats: (state, action: PayloadAction<IChat[]>) => {
            state.chats = action.payload;
        },
        addChat: (state, action: PayloadAction<IChat>) => {
            state.chats?.push(action.payload);
        },
        deleteChat: (state, action: PayloadAction<string>) => {
            if (state.chats) {
                state.chats = state.chats.filter(
                    (item) => item.id !== action.payload,
                );
            }
        },
        addChatMessage: (state, action: PayloadAction<IMessage>) => {
            if (state.currentChat) {
                state.currentChat.messages?.push(action.payload);
            }
        },
        updateIsRead: (state, action: PayloadAction<IMessage>) => {
            if (state.currentChat) {
                state.currentChat.messages = state.currentChat.messages.map(
                    (item) => {
                        if (item.id === action.payload.id) {
                            return { ...item, isRead: action.payload.isRead };
                        } else {
                            return item;
                        }
                    },
                );
            }
        },
        updateChatFavourite: (
            state,
            action: PayloadAction<{ chat: string; isFavorite: boolean }>,
        ) => {
            if (state.chats) {
                state.chats = state.chats.map((item) => {
                    if (item.id === action.payload.chat) {
                        return {
                            ...item,
                            isFavorite: action.payload.isFavorite,
                        };
                    } else {
                        return item;
                    }
                });
            }
        },
        updateChatMessage: (state, action: PayloadAction<IMessage>) => {
            if (state.currentChat) {
                state.currentChat.messages = state.currentChat.messages.map(
                    (item) => {
                        if (item.id === action.payload.id) {
                            return action.payload;
                        } else {
                            return item;
                        }
                    },
                );
            }
        },
    },
});

export default chatSlice.reducer;
