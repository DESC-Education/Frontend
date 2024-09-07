"use client";

import classNames from "classnames";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import styles from "./layout.module.scss";
import ProfileNavMenu from "./ProfileNavMenu/ProfileNavMenu";
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
    const {
        user,
        isAuth,
        studentProfile,
        companyProfile,
        isProfileLoading,
    } = useTypesSelector((state) => state.userReducer);
    const { updateProfile, updateIsProfileLoading } = userSlice.actions;

    const dispatch = useTypesDispatch();
    const { isLoading } = useTypesSelector((state) => state.contentReducer);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuth) {
            if (typeof window !== "undefined") {
                router.replace("/");
            }
        }
    }, [isLoading, isAuth]);

    useEffect(() => {
        const asyncFunc = async () => {
            if (isAuth) {
                if (!studentProfile.id || !companyProfile) {
                    const profile = await getProfile();

                    console.log("profile in layout", profile);

                    if (profile.status === 200) {
                        console.log("УБРАТЬ КОСТЫЛЬНЫЙ level", profile);
                        dispatch(
                            updateProfile({
                                ...profile.profile!,
                                telegramLink: profile.profile!.telegramLink
                                    ? profile.profile!.telegramLink.slice(13)
                                    : undefined,
                                vkLink: profile.profile!.vkLink
                                    ? profile.profile!.vkLink.slice(15)
                                    : undefined,
                            }),
                        );
                    }
                    dispatch(updateIsProfileLoading(false));
                }
            }
        };
        asyncFunc();
        // console.log("studentProfile", studentProfile);
    }, [isAuth]);

    return (
        <div className="container">
            <div className={styles.container}>
                <ProfileNavMenu />
                {isProfileLoading ? (
                    <LoadingScreen />
                ) : (
                    <div className={styles.profileContent}>{children}</div>
                )}
            </div>
        </div>
    );
}
