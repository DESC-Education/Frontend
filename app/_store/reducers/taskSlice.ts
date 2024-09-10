import { ICategory, IFile, IFilter, ITask } from "@/app/_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TaskInterface = {
    tasks: ITask[] | null;
    categories: ICategory[] | null;
};

const initialState: TaskInterface = {
    tasks: [
        {
            id: "",
            company: {} as any,
            name: "",
            description: "",
            deadline: "",
            createdAt: "",
            category: {} as ICategory,
            filtersId: [],
            isVerified: false,
            isSuspicious: false,
            isVisible: false,
            files: [],
        },
    ],
    categories: null,
};

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        updateTasks(state, action: PayloadAction<{ task: ITask[] }>) {
            state.tasks = action.payload.task;
        },
        updateCategories(
            state,
            action: PayloadAction<{ categories: ICategory[] }>,
        ) {
            state.categories = action.payload.categories;
        },
    },
});

export default taskSlice.reducer;
