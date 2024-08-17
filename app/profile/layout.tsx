"use client";

import classNames from "classnames";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import styles from "./layout.module.scss";
import ProfileNavMenu from "../_components/ProfileNavMenu/ProfileNavMenu";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useTypesSelector((state) => state.userReducer);

    return (
        <div className={classNames("container", styles.container)}>
            <ProfileNavMenu />
            <div className={styles.profileContent}>{children}</div>
        </div>
    );
}
