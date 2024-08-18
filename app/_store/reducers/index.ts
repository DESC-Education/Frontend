import { combineReducers } from "redux";
import userReducer from "./userSlice";
import contentReducer from "./contentSlice";
import { enableMapSet } from "immer";

enableMapSet();

export const rootReducer = combineReducers({
    userReducer,
    contentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
