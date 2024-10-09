"use client";

import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import styles from "./NotificationsModal.module.scss";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import classNames from "classnames";
import Link from "next/link";
import CustomOval from "../../ui/CustomOval/CustomOval";
import Image from "next/image";
import { getDateOrTime } from "@/app/_utils/time";
import { readNotification } from "@/app/_http/API/notificationApi";
import { AlertContext } from "@/app/_context/AlertContext";

type NotificationsModalProps = {
    active: string | undefined;
    setActive: React.Dispatch<React.SetStateAction<string | undefined>>;
    closeModal?: () => void;
};

const NotificationsModal: FC<NotificationsModalProps> = ({
    active,
    setActive,
    closeModal,
}) => {
    const { notifications } = useTypesSelector((state) => state.contentReducer);

    const { showAlert } = useContext(AlertContext);

    const dispatch = useTypesDispatch();
    const { updateNotificationRead } = contentSlice.actions;

    const readNotificationHandler = async (id: string) => {
        setActive((prev) => (prev && prev === id ? undefined : id));

        if (notifications?.find((i) => i.id === id)?.isRead) {
            return;
        }

        const res = await readNotification(id);

        if (res.status !== 200) {
            showAlert("Произошла ошибка");
        } else {
            dispatch(updateNotificationRead(id));
        }
    };

    if (!notifications) {
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <p className="title fz28 fw500">Уведомления</p>
            <div
                className={classNames(styles.list, {
                    [styles.activeNotification]: active,
                })}
            >
                {notifications.map((notification, index) => (
                    <div
                        onClick={() => readNotificationHandler(notification.id)}
                        key={index}
                        className={classNames(styles.notification, {
                            [styles.active]: active === notification.id,
                        })}
                    >
                        <div
                            className={classNames(styles.read, {
                                [styles.active]: !notification.isRead,
                            })}
                        ></div>
                        <div className={styles.header}>
                            <p className="text fw500 fz24">
                                {notification.title}
                            </p>
                            <p className="text fw500 fz24">
                                {getDateOrTime(notification.createdAt)}
                            </p>
                        </div>
                        <div className={styles.content}>
                            <p
                                className={classNames(
                                    "text gray fz20 fw500",
                                    styles.message,
                                )}
                            >
                                {notification.message}
                            </p>
                            {!!notification.payload &&
                                notification.type !== "level" && (
                                    <Link
                                        onClick={() =>
                                            closeModal && closeModal()
                                        }
                                        href={`/tasks/${notification.payload.task}/solutions/${notification.payload.id}`}
                                        className={classNames(
                                            "text fz20 blue pointer under",
                                            styles.link,
                                        )}
                                    >
                                        Перейти
                                    </Link>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsModal;
