"use client";

import { useEffect } from "react";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";
import { getCategories, getTasks } from "../_http/API/tasksApi";
import { taskSlice } from "../_store/reducers/taskSlice";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { updateCategories, updateTasks } = taskSlice.actions;
    const dispatch = useTypesDispatch();

    useEffect(() => {
        const asyncFunc = async () => {
            const categories = await getCategories();
            if (categories.status === 200) {
                dispatch(
                    updateCategories({ categories: categories.categories! }),
                );
            }
        };
        asyncFunc();
    }, []);

    // return children;
    return <ProfileRoute>{children}</ProfileRoute>;
}
