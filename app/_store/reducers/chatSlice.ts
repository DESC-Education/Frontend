import { IChat, IMessage, ISolution } from "@/app/_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatState = {
    chats: IChat[] | null;
    currentChat: IChat | null;
    unreadChatsCount: number;
};

const initialState: ChatState = {
    chats: null,
    currentChat: null,
    unreadChatsCount: 0,
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
        updateUnreadChatsCount(
            state,
            action: PayloadAction<{ chat_id?: string; number?: number }>,
        ) {
            if (action.payload.number !== undefined) {
                state.unreadChatsCount = action.payload.number;
                return;
            }

            if (!state.chats) return;

            state.unreadChatsCount = state.chats?.filter(
                (i) => i.id !== action.payload.chat_id && i.unreadCount,
            ).length;
        },
        tryToAddChat: (state, action: PayloadAction<IChat>) => {
            if (!state.chats) {
                state.chats = [action.payload];
                return;
            }

            if (
                state.chats?.length &&
                state.chats.filter((i) => i.id === action.payload.id).length
            )
                return;

            state.chats.push(action.payload);
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
        updateIsRead: (state, action: PayloadAction<string>) => {
            if (state.currentChat) {
                state.currentChat.messages = state.currentChat.messages.map(
                    (item) => {
                        if (item.id === action.payload) {
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
        updateLastMessageViewed: (state, action: PayloadAction<string>) => {
            // console.log(
            //     "updateLastMessageViewed in chat",
            //     action.payload,
            //     state.chats?.find((i) => i.id === action.payload),
            // );

            if (state.chats) {
                state.chats = state.chats.map((item) => {
                    if (item.id === action.payload) {
                        return {
                            ...item,
                            lastMessage: {
                                ...item.lastMessage,
                                isRead: true,
                            },
                        };
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
