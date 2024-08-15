import { useSelector } from "react-redux";
import { RootState } from "../_store";

export const useAppSelector = useSelector.withTypes<RootState>()