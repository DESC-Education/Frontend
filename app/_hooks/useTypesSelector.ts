"use client";

import { useSelector } from "react-redux";
import { RootState } from "../_store";

export const useTypesSelector = useSelector.withTypes<RootState>()