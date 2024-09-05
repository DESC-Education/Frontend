"use client";

import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import styles from "./ProfileNavMenu.module.scss";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { useContext, useMemo, useState } from "react";
import { ModalContext } from "@/app/_context/ModalContext";
import { AlertContext } from "@/app/_context/AlertContext";
import { read } from "fs";
import { changeLogo } from "@/app/_http/API/profileApi";

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
    const {
        user,
        profileVerification,
        companyProfile,
        studentProfile,
    } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const {
        logoutUser,
        updateStudentProfile,
        updateCompanyProfile,
    } = userSlice.actions;
    const { showAlert } = useContext(AlertContext);

    if (!user) return null;

    const pathname = usePathname();

    const changeLogoHandler = () => {
        if (profileVerification.status !== "verified") return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg";
        input.click();
        input.onchange = async (e: any) => {
            const file = e.target.files![0];
            if (!["png", "jpg", "jpeg"].includes(file.type.split("/")[1])) {
                showAlert("Формат файла не поддерживается");
                return;
            }

            const formdata = new FormData();
            formdata.append("logo", file);

            const res = await changeLogo(formdata);

            if (res.status === 200) {
                showAlert("Фото успешно обновлено", "success");

                if (user.role === "student") {
                    dispatch(
                        updateStudentProfile({
                            ...studentProfile,
                            logoImg: res.logo!,
                        }),
                    );
                } else {
                    dispatch(
                        updateCompanyProfile({
                            ...companyProfile,
                            logoImg: res.logo!,
                        }),
                    );
                }
            } else {
                showAlert(res.message);
            }
        };
    };

    const activeProfile = useMemo(() => {
        if (user.role === "student") {
            return studentProfile;
        } else {
            return companyProfile;
        }
    }, [
        user.role,
        studentProfile.logoImg,
        companyProfile.logoImg,
        profileVerification.status,
    ]);

    return (
        <div className={styles.container}>
            <div
                onClick={() => changeLogoHandler()}
                className={classNames(styles.avatar, {
                    [styles.editable]:
                        profileVerification.status === "verified",
                })}
            >
                <img
                    className={classNames(styles.avatarImg)}
                    src={
                        activeProfile.logoImg
                            ? process.env.NEXT_PUBLIC_ASSETS_PATH +
                              activeProfile.logoImg
                            : "/images/avatar.png"
                    }
                    alt="avatar"
                />
                {profileVerification.status === "verified" && (
                    <img
                        className={styles.edit}
                        src="/icons/edit.svg"
                        alt="edit"
                    />
                )}
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
