import { combineReducers } from "redux";
import userReducer from "./userSlice";
import contentReducer from "./contentSlice";
import taskReducer from "./taskSlice";
// import chatReducer from "./chatSlice";
import { enableMapSet } from "immer";

enableMapSet();

export const rootReducer = combineReducers({
    userReducer,
    contentReducer,
    // chatReducer,
    taskReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
