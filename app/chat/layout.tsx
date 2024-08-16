"use client";


import "../../app/_scss/globals.scss";
import styles from "./layout.module.scss";
import Link from "next/link";
import ChatItem from "../_components/ChatItem/ChatItem";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { chatSlice } from "../_store/reducers/chatSlice";
import { userSlice } from "../_store/reducers/userSlice";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { useEffect } from "react";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { chats } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const { updateChats } = userSlice.actions;

    useEffect(() => {
        dispatch(updateChats([
            {
                id: "1",
                companion: {
                    id: "1",
                    mail: "mail@mail.com",
                    isVerified: true,
                    role: "student",
                    isOnline: true,
                    isBanned: false,
                    type: "student",
                    data: {
                        id: "1",
                        isVerified: true,
                        name: "Петя",
                        surname: "Петров",
                        logoImg: {
                            id: "1",
                            name: "Имя Фамилия",
                            path: "/images/userIcon.png",
                            type: "image/png",
                        },
                        description: "Описание",
                        phone: "123456789",
                        specialityId: "1",
                        instituteId: "1",
                        formOfEducationId: "1",
                        timezone: "Europe/Moscow",
                        grade: "1",
                        yearOfGraduation: 2024,
                        telegramLink: "https://t.me/joinchat/123456789",
                    },
                },                
                createdAt: "14.03.2024",
                taskId: "1",
                isSupport: true,
                isSuspicious: false,
                messages: [
                    {
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
                ]
            },
            {
                id: "2",
                companion: {
                    id: "2",
                    mail: "mail@mail.com",
                    isVerified: true,
                    role: "student",
                    isOnline: true,
                    isBanned: false,
                    type: "student",
                    data: {
                        id: "2",
                        isVerified: true,
                        name: "Вася",
                        surname: "Васильев",
                        logoImg: {
                            id: "2",
                            name: "Имя Фамилия",
                            path: "/images/userIcon.png",
                            type: "image/png",
                        },
                        description: "Описание",
                        phone: "123456789",
                        specialityId: "1",
                        instituteId: "1",
                        formOfEducationId: "1",
                        timezone: "Europe/Moscow",
                        grade: "1",
                        yearOfGraduation: 2024,
                        telegramLink: "https://t.me/joinchat/123456789",
                    },
                },
                createdAt: "14.03.2024",
                taskId: "1",
                isSupport: true,
                isSuspicious: false,
                messages: [
                    {
                        id: "1",
                        chatId: "1",
                        text: "Привет, я тебя понимаю?",
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
                        text: "Привет, я тебя понимаю?",
                        ticketId: "1",
                        userId: "1",
                        isRead: true,
                        createdat: "14.03.2024",
                        isVisible: true,
                        changedId: "1",
                    },
                    {
                        id: "3",
                        chatId: "1",
                        text: "Привет это я твой единственный зритель",
                        ticketId: "1",
                        userId: "1",
                        isRead: false,
                        createdat: "17.03.2024",
                        isVisible: true,
                        changedId: "1",
                    },
                ],
            },
        ]));
    }, []);

    return (
        <html lang="en">
            <body className="chat-layout">
                <div className={styles.container}>
                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <div className={styles.search}>
                                <input type="text" placeholder="Поиск" className="text" />
                            </div>
                            <div className={styles.chatList}>
                                {chats.map((chat, index) => {
                                    if (!chat.companion.data.isVerified) return null;
                                    return <Link href={`/chat/${index}`} key={index} className={styles.chatLink}>
                                        <ChatItem
                                            name={chat.companion.type === "student" ? chat.companion.data.name + " " + chat.companion.data.surname : chat.companion.data.ownerName}
                                            avatar={chat.companion.data.logoImg.path}
                                            lastMessage={chat.messages[chats[index].messages.length - 1].text}
                                            lastMessageDate={chat.messages[chats[index].messages.length - 1].createdat}
                                            isRead={chat.messages[chat.messages.length - 1].isRead}
                                        />
                                    </Link>
})}
                            </div>
                        </aside>
                        <div className={styles.content}>{children}</div>
                    </div>
                </div>
            </body>
        </html>
    );
}