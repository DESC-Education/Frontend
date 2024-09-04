import { ICategory, ITask } from "@/app/_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type TaskInterface = {
    task: ITask;
};

const initialState: TaskInterface = {
    task: {
        id: "",
        company: {} as any,
        name: "",
        description: "",
        deadline: "",
        createdAt: "",
        category: {} as ICategory,
        isVerified: false,
        isSuspicious: false,
        isVisible: false,
        files: [],
    } as ITask,
};

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        updateTask(state, action: PayloadAction<{task: ITask}>) {
            state.task = action.payload.task;
            console.log("tsak state", JSON.stringify(state.task));
        },
    },
});

export default taskSlice.reducer;