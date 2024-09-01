"use client";

import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import styles from "./ProfileNavMenu.module.scss";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { useContext } from "react";
import { ModalContext } from "@/app/_context/ModalContext";
import { AlertContext } from "@/app/_context/AlertContext";

const studentPages = [
    {
        name: "Профиль",
        path: "/profile",
    },
    {
        name: "Настройки",
        path: "/profile/settings",
    },
    {
        name: "История заданий",
        path: "/profile/tasks",
    },
];

const companyPages = [
    {
        name: "Профиль",
        path: "/profile",
    },
    {
        name: "Настройки",
        path: "/profile/settings",
    },
    {
        name: "Мои задания",
        path: "/profile/tasks",
    },
];

const ProfileNavMenu = () => {
    const { user } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const { logoutUser } = userSlice.actions;
    const { showAlert } = useContext(AlertContext);

    if (!user) return null;

    const pathname = usePathname();

    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <img
                    className={styles.avatarImg}
                    src="https://avatars.githubusercontent.com/u/10198962"
                    alt="avatar"
                />
                <img className={styles.edit} src="/icons/edit.svg" alt="edit" />
            </div>
            <p className={classNames("text fz20 gray", styles.mail)}>
                {user.email || "example@mail.com"}
            </p>
            <div className={styles.pages}>
                {user.role === "student"
                    ? studentPages.map((page) => (
                          <Link
                              key={page.name}
                              className={classNames(
                                  "text fz32 white",
                                  styles.page,
                                  {
                                      [styles.active]: page.path === pathname,
                                  },
                              )}
                              href={page.path}
                          >
                              <span
                                  className={classNames(styles.activePanel, {
                                      [styles.active]: page.path === pathname,
                                  })}
                              ></span>
                              <p className={styles.text}>{page.name}</p>
                          </Link>
                      ))
                    : companyPages.map((page) => (
                          <Link
                              key={page.name}
                              className={classNames(
                                  "text fz32 white",
                                  styles.page,
                                  {
                                      [styles.active]: page.path === pathname,
                                  },
                              )}
                              href={page.path}
                          >
                              <span
                                  className={classNames(styles.activePanel, {
                                      [styles.active]: page.path === pathname,
                                  })}
                              ></span>
                              <p className={styles.text}>{page.name}</p>
                          </Link>
                      ))}
            </div>
            <p
                onClick={() => {
                    dispatch(logoutUser());
                    showAlert("Вы вышли из аккаунта!", "success");
                }}
                className={classNames(styles.logout, "text fz32 under white")}
            >
                Выход
            </p>
        </div>
    );
};

export default ProfileNavMenu;
