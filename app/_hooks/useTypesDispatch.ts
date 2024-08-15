import { useDispatch } from "react-redux";
import { AppDispatch } from "../_store";

export const useTypesDispatch = useDispatch.withTypes<AppDispatch>()