"use client";

import styles from "./page.module.scss";
import { IMessage } from "../../_types/index";
import { useState } from "react";


export default function Page() {
    const [currentChatId, setCurrentChatId] = useState<string>("");
    const [messages, setMessages] = useState<IMessage[]>([]);


    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <img
                        src="/avatar-placeholder.png" // замените на реальный путь к аватару
                        alt="Аватар"
                        className={styles.avatar}
                    />
                    <div>
                        <h4 className={styles.userName}>Имя Фамилия</h4>
                        <span className={styles.userStatus}>в сети</span>
                    </div>
                </div>
                <div className={styles.chatActions}>
                    <span>🔍</span>
                    <span>📎</span>
                </div>
            </div>
            <div className={styles.pinnedMessage}>
                <strong>Закрепленное сообщение</strong>
            </div>
            <div className={styles.chatMessages}>
                <div className={styles.incomingMessage}>
                    <p>
                        жопа
                    </p>
                    <span className={styles.messageTime}>Изменено 10:23</span>
                </div>
                <div className={styles.outgoingMessage}>
                    <p>
                        да
                    </p>
                    <span className={styles.messageTime}>10:23</span>
                </div>
            </div>
            <div className={styles.messageInput}>
                <input type="text" placeholder="Напишите сообщение..." />
                <div className={styles.inputActions}>

                </div>
            </div>
        </div>
    );
}