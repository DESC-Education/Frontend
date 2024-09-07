"use client";

import { useEffect } from "react";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";
import { getTasks } from "../_http/API/tasksApi";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        console.log("useEffect");
        const asyncFunc = async () => {
            const res = await getTasks();

            console.log("getTasks", res);
        };
        asyncFunc();
    }, []);

    // return children;
    return <ProfileRoute>{children}</ProfileRoute>;
}
