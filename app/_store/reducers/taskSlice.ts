import { ICategory, IFile, IFilter, ITask } from "@/app/_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TaskInterface = {
    tasks: ITask[] | null;
    categories: ICategory[] | null;
    currentTask: ITask | null;
};

const initialState: TaskInterface = {
    tasks: [
        {
            id: "",
            profile: { companyName: "", logoImg: "" } as any,
            title: "",
            description: "",
            deadline: "",
            createdAt: "",
            category: {} as ICategory,
            filtersId: [],
            isVerified: false,
            isSuspicious: false,
            isVisible: false,
            files: [],
            solutions: [],
        },
    ],
    categories: null,
    currentTask: null,
};

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        updateTasks(state, action: PayloadAction<{ tasks: ITask[] }>) {
            state.tasks = action.payload.tasks;
        },
        updateCategories(
            state,
            action: PayloadAction<{ categories: ICategory[] }>,
        ) {
            state.categories = action.payload.categories;
        },
        updateCurrentTask(state, action: PayloadAction<ITask | null>) {
            state.currentTask = action.payload;
        },
    },
});

export default taskSlice.reducer;
