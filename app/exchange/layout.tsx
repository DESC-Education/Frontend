"use client";

import { useEffect } from "react";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { useRouter } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isProfileVerified, user, isAuth } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && !isLoading) {
            if (!isAuth) {
                router.replace("/");
                return;
            }
            if (isAuth && !isProfileVerified) {
                router.replace("/profile");
                return;
            }
        }
    }, [isLoading, isAuth, isProfileVerified]);

    return children;
}
