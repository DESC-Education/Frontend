import styles from "./UserContent.module.scss";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import InfoIcon from "../../ui/InfoIcon/InfoIcon";
import Button from "../../ui/Button/Button";
import { usePathname } from "next/navigation";
import { FC, useContext, useEffect, useState } from "react";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { AlertContext } from "@/app/_context/AlertContext";
import NotificationsModal from "../../modals/NotificationsModal/NotificationsModal";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { ModalContext } from "@/app/_context/ModalContext";
import NeedToVerifyModal from "../../modals/NeedToVerifyModal/NeedToVerifyModal";

type UserContentProps = {
    profileVerification: any;
    isMobile: boolean;
    logout: () => void;
};

const UserContent: FC<UserContentProps> = ({
    profileVerification,
    isMobile,
    logout,
}) => {
    const pathname = usePathname();
    const [isShowNotificationsModal, setIsShowNotificationsModal] = useState<
        boolean
    >(false);

    const [activeNotification, setActiveNotification] = useState<
        string | undefined
    >();
    const { notifications } = useTypesSelector((state) => state.contentReducer);
    const { unreadChatsCount } = useTypesSelector((state) => state.chatReducer);

    const { showAlert } = useContext(AlertContext);
    const { showModal } = useContext(ModalContext);

    const dispatch = useTypesDispatch();
    const { sortNotifications } = contentSlice.actions;

    useEffect(() => {
        if (isShowNotificationsModal) {
            dispatch(sortNotifications());
            setActiveNotification(undefined);
        }
    }, [isShowNotificationsModal]);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsShowNotificationsModal(false);
            }
        };

        const listenerClick = (e: any) => {
            if (
                isShowNotificationsModal &&
                !e.target.closest("." + styles.notificationModal)
            ) {
                setIsShowNotificationsModal(false);
            }
        };

        setTimeout(() => {
            window.addEventListener("click", listenerClick);
            window.addEventListener("keydown", listener);
        });

        return () => {
            window.removeEventListener("click", listenerClick);
            window.removeEventListener("keydown", listener);
        };
    }, [isShowNotificationsModal]);

    return (
        <>
            <div className={styles.navigation}>
                <div
                    onClick={() =>
                        isMobile &&
                        profileVerification.status !== "verified" &&
                        showModal({
                            content: <NeedToVerifyModal item="бирже" />,
                        })
                    }
                    className={styles.linkContainer}
                >
                    {profileVerification.status !== "verified" ? (
                        <InfoIcon
                            className={styles.infoIcon}
                            tooltipContent={
                                <div className={styles.tooltipContent}>
                                    Для доступа к бирже необходимо подтвердить
                                    профиль
                                    {/* <Button type="primary">Инструкция</Button> */}
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
                                                pathname === "/exchange",
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
                                    profileVerification.status === "verified"
                                        ? "all"
                                        : "none",
                            }}
                            className={classNames(
                                styles.link,
                                "text fz24 fw500",
                                {
                                    [styles.active]: pathname === "/exchange",
                                },
                            )}
                            href="/exchange"
                        >
                            Биржа
                        </Link>
                    )}
                </div>
                <div
                onClick={() =>
                    isMobile &&
                    profileVerification.status !== "verified" &&
                    showModal({
                        content: <NeedToVerifyModal item="сообщениям" />,
                    })
                }
                className={styles.linkContainer}>
                    {profileVerification.status !== "verified" ? (
                        <InfoIcon
                            className={styles.infoIcon}
                            tooltipContent={
                                <div className={styles.tooltipContent}>
                                    Для доступа к сообщениям необходимо
                                    подтвердить профиль
                                    {/* <Button type="primary">Инструкция</Button> */}
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
                                    profileVerification.status === "verified"
                                        ? "all"
                                        : "none",
                            }}
                            className={classNames(
                                styles.link,
                                styles.messages,
                                "text fz24 fw500",
                                {
                                    [styles.active]: pathname === "/chat",
                                    [styles.disabled]:
                                        profileVerification.status !==
                                        "verified",
                                },
                            )}
                            href="/chat"
                        >
                            Сообщения
                            {unreadChatsCount > 0 && (
                                <span className={styles.unread}>
                                    {unreadChatsCount}
                                </span>
                            )}
                        </Link>
                    )}
                </div>
                <div className={styles.linkContainer}>
                    <Link
                        className={classNames(styles.link, "text fz24 fw500", {
                            [styles.active]: pathname === "/faq",
                        })}
                        href="/faq"
                    >
                        FAQ
                    </Link>
                </div>
                <div className={styles.linkContainer}>
                    <Link
                        className={classNames(styles.link, "text fz24 fw500", {
                            [styles.active]: pathname === "/vacancies",
                        })}
                        href="/vacancies"
                    >
                        Вакансии
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
                                    [styles.active]: pathname === "/faq",
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
                                    [styles.active]: pathname === "/faq",
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
                                    [styles.active]: pathname === "/faq",
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
                                logout();
                                showAlert(
                                    "Вы успешно вышли из аккаунта!",
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
                        <img
                            className={styles.icon}
                            src="/icons/profile.svg"
                            alt="profile"
                        />
                    </Link>
                    <span
                        className={styles.notification}
                        onClick={() =>
                            setIsShowNotificationsModal((prev) => !prev)
                        }
                    >
                        {notifications &&
                            notifications.filter((i) => !i.isRead).length >
                                0 && (
                                <span className={styles.unread}>
                                    {
                                        notifications.filter((i) => !i.isRead)
                                            .length
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
                        className={classNames(styles.notificationModal, {
                            [styles.active]: isShowNotificationsModal,
                        })}
                    >
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
        </>
    );
};

export default UserContent;
