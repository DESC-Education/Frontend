"use client";

import Image from "next/image";
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

type RoleState =
    | "student"
    | "company"
    | "institute_moderator"
    | "moderator"
    | "admin";

const Header = () => {
    const { showModal } = useContext(ModalContext);
    const { isAuth, studentProfile } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { user, isProfileLoading, profileVerification } = useTypesSelector(
        (user) => user.userReducer,
    );

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
        {
            label: "Заданий",
            value: "tasks",
            href: "/admin-panel/verification/tasks",
        },
    ];

    const changeMenuVisibility = (val?: boolean) => {
        console.log("in change", val, document.body.classList);

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
                        <>
                            <div className={styles.navigation}>
                                <div className={styles.linkContainer}>
                                    {profileVerification.status !==
                                    "verified" ? (
                                        <InfoIcon
                                            className={styles.infoIcon}
                                            tooltipContent={
                                                <div
                                                    className={
                                                        styles.tooltipContent
                                                    }
                                                >
                                                    Для доступа к бирже
                                                    необходимо подтвердить
                                                    профиль
                                                    <Button type="primary">
                                                        Инструкция
                                                    </Button>
                                                </div>
                                            }
                                            toggleContent={
                                                <Link
                                                    style={{
                                                        pointerEvents: "none",
                                                    }}
                                                    className={classNames(
                                                        styles.link,
                                                        "text fz24 fw500",
                                                        {
                                                            [styles.active]:
                                                                pathname ===
                                                                "/exchange",
                                                        },
                                                    )}
                                                    href="/exchange"
                                                >
                                                    Биржа
                                                </Link>
                                            }
                                            action="tooltip"
                                        />
                                    ) : (
                                        <Link
                                            style={{
                                                pointerEvents:
                                                    profileVerification.status ===
                                                    "verified"
                                                        ? "all"
                                                        : "none",
                                            }}
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname ===
                                                        "/exchange",
                                                },
                                            )}
                                            href="/exchange"
                                        >
                                            Биржа
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.linkContainer}>
                                    {profileVerification.status !==
                                    "verified" ? (
                                        <InfoIcon
                                            className={styles.infoIcon}
                                            tooltipContent={
                                                <div
                                                    className={
                                                        styles.tooltipContent
                                                    }
                                                >
                                                    Для доступа к сообщениям
                                                    необходимо подтвердить
                                                    профиль
                                                    <Button type="primary">
                                                        Инструкция
                                                    </Button>
                                                </div>
                                            }
                                            toggleContent={
                                                <Link
                                                    style={{
                                                        pointerEvents: "none",
                                                    }}
                                                    className={classNames(
                                                        styles.link,
                                                        "text fz24 fw500",
                                                    )}
                                                    href="/chat"
                                                >
                                                    Сообщения
                                                </Link>
                                            }
                                            action="tooltip"
                                        />
                                    ) : (
                                        <Link
                                            style={{
                                                pointerEvents:
                                                    profileVerification.status ===
                                                    "verified"
                                                        ? "all"
                                                        : "none",
                                            }}
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/chat",
                                                    [styles.disabled]:
                                                        profileVerification.status !==
                                                        "verified",
                                                },
                                            )}
                                            href="/chat"
                                        >
                                            Сообщения
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.linkContainer}>
                                    <Link
                                        className={classNames(
                                            styles.link,
                                            "text fz24 fw500",
                                            {
                                                [styles.active]:
                                                    pathname === "/faq",
                                            },
                                        )}
                                        href="/faq"
                                    >
                                        FAQ
                                    </Link>
                                </div>
                            </div>
                            {isMobile ? (
                                <>
                                    <div className={styles.linkContainer}>
                                        <Link
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/faq",
                                                },
                                            )}
                                            href="/profile"
                                        >
                                            Профиль
                                        </Link>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.linkContainer,
                                            styles.subLinkContainer,
                                        )}
                                    >
                                        <Link
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/faq",
                                                },
                                            )}
                                            href="/profile/settings"
                                        >
                                            Настройки
                                        </Link>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.linkContainer,
                                            styles.subLinkContainer,
                                            styles.lastSubLinkContainer,
                                        )}
                                    >
                                        <Link
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/faq",
                                                },
                                            )}
                                            href="/profile/tasks"
                                        >
                                            История заданий
                                        </Link>
                                    </div>
                                    <div className={styles.linkContainer}>
                                        <p
                                            onClick={() => {
                                                dispatch(logoutUser());
                                                showAlert(
                                                    "Вы вышли из аккаунта!",
                                                    "success",
                                                );
                                            }}
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500 under",
                                            )}
                                        >
                                            Выход
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.icons}>
                                    <Link href="/profile">
                                        <Image
                                            width={45}
                                            height={45}
                                            src="/icons/profile.svg"
                                            alt="profile"
                                        />
                                    </Link>
                                    <span>
                                        <Image
                                            width={45}
                                            height={45}
                                            src="/icons/notification.svg"
                                            alt="notification"
                                        />
                                    </span>
                                </div>
                            )}
                        </>
                    ),
                    ref: createRef(),
                };
            //case "company":
            case "company":
                return {
                    content: (
                        <>
                            <div className={styles.navigation}>
                                <div className={styles.linkContainer}>
                                    {profileVerification.status !==
                                    "verified" ? (
                                        <InfoIcon
                                            className={styles.infoIcon}
                                            tooltipContent={
                                                <div
                                                    className={
                                                        styles.tooltipContent
                                                    }
                                                >
                                                    Для доступа к бирже
                                                    необходимо подтвердить
                                                    профиль
                                                    <Button type="primary">
                                                        Инструкция
                                                    </Button>
                                                </div>
                                            }
                                            toggleContent={
                                                <Link
                                                    style={{
                                                        pointerEvents: "none",
                                                    }}
                                                    className={classNames(
                                                        styles.link,
                                                        "text fz24 fw500",
                                                        {
                                                            [styles.active]:
                                                                pathname ===
                                                                "/exchange",
                                                        },
                                                    )}
                                                    href="/exchange"
                                                >
                                                    Биржа
                                                </Link>
                                            }
                                            action="tooltip"
                                        />
                                    ) : (
                                        <Link
                                            style={{
                                                pointerEvents:
                                                    profileVerification.status ===
                                                    "verified"
                                                        ? "all"
                                                        : "none",
                                            }}
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname ===
                                                        "/exchange",
                                                },
                                            )}
                                            href="/exchange"
                                        >
                                            Биржа
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.linkContainer}>
                                    {profileVerification.status !==
                                    "verified" ? (
                                        <InfoIcon
                                            className={styles.infoIcon}
                                            tooltipContent={
                                                <div
                                                    className={
                                                        styles.tooltipContent
                                                    }
                                                >
                                                    Для доступа к сообщениям
                                                    необходимо подтвердить
                                                    профиль
                                                    <Button type="primary">
                                                        Инструкция
                                                    </Button>
                                                </div>
                                            }
                                            toggleContent={
                                                <Link
                                                    style={{
                                                        pointerEvents: "none",
                                                    }}
                                                    className={classNames(
                                                        styles.link,
                                                        "text fz24 fw500",
                                                    )}
                                                    href="/chat"
                                                >
                                                    Сообщения
                                                </Link>
                                            }
                                            action="tooltip"
                                        />
                                    ) : (
                                        <Link
                                            style={{
                                                pointerEvents:
                                                    profileVerification.status ===
                                                    "verified"
                                                        ? "all"
                                                        : "none",
                                            }}
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/chat",
                                                    [styles.disabled]:
                                                        profileVerification.status !==
                                                        "verified",
                                                },
                                            )}
                                            href="/chat"
                                        >
                                            Сообщения
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.linkContainer}>
                                    <Link
                                        className={classNames(
                                            styles.link,
                                            "text fz24 fw500",
                                            {
                                                [styles.active]:
                                                    pathname === "/faq",
                                            },
                                        )}
                                        href="/faq"
                                    >
                                        FAQ
                                    </Link>
                                </div>
                            </div>
                            {isMobile ? (
                                <>
                                    <div
                                        className={classNames(
                                            styles.linkContainer,
                                            styles.linkGroupHeader,
                                        )}
                                    >
                                        <Link
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/faq",
                                                },
                                            )}
                                            href="/profile"
                                        >
                                            Профиль
                                        </Link>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.linkContainer,
                                            styles.subLinkContainer,
                                        )}
                                    >
                                        <Link
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/faq",
                                                },
                                            )}
                                            href="/profile/settings"
                                        >
                                            Настройки
                                        </Link>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.linkContainer,
                                            styles.subLinkContainer,
                                            styles.lastSubLinkContainer,
                                        )}
                                    >
                                        <Link
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500",
                                                {
                                                    [styles.active]:
                                                        pathname === "/faq",
                                                },
                                            )}
                                            href="/profile/tasks"
                                        >
                                            Мои задания
                                        </Link>
                                    </div>
                                    <div className={styles.linkContainer}>
                                        <p
                                            onClick={() => {
                                                dispatch(logoutUser());
                                                showAlert(
                                                    "Вы вышли из аккаунта!",
                                                    "success",
                                                );
                                            }}
                                            className={classNames(
                                                styles.link,
                                                "text fz24 fw500 under",
                                            )}
                                        >
                                            Выход
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.icons}>
                                    <Link href="/profile">
                                        <Image
                                            width={45}
                                            height={45}
                                            src="/icons/profile.svg"
                                            alt="profile"
                                        />
                                    </Link>
                                    <span>
                                        <Image
                                            width={45}
                                            height={45}
                                            src="/icons/notification.svg"
                                            alt="notification"
                                        />
                                    </span>
                                </div>
                            )}
                        </>
                    ),
                    ref: createRef(),
                };
            case "institute_moderator":
                // case "student":
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
                                    href="/admin-panel/chats"
                                >
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
                                    href="/admin-panel/statistics"
                                >
                                    Статистика
                                </Link>
                                <div
                                    className={classNames(styles.link, {
                                        [styles.active]: pathname.startsWith(
                                            "/admin-panel/verification",
                                        ),
                                    })}
                                >
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
                                    href="/profile"
                                >
                                    Выйти
                                </Link>
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
                                    href="/admin-panel/chats"
                                >
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
                                    href="/admin-panel/statistics"
                                >
                                    Статистика
                                </Link>
                                <div
                                    className={classNames(styles.link, {
                                        [styles.active]: pathname.startsWith(
                                            "/admin-panel/verification",
                                        ),
                                    })}
                                >
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
                                    href="/profile"
                                >
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
                                href="/admin-panel/statistics"
                            >
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
                                href="/admin-panel/students-list"
                            >
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
                                href="/admin-panel/companies-list"
                            >
                                Компании
                            </Link>
                            <div
                                className={classNames(styles.link, {
                                    [styles.active]: pathname.startsWith(
                                        "/admin-panel/verification",
                                    ),
                                })}
                            >
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
                                href="/profile"
                            >
                                Выйти
                            </Link>
                        </div>
                    ),
                    ref: createRef(),
                };
        }
    };

    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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

    if (!getHeaderContent(activeState)) setActiveState("student");

    return (
        <>
            {isMobile ? (
                <div
                    className={classNames(styles.header, {
                        [styles.open]: isOpen,
                    })}
                >
                    <div className={classNames(styles.container)}>
                        <Link href="/">
                            <Image
                                className={classNames("text pointer", {
                                    [styles.open]: isOpen,
                                })}
                                src="/icons/headerLogo.svg"
                                alt="Logo"
                                width={125}
                                height={53}
                            />
                        </Link>
                        <button
                            className={classNames(styles.burgerButton, {
                                [styles.open]: isOpen,
                            })}
                            onClick={() => changeMenuVisibility()}
                        >
                            <span className={styles.burgerLine}></span>
                            <span className={styles.burgerLine}></span>
                            <span className={styles.burgerLine}></span>
                        </button>
                        <div
                            className={classNames(styles.burgerMenu, {
                                [styles.open]: isOpen,
                            })}
                        >
                            <div className={styles.burgerList}>
                                {isAuth ? (
                                    <div
                                        className={classNames(
                                            styles.clickItems,
                                            // {[styles.disabled]: !(profileVerification.status === "verified")},
                                        )}
                                        onClick={() =>
                                            changeMenuVisibility(false)
                                        }
                                    >
                                        {getHeaderContent(activeState).content}
                                    </div>
                                ) : (
                                    <div
                                        className={styles.clickItems}
                                        onClick={() =>
                                            changeMenuVisibility(false)
                                        }
                                    >
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
                                                )}
                                            >
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
                                                )}
                                            >
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
                            <Image
                                className={"text pointer"}
                                src="/icons/headerLogo.svg"
                                alt="Logo"
                                width={125}
                                height={53}
                            />
                        </Link>

                        {isAuth ? (
                            getHeaderContent(activeState).content
                        ) : (
                            <nav>
                                <div className={styles.navList}>
                                    <Button
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <AuthModal initModalState="login" />
                                                ),
                                            })
                                        }
                                        type="primary"
                                    >
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
                                        type="secondary"
                                    >
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
