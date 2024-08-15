import { combineReducers } from "redux";
import userReducer from "./userSlice";
import { enableMapSet } from "immer";

enableMapSet();

export const rootReducer = combineReducers({
    userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
