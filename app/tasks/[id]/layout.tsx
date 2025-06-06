"use client";

import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { getTask } from "@/app/_http/API/tasksApi";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import { ProfileRoute } from "@/app/_utils/protectedRoutes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { id } = useParams<{ id: string }>();

    const { currentTask } = useTypesSelector((state) => state.taskReducer);
    const { updateCurrentTask } = taskSlice.actions;
    const dispatch = useTypesDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);

        if (!currentTask?.id || currentTask.id !== id) {
            const asyncFunc = async () => {
                const res = await getTask(id);

                if (res.status === 200) {
                    dispatch(updateCurrentTask(res.task!));
                } else {
                    router.replace("/exchange");
                }
            };
            asyncFunc();
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    }, [id]);

    if (isLoading)
        return (
            <ProfileRoute>
                <div className="centerContent">
                    <CustomOval />
                </div>
            </ProfileRoute>
        );

    return children;
}
