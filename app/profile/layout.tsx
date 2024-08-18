"use client";

import classNames from "classnames";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import styles from "./layout.module.scss";
import ProfileNavMenu from "../_components/ProfileNavMenu/ProfileNavMenu";
import { useRouter } from "next/navigation";
import LoadingScreen from "../_components/LoadingScreen/LoadingScreen";
import { use, useEffect, useRef } from "react";

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

    return (
        <>
            <div className={classNames("container", styles.container)}>
                <ProfileNavMenu />
                <div className={styles.profileContent}>{children}</div>
            </div>
        </>
    );
}
