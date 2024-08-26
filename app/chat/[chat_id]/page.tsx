"use client";

import styles from "./page.module.scss";
import { IMessage } from "../../_types/index";
import { useState } from "react";
import Image from "next/image";
import classNames from "classnames";


export default function Page() {

    const [messages, setMessages] = useState<IMessage[]>([{
        id: "1",
        chatId: "1",
        text: "dfdvgdv",
        ticketId: "1",
        userId: "1",
        isRead: true,
        createdat: "14.03.2024",
        isVisible: true,
        changedId: "1",
    },
    {
        id: "2",
        chatId: "1",
        text: "last message",
        ticketId: "1",
        userId: "1",
        isRead: true,
        createdat: "10.03.2024",
        isVisible: true,
        changedId: "1",
    },
    {
        id: "3",
        chatId: "1",
        text: "last message",
        ticketId: "1",
        userId: "1",
        isRead: true,
        createdat: "10.03.2024",
        isVisible: true,
        changedId: "1",
    }
    ]);



    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <img
                        src="/avatar-placeholder.png"
                        alt="Аватар"
                        className={styles.avatar}
                    />
                    <div>
                        <h4 className={styles.userName}>Петя Петров</h4>
                        <span className={styles.userStatus}>в сети</span>
                    </div>
                </div>
                <div className={styles.chatActions}>
                    <Image src="/icons/searchIcon.svg" alt="" className={styles.searchIcon} width={35} height={35} />
                    <Image src="/icons/extraIcon.svg" alt="" className={styles.pinIcon} width={35} height={35} />
                </div>
            </div>
            <div className={styles.chatMessages}>
                {messages.map((message, index) => (
                    <div className={classNames("text", styles.message, message.id === "1" ? styles.outgoingMessage : styles.incomingMessage)}>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            <div className={styles.messageInput}>
                <input type="text" placeholder="Напишите сообщение..." />
                <div className={styles.inputActions}>

                </div>
            </div>
        </div>
    );
}