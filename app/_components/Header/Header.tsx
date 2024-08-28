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

type RoleState =
    | "student"
    | "company"
    | "institute_moderator"
    | "moderator"
    | "admin";

const Header = () => {
    const { showModal } = useContext(ModalContext);
    const { isAuth } = useTypesSelector((state) => state.userReducer);
    const { user, isProfileLoading, isProfileVerified } = useTypesSelector(
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
            case "admin":
                return {
                    content: (
                        <>
                            <div className={styles.navigation}>
                                <div className={styles.linkContainer}>
                                    <Link
                                        style={{
                                            pointerEvents: isProfileVerified
                                                ? "all"
                                                : "none",
                                        }}
                                        className={classNames(
                                            styles.link,
                                            "text fz24 fw500",
                                            {
                                                [styles.active]:
                                                    pathname === "/exchange",
                                            },
                                        )}
                                        href="/exchange"
                                    >
                                        Биржа
                                    </Link>
                                    {!isProfileVerified && (
                                        <InfoIcon
                                            className={styles.infoIcon}
                                            tooltipContent={
                                                <>
                                                    Для доступа к бирже
                                                    необходимо подтвердить
                                                    профиль
                                                    <Button type="primary">
                                                        Инструкция
                                                    </Button>
                                                </>
                                            }
                                            action="tooltip"
                                        />
                                    )}
                                </div>
                                <div className={styles.linkContainer}>
                                    <Link
                                        style={{
                                            pointerEvents: isProfileVerified
                                                ? "all"
                                                : "none",
                                        }}
                                        className={classNames(
                                            styles.link,
                                            "text fz24 fw500",
                                            {
                                                [styles.active]:
                                                    pathname === "/chat",
                                                [styles.disabled]: !isProfileVerified,
                                            },
                                        )}
                                        href="/chat"
                                    >
                                        Сообщения
                                    </Link>
                                    {!isProfileVerified && (
                                        <InfoIcon
                                            className={styles.infoIcon}
                                            tooltipContent={
                                                <>
                                                    Для доступа к сообщениям
                                                    необходимо подтвердить
                                                    профиль
                                                    <Button type="primary">
                                                        Инструкция
                                                    </Button>
                                                </>
                                            }
                                            action="tooltip"
                                        />
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
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                        {
                                            [styles.active]:
                                                pathname === "/exchange",
                                        },
                                    )}
                                    href="/exchange"
                                >
                                    Биржа
                                </Link>
                                <Link
                                    className={classNames(
                                        styles.link,
                                        "text fz24 fw500",
                                        {
                                            [styles.active]:
                                                pathname === "/chat",
                                        },
                                    )}
                                    href="/chat"
                                >
                                    Сообщения
                                </Link>
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
                    content:
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
                        </>,
                    ref: createRef(),
                };
            // case "admin":
            case "student":
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

    if (!getHeaderContent(activeState)) setActiveState("student");

    return (
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
    );
};

export default Header;
