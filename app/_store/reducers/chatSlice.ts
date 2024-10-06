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
        tryToAddChat: (state, action: PayloadAction<IChat>) => {
            console.log("in slice state.chats", { ...state.chats }, action.payload);

            if (
                state.chats?.length &&
                state.chats.filter((i) => i.id === action.payload.id).length ===
                    0
            ) {
                console.log("adding a chat...");
                
                state.chats.push(action.payload);
            }
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
        updateIsRead: (state, action: PayloadAction<IMessage[]>) => {
            if (state.currentChat) {
                const readIds = action.payload.map((i) => i.id);
                state.currentChat.messages = state.currentChat.messages.map(
                    (item) => {
                        if (readIds.includes(item.id)) {
                            return { ...item, isRead: true };
                        } else {
                            return item;
                        }
                    },
                );
            }
        },
        updateChatUnread: (
            state,
            action: PayloadAction<{ chatId: string; count: number }>,
        ) => {
            if (state.chats) {
                state.chats = state.chats.map((item) => {
                    if (item.id === action.payload.chatId) {
                        return {
                            ...item,
                            unreadCount: action.payload.count,
                        };
                    } else {
                        return item;
                    }
                });
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
        updateLastMessage: (
            state,
            action: PayloadAction<{
                chatId: string;
                message: IMessage;
                myMessage?: boolean;
            }>,
        ) => {
            if (state.chats) {
                state.chats = state.chats.map((item) => {
                    if (item.id === action.payload.chatId) {
                        if (action.payload.myMessage) {
                            return {
                                ...item,
                                lastMessage: action.payload.message,
                            };
                        } else {
                            return {
                                ...item,
                                lastMessage: {
                                    ...action.payload.message,
                                    user: {
                                        id: item.companion.id,
                                        avatar: "",
                                        name: "",
                                    },
                                },
                            };
                        }
                    } else {
                        return item;
                    }
                });
            }
        },
        logoutChats: (state) => {
            state.chats = null;
            state.currentChat = null;
        },
    },
});

export default chatSlice.reducer;
