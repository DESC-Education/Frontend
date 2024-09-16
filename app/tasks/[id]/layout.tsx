"use client";

import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { getTask } from "@/app/_http/API/tasksApi";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { id } = useParams();

    const { tasks } = useTypesSelector((state) => state.taskReducer);
    const { updateCurrentTask } = taskSlice.actions;
    const dispatch = useTypesDispatch();

    useEffect(() => {
        const asyncFunc = async () => {
            // if (tasks && tasks.length > 0) {
            //     if (tasks.find((item) => item.id === id)) {
            //         dispatch(
            //             updateCurrentTask(
            //                 tasks.find((item) => item.id === id)!,
            //             ),
            //         );
            //     } else {
            //         if (typeof id === "string") {
            //             const res = await getTask(id);

            //             console.log(res);

            //             if (res.status === 200) {
            //                 dispatch(updateCurrentTask(res.task!));
            //             }
            //         }
            //     }
            // }
            if (typeof id === "string") {
                const res = await getTask(id);

                console.log(res);

                if (res.status === 200) {
                    dispatch(updateCurrentTask(res.task!));
                }
            }
        };
        asyncFunc();
    }, []);

    return children;
}
