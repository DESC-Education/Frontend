"use client";

import { useEffect } from "react";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { useRouter } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isAuth } = useTypesSelector((state) => state.userReducer);
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuth) {
            if (typeof window !== "undefined") {
                router.replace("/");
            }
        }
    }, [isLoading, isAuth]);

    return children;
}
