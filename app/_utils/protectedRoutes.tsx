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
        // console.log(isLoading, isAuth, isProfileLoading, profileVerification, "___", typeof window !== "undefined" && !isLoading, !isAuth, isAuth &&
        //     !isProfileLoading &&
        //     profileVerification.status !== "verified");
        
        if (typeof window !== "undefined" && !isLoading) {
            if (!isAuth) {
                router.replace("/");
                return
            }
            if (
                isAuth &&
                !isProfileLoading &&
                profileVerification.status !== "verified"
            ) {
                router.replace("/profile");
                return
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
    const { isAuth } = useTypesSelector((state) => state.userReducer);
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && !isLoading) {
            if (!isAuth) {
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
