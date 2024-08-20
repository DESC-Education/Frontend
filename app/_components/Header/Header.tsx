"use client";

import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "../ui/Button/Button";
import AuthModal from "../modals/AuthModal/AuthModal";
import React, { useContext, useEffect } from "react";
import { ModalContext } from "@/app/_context/ModalContext";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import Link from "next/link";
import classNames from "classnames";
import { usePathname } from "next/navigation";

const Header = () => {
    const { showModal } = useContext(ModalContext);
    const { isAuth } = useTypesSelector((state) => state.userReducer);

    const pathname = usePathname();

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
                                        [styles.active]: pathname === "/chat",
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
                                        [styles.active]: pathname === "/faq",
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
