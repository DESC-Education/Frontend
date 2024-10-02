"use client";

import Image from "next/image";
import styles from "./ChatItem.module.scss";
import classNames from "classnames";
import Button from "../ui/Button/Button";
import { IMessage } from "@/app/_types";
import Moment from "react-moment";
import "moment/locale/ru";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import { getDateOrTime } from "@/app/_utils/time";

type ChatUserProps = {
    name: string;
    avatar: string;
    lastMessage?: IMessage;
};

const ChatUser: React.FC<ChatUserProps> = ({ name, avatar, lastMessage }) => {
    const [lastMessageTime, setLastMessageTime] = useState<string>("");

    useEffect(() => {
        if (!lastMessage) return;

        setLastMessageTime(getDateOrTime(lastMessage.createdAt));
    }, []);

    return (
        <div className={styles.chatItem}>
            <div className={styles.chatInfo}>
                <img
                    src={
                        avatar
                            ? process.env.NEXT_PUBLIC_SERVER_PATH + avatar
                            : "/images/avatar.png"
                    }
                    alt="avatar"
                    className={styles.avatar}
                />
                <div className={styles.userInfo}>
                    <div className={styles.mainInfo}>
                        <h4 className="text fw500">{name}</h4>
                    </div>
                    {lastMessage ? (
                        <p
                            className={classNames(
                                styles.lastMessage,
                                "text fz16",
                            )}
                        >
                            {lastMessage.message}
                        </p>
                    ) : (
                        <p
                            className={classNames(
                                styles.lastMessage,
                                "text fz16",
                            )}
                        >
                            Нет сообщений
                        </p>
                    )}
                </div>
            </div>
            {lastMessage && (
                <div className={styles.chatMeta}>
                    <span className={classNames(styles.date, "text fz16")}>
                        {lastMessageTime}
                    </span>
                    {lastMessage.isRead === false ? (
                        <Image
                            src="/icons/isReadFalse.svg"
                            alt=""
                            className={styles.checkMark}
                            width={14}
                            height={24}
                        />
                    ) : (
                        <Image
                            src="/icons/isReadTrue.svg"
                            alt=""
                            className={styles.checkMark}
                            width={24}
                            height={24}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatUser;
