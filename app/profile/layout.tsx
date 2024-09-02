"use client";

import classNames from "classnames";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import styles from "./layout.module.scss";
import ProfileNavMenu from "../_components/ProfileNavMenu/ProfileNavMenu";
import { useRouter } from "next/navigation";
import LoadingScreen from "../_components/LoadingScreen/LoadingScreen";
import { use, useEffect, useRef } from "react";
import Header from "../_components/Header/Header";
import { getProfile } from "../_http/API/profileApi";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { userSlice } from "../_store/reducers/userSlice";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isAuth } = useTypesSelector((state) => state.userReducer);
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();
    const dispatch = useTypesDispatch();
    const { updateProfile } = userSlice.actions;

    useEffect(() => {
        if (!isLoading && !isAuth) {
            if (typeof window !== "undefined") {
                router.replace("/");
            }
        }
    }, [isLoading, isAuth]);

    // useEffect(() => {
    //     const asyncFunc = async () => {
    //         const res = await getProfile();

    //         console.log(res);

    //         if (res.status === 200) {
    //             dispatch(updateProfile(res.profile));
    //         }
    //     };
    //     asyncFunc();
    // }, []);

    return (
        <div className="container">
            <div className={styles.container}>
                <ProfileNavMenu />
                <div className={styles.profileContent}>{children}</div>
            </div>
        </div>
    );
}
