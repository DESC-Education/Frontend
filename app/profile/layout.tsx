"use client";

import { useTypesSelector } from "../_hooks/useTypesSelector";
import styles from "./layout.module.scss";
import ProfileNavMenu from "./ProfileNavMenu/ProfileNavMenu";
import { usePathname, useRouter } from "next/navigation";
import LoadingScreen from "../_components/LoadingScreen/LoadingScreen";
import { useContext, useEffect, useState } from "react";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { contentSlice } from "../_store/reducers/contentSlice";
import { AlertContext } from "../_context/AlertContext";
import { AuthRoute } from "../_utils/protectedRoutes";
import useEffectDebugger from "../_hooks/useEffectDebugger";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {
        isAuth,
        studentProfile,
        companyProfile,
        isProfileLoading,
        profileVerification,
    } = useTypesSelector((state) => state.userReducer);

    const dispatch = useTypesDispatch();
    const { isLoading, isProfileInfoChanged } = useTypesSelector(
        (state) => state.contentReducer,
    );
    const router = useRouter();

    const { showAlert } = useContext(AlertContext);

    const { updateIsProfileInfoChanged } = contentSlice.actions;

    const pathname = usePathname();
    const [oldPathname, setOldPathname] = useState<string>("");

    useEffect(() => {
        if (
            pathname !== "/profile/settings" &&
            isProfileInfoChanged?.current &&
            oldPathname === "profile"
        ) {
            showAlert("Изменения не сохранены!", "warning");
        }
        return () => {
            setOldPathname(pathname);
        };
    }, [pathname]);

    useEffect(() => {
        if (
            (!studentProfile.id && !companyProfile.id) ||
            isProfileLoading ||
            isProfileInfoChanged?.current === undefined ||
            profileVerification.status !== "verified"
        ) {
            dispatch(updateIsProfileInfoChanged(false));
            return;
        }

        dispatch(updateIsProfileInfoChanged(true));

        return () => {
            dispatch(updateIsProfileInfoChanged(undefined));
        };
    }, [
        studentProfile.description,
        studentProfile.phoneVisibility,
        studentProfile.emailVisibility,
        studentProfile.telegramLink,
        studentProfile.vkLink,
        studentProfile.skills.length,
        studentProfile.profession,

        companyProfile.description,
        companyProfile.phoneVisibility,
        companyProfile.emailVisibility,
        companyProfile.telegramLink,
        companyProfile.vkLink,
        companyProfile.linkToCompany,
        companyProfile.skills.length,

        isProfileLoading,
        profileVerification,
    ]);

    return (
        <AuthRoute>
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
        </AuthRoute>
    );
}
