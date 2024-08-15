import { useDispatch } from "react-redux";
import { AppDispatch } from "../_store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()