import { IMessage } from "@/app/_types";
import { createSlice } from "@reduxjs/toolkit";

type ChatState = {
    messages: IMessage[];
    activeChatId: string | null;
};

const initialState: ChatState = {
    messages: [],
    activeChatId: null,
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        updateMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
});

export default chatSlice.reducer;
