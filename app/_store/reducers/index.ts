import { combineReducers } from "redux";
import userReducer from "./userSlice";
import contentReducer from "./contentSlice";
import taskReducer from "./taskSlice";
import profileVerifyReducer from "./profileVerifySlice";
import chatReducer from "./chatSlice";
import { enableMapSet } from "immer";
import { profile } from "console";

enableMapSet();

export const rootReducer = combineReducers({
    userReducer,
    contentReducer,
    chatReducer,
    taskReducer,
    profileVerifyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
