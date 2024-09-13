"use client";

import styles from "./page.module.scss";
import { IChat, IMessage } from "../../_types/index";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useParams } from "next/navigation";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import Message from "./Message/Message";

export default function Page() {
    const { chat_id } = useParams();

    const { chats } = useTypesSelector((state) => state.contentReducer);

    const [chat, setChat] = useState<IChat>({} as IChat);

    useEffect(() => {
        setChat(chats.find((item) => item.id === chat_id)!);
    }, [chat_id]);

    console.log(chat, chats, chat_id);

    if (!chat || !chat?.companion)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <>
            <div className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <img
                        src={chat.companion.avatar}
                        alt="Аватар"
                        className={styles.avatar}
                    />
                    <div>
                        <h4 className={styles.userName}>
                            {chat.companion.name}
                        </h4>
                        {/* <span className={styles.userStatus}>в сети</span> */}
                    </div>
                </div>
                <div className={styles.chatActions}>
                    <Image
                        src="/icons/searchIcon.svg"
                        alt=""
                        className={styles.searchIcon}
                        width={35}
                        height={35}
                    />
                    <Image
                        src="/icons/extraIcon.svg"
                        alt=""
                        className={styles.pinIcon}
                        width={35}
                        height={35}
                    />
                </div>
            </div>
            <div className={styles.chatMessages}>
                {chat.messages.map((message, index) => (
                    <Message message={message} key={index} />
                ))}
            </div>
            <div className={styles.messageInput}>
                <input type="text" placeholder="Напишите сообщение..." />
                <div className={styles.inputActions}></div>
            </div>
        </>
    );
}
