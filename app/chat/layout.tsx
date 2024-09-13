"use client";

import "../../app/_scss/globals.scss";
import styles from "./layout.module.scss";
import Link from "next/link";
import ChatItem from "../_components/ChatItem/ChatItem";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { userSlice } from "../_store/reducers/userSlice";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { useEffect } from "react";
import Header from "../_components/Header/Header";
import SideBar from "../_components/SideBar/SideBar";
import { useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";
import { contentSlice } from "../_store/reducers/contentSlice";
import "./page.scss";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { chats } = useTypesSelector((state) => state.contentReducer);
    const { user } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const { updateChats } = contentSlice.actions;

    useEffect(() => {
        dispatch(
            updateChats([
                {
                    id: "1",
                    companion: {
                        avatar: "/icons/hummingbird.svg", 
                        name: "Desc Education",
                    },
                    createdAt: "14.03.2024",
                    taskId: "1",
                    isSupport: true,
                    isSuspicious: false,
                    messages: [
                        {
                            id: "1",
                            chatId: "1",
                            text:
                                "Здравствуйте. Спасибо за задание, было очень интересно его выполнять!",
                            ticketId: "1",
                            userId: user.id,
                            isRead: true,
                            createdAt: "10.03.2024",
                            isVisible: true,
                        },
                        {
                            id: "2",
                            chatId: "1",
                            text:
                                "Добрый день. Благодарим за качественное выполнение задания.",
                            ticketId: "1",
                            userId: "1",
                            isRead: true,
                            createdAt: "16:04",
                            isVisible: true,
                        },
                    ],
                },
                {
                    id: "2",
                    companion: {
                        avatar: "/icons/Politechlogo.png", 
                        name: "СФУ Политех",
                    },
                    createdAt: "14.03.2024",
                    taskId: "1",
                    isSupport: true,
                    isSuspicious: false,
                    messages: [
                        {
                            id: "1",
                            chatId: "1",
                            text:
                                "Добрый день. Подскажите, в чем особенность данного задания?",
                            ticketId: "2",
                            userId: user.id,
                            isRead: true,
                            createdAt: "21.05.2024",
                            isVisible: true,
                        },
                        {
                            id: "2",
                            chatId: "2",
                            text:
                                "Здравствуйте. Оно помогает нашим студентам лучше понять проблему и решать ее быстрее.",
                            ticketId: "1",
                            userId: "1",
                            isRead: true,
                            createdAt: "22.05.2024",
                            isVisible: true,
                        },
                        {
                            id: "3",
                            chatId: "2",
                            text:
                                "Спасибо за ответ!",
                            ticketId: "1",
                            userId: user.id,
                            isRead: true,
                            createdAt: "15:13",
                            isVisible: true,
                        },
                    ],
                },
            ]),
        );
    }, [user.id]);

    return (
        <ProfileRoute>
            <div suppressHydrationWarning className="container">
                <div className="selectLayout">
                    <SideBar>
                        <div className={styles.chatList}>
                            {chats.map((chat, index) => {
                                // if (!chat.companion.isVerified) return null;
                                return (
                                    <Link
                                        href={`/chat/${chat.id}`}
                                        key={index}
                                        className={styles.chatLink}
                                    >
                                        <ChatItem
                                            name={chat.companion.name!}
                                            // name={chat.companion.role === "student" ? chat.companion.mail + " " + chat.companion.mail : chat.companion.mail}
                                            avatar={chat.companion.avatar}
                                            lastMessage={
                                                chat.messages[
                                                    chats[index].messages
                                                        .length - 1
                                                ].text
                                            }
                                            lastMessageDate={
                                                chat.messages[
                                                    chats[index].messages
                                                        .length - 1
                                                ].createdAt
                                            }
                                            isRead={
                                                chat.messages[
                                                    chat.messages.length - 1
                                                ].isRead
                                            }
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </SideBar>
                    {children}
                </div>
            </div>
        </ProfileRoute>
    );
}
