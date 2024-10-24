import { ICategory, IFile, IFilter, ISolution, ITask } from "@/app/_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TaskInterface = {
    tasks: ITask[] | null;
    categories: ICategory[] | null;
    currentTask: ITask | null;
};

const initialState: TaskInterface = {
    tasks: null,
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
        addCurrentTaskSolution(state, action: PayloadAction<ISolution>) {
            console.log("ghelo blyea", action.payload, {
                ...state.currentTask,
            });

            if (state.currentTask) {
                state.currentTask.solutions.push(action.payload);
            }
        },
        updateCurrentTaskSolution(state, action: PayloadAction<ISolution>) {
            console.log("ghelo blyea 2", action.payload, {
                ...state.currentTask,
            });

            if (
                state.currentTask &&
                state.currentTask.id === action.payload.task
            ) {
                state.currentTask.solutions = state.currentTask.solutions.map(
                    (item) => {
                        if (item.id === action.payload.id) {
                            return action.payload;
                        } else {
                            return item;
                        }
                    },
                );
            }
        },
        logoutTask(state) {
            state.tasks = null;
            state.categories = null;
            state.currentTask = null;
        },
    },
});

export default taskSlice.reducer;
