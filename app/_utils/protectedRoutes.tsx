"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import CustomOval from "../_components/ui/CustomOval/CustomOval";

type RouteProps = {
    children: React.ReactNode;
};

export const ProfileRoute: FC<RouteProps> = ({ children }) => {
    const { profileVerification, isAuth, isProfileLoading } = useTypesSelector(
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
            if (
                isAuth &&
                !isProfileLoading &&
                profileVerification.status !== "verified"
            ) {
                router.replace("/profile");
                return;
            }
        }
    }, [isLoading, isAuth, isProfileLoading, profileVerification]);

    if (isLoading || isProfileLoading) {
        return (
            <div suppressHydrationWarning className="centerContent">
                <CustomOval />
            </div>
        );
    }

    return children;
};

export const AuthRoute: FC<RouteProps> = ({ children }) => {
    const { isAuth, user } = useTypesSelector((state) => state.userReducer);
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && !isLoading) {
            if (!isAuth || !["student", "company"].includes(user.role)) {
                router.replace("/");
                return;
            }
        }
    }, [isLoading, isAuth]);

    if (isLoading) {
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );
    }

    return children;
};


export const AdminRoute: FC<RouteProps> = ({ children }) => {
    const { isAuth, user } = useTypesSelector((state) => state.userReducer);
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && !isLoading) {
            if (!isAuth || user.role !== "admin") {
                router.replace("/");
                return;
            }
        }
    }, [isLoading, isAuth]);

    if (isLoading) {
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );
    }

    return children;
};
