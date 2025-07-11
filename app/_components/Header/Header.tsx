"use client";import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "../ui/Button/Button";
import AuthModal from "../modals/AuthModal/AuthModal";
import React, {
    createRef,
    ReactNode,
    RefObject,
    use,
    useContext,
    useEffect,
    useState,
} from "react";
import { ModalContext } from "@/app/_context/ModalContext";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import Link from "next/link";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { set } from "zod";
import SelectSearch from "react-select-search";
import Dropdown from "../ui/DropDown/DropDown";
import InfoIcon from "../ui/InfoIcon/InfoIcon";
import { AlertContext } from "@/app/_context/AlertContext";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { get } from "http";
import { on } from "events";
import { profileVerifySlice } from "@/app/_store/reducers/profileVerifySlice";
import { chatSlice } from "@/app/_store/reducers/chatSlice";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import NotificationsModal from "../modals/NotificationsModal/NotificationsModal";
import UserContent from "./UserContent/UserContent";
import LocalStorage from "@/app/_utils/LocalStorage";

type RoleState = "student" | "company" | "u_admin" | "moderator" | "admin";

const Header = () => {
    const { showModal } = useContext(ModalContext);
    const { isAuth, studentProfile } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { user, isProfileLoading, profileVerification } = useTypesSelector(
        (user) => user.userReducer,
    );
    const { notifications } = useTypesSelector((state) => state.contentReducer);

    const pathname = usePathname();

    const [activeState, setActiveState] = useState<RoleState>(user?.role);

    const options = [
        {
            label: "Студентов",
            value: "students",
            href: "/admin-panel/verification/students",
        },
        {
            label: "Компаний",
            value: "companies",
            href: "/admin-panel/verification/companies",
        },
    ];

    const optionsForInstitutesModerator = [
        {
            label: "Студентов",
            value: "students",
            href: "/admin-panel/verification/students",
        },
    ];

    const [isShowNotificationsModal, setIsShowNotificationsModal] =
        useState<boolean>(false);

    const [activeNotification, setActiveNotification] = useState<
        string | undefined
    >();

    const { sortNotifications } = contentSlice.actions;

    useEffect(() => {
        if (isShowNotificationsModal) {
            dispatch(sortNotifications());
            setActiveNotification(undefined);
        }
    }, [isShowNotificationsModal]);

    const changeMenuVisibility = (val?: boolean) => {
        if (val === undefined) {
            setIsOpen((prev) => !prev);

            if (isOpen) {
                document.body.classList.remove("modal-opened");
            } else {
                document.body.classList.add("modal-opened");
            }
        } else {
            setIsOpen(val);

            if (val) {
                document.body.classList.add("modal-opened");
            } else {
                document.body.classList.remove("modal-opened");
            }
        }
    };

    useEffect(() => {
        setActiveState(user?.role);
    }, [user?.role]);

    const getHeaderContent = (
        activeState: RoleState,
    ): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>;
    } => {
        switch (activeState) {
            // case "student":
            case "student":
                return {
                    content: (
                        <UserContent
                            isMobile={isMobile}
                            logout={logout}
                            profileVerification={profileVerification}
                        />
                    ),
                    ref: createRef(),
                };
            case "company":
                return {
                    content: (
                        <UserContent
                            isMobile={isMobile}
                            logout={logout}
                            profileVerification={profileVerification}
                        />
                    ),
                    ref: createRef(),
                };
            case "u_admin":
                return {
                    content: (
                        <>
                            <div className={styles.navigation}>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                        {
                                            [styles.active]:
                                                pathname ===
                                                "/admin-panel/chats",
                                        },
                                    )}
                                    href="/admin-panel/chats">
                                    Чаты
                                </Link>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                        {
                                            [styles.active]:
                                                pathname ===
                                                "/admin-panel/statistics",
                                        },
                                    )}
                                    href="/admin-panel/statistics">
                                    Статистика
                                </Link>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        {
                                            [styles.active]:
                                                pathname.startsWith(
                                                    "/admin-panel/verification",
                                                ),
                                        },
                                        "text fz24 fw500",
                                    )}
                                    href="/admin-panel/verification/students">
                                    Верификация студентов
                                </Link>
                                <Link
                                    className={classNames(styles.link, "text fz24 fw500", {
                                        [styles.active]: pathname.startsWith("/vacancies"),
                                    })}
                                    href="/vacancies"
                                >
                                    Вакансии
                                </Link>
                                <p
                                    onClick={() => {
                                        logout();
                                        showAlert(
                                            "Вы успешно вышли из аккаунта!",
                                            "success",
                                        );
                                    }}
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                    )}>
                                    Выйти
                                </p>
                            </div>
                        </>
                    ),
                    ref: createRef(),
                };
            // case "moderator":
            case "moderator":
                return {
                    content: (
                        <>
                            <div className={styles.navigation}>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                        {
                                            [styles.active]:
                                                pathname ===
                                                "/admin-panel/chats",
                                        },
                                    )}
                                    href="/admin-panel/chats">
                                    Чаты
                                </Link>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                        {
                                            [styles.active]:
                                                pathname ===
                                                "/admin-panel/statistics",
                                        },
                                    )}
                                    href="/admin-panel/statistics">
                                    Статистика
                                </Link>
                                <div
                                    className={classNames(styles.link, {
                                        [styles.active]: pathname.startsWith(
                                            "/admin-panel/verification",
                                        ),
                                    })}>
                                    <Dropdown
                                        options={options}
                                        placeholder="Верификация"
                                    />
                                </div>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                    )}
                                    href="/profile">
                                    Выйти
                                </Link>
                            </div>
                        </>
                    ),
                    ref: createRef(),
                };
            // case "admin":
            case "admin":
                return {
                    content: (
                        <div className={styles.navigation}>
                            <Link
                                className={classNames(
                                    styles.link,
                                    "text fz24 fw500",
                                    {
                                        [styles.active]:
                                            pathname ===
                                            "/admin-panel/statistics",
                                    },
                                )}
                                href="/admin-panel/statistics">
                                Статистика
                            </Link>
                            <Link
                                className={classNames(
                                    styles.link,
                                    "text fz24 fw500",
                                    {
                                        [styles.active]:
                                            pathname ===
                                            "/admin-panel/students-list",
                                    },
                                )}
                                href="/admin-panel/students-list">
                                Студенты
                            </Link>
                            <Link
                                className={classNames(
                                    styles.link,
                                    "text fz24 fw500",
                                    {
                                        [styles.active]:
                                            pathname ===
                                            "/admin-panel/companies-list",
                                    },
                                )}
                                href="/admin-panel/companies-list">
                                Компании
                            </Link>
                            <div
                                className={classNames(styles.link, {
                                    [styles.active]: pathname.startsWith(
                                        "/admin-panel/verification",
                                    ),
                                })}>
                                <Dropdown
                                    options={options}
                                    placeholder="Верификация"
                                />
                            </div>
                            <p
                                className={classNames(
                                    styles.link,
                                    "text fz24 fw500",
                                )}
                                onClick={() => {
                                    dispatch(logoutContent());
                                    dispatch(logoutUser());
                                    showAlert(
                                        "Вы вышли из аккаунта!",
                                        "success",
                                    );
                                }}>
                                Выйти
                            </p>
                        </div>
                    ),
                    ref: createRef(),
                };
        }
    };

    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsShowNotificationsModal(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { showAlert } = useContext(AlertContext);
    const dispatch = useTypesDispatch();
    const { logoutUser } = userSlice.actions;
    const { logoutTask } = taskSlice.actions;
    const { logoutContent } = contentSlice.actions;
    const { logoutProfileVerify } = profileVerifySlice.actions;
    const { logoutChats } = chatSlice.actions;

    const logout = () => {
        dispatch(logoutUser());
        dispatch(logoutTask());
        dispatch(logoutContent());
        dispatch(logoutProfileVerify());
        dispatch(logoutChats());
    };

    if (!getHeaderContent(activeState)) setActiveState("student");

    return (
        <>
            {isMobile ? (
                <div
                    className={classNames(styles.header, {
                        [styles.open]: isOpen,
                    })}>
                    <div className={classNames(styles.container)}>
                        <Link href="/">
                            <img
                                className={classNames(
                                    "text pointer",
                                    styles.logo,
                                    {
                                        [styles.open]: isOpen,
                                    },
                                )}
                                src="/icons/headerLogo.svg"
                                alt="logo"
                            />
                        </Link>
                        {isAuth && (
                            <div
                                className={classNames(styles.notifications, {
                                    [styles.hide]: isOpen,
                                })}>
                                <span
                                    className={styles.notification}
                                    onClick={() =>
                                        setIsShowNotificationsModal(
                                            (prev) => !prev,
                                        )
                                    }>
                                    {notifications &&
                                        notifications.filter((i) => !i.isRead)
                                            .length > 0 && (
                                            <span className={styles.unread}>
                                                {
                                                    notifications.filter(
                                                        (i) => !i.isRead,
                                                    ).length
                                                }
                                            </span>
                                        )}
                                    <img
                                        className={styles.icon}
                                        src="/icons/notification.svg"
                                        alt="notification"
                                    />
                                </span>
                                <div
                                    className={classNames(
                                        styles.notificationModal,
                                        {
                                            [styles.active]:
                                                isShowNotificationsModal,
                                        },
                                    )}>
                                    <NotificationsModal
                                        active={activeNotification}
                                        setActive={setActiveNotification}
                                        closeModal={() =>
                                            setIsShowNotificationsModal(false)
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            className={classNames(styles.burgerButton, {
                                [styles.open]: isOpen,
                            })}
                            onClick={() => changeMenuVisibility()}>
                            <span className={styles.burgerLine}></span>
                            <span className={styles.burgerLine}></span>
                            <span className={styles.burgerLine}></span>
                        </button>
                        <div
                            className={classNames(styles.burgerMenu, {
                                [styles.open]: isOpen,
                            })}>
                            <div className={styles.burgerList}>
                                {isAuth ? (
                                    <div
                                        className={classNames(
                                            styles.clickItems,
                                            // {[styles.disabled]: !(profileVerification.status === "verified")},
                                        )}
                                        onClick={() =>
                                            changeMenuVisibility(false)
                                        }>
                                        {getHeaderContent(activeState).content}
                                    </div>
                                ) : (
                                    <div
                                        className={styles.clickItems}
                                        onClick={() =>
                                            changeMenuVisibility(false)
                                        }>
                                        <div className={styles.linkContainer}>
                                            <Link
                                                className={classNames(
                                                    styles.link,
                                                    "text fz24 fw500",
                                                    {
                                                        [styles.active]: pathname === "/vacancies",
                                                    }
                                                )}
                                                href="/vacancies"
                                            >
                                                Вакансии
                                            </Link>
                                        </div>
                                        <div className={styles.linkContainer}>
                                            <div
                                                onClick={() =>
                                                    showModal({
                                                        content: (
                                                            <AuthModal initModalState="login" />
                                                        ),
                                                    })
                                                }
                                                className={classNames(
                                                    styles.link,
                                                    "text fz24 fw500",
                                                )}>
                                                Вход
                                            </div>
                                        </div>
                                        <div className={styles.linkContainer}>
                                            <div
                                                onClick={() =>
                                                    showModal({
                                                        content: (
                                                            <AuthModal initModalState="reg" />
                                                        ),
                                                    })
                                                }
                                                className={classNames(
                                                    styles.link,
                                                    "text fz24 fw500",
                                                )}>
                                                Регистрация
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={classNames(styles.header)}>
                    <div className={classNames("container", styles.container)}>
                        <Link href="/">
                            <img
                                className={classNames(
                                    "text pointer",
                                    styles.logo,
                                )}
                                src="/icons/headerLogo.svg"
                                alt="logo"
                            />
                        </Link>

                        {isAuth ? (
                            getHeaderContent(activeState).content
                        ) : (
                            <nav>
                                <div className={styles.navList}>
                                    <Link
                                        className={classNames(
                                            styles.link,
                                            "text fz24 fw500",
                                            {
                                                [styles.active]: pathname === "/vacancies",
                                            }
                                        )}
                                        href="/vacancies"
                                    >
                                        Вакансии
                                    </Link>
                                    <Button
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <AuthModal initModalState="login" />
                                                ),
                                            })
                                        }
                                        type="primary">
                                        Вход
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <AuthModal initModalState="reg" />
                                                ),
                                            })
                                        }
                                        type="secondary">
                                        Регистрация
                                    </Button>
                                </div>
                            </nav>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
