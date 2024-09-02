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
import Header from "../_components/Header/Header";
import SideBar from "../_components/SideBar/SideBar";
import { useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { chats } = useTypesSelector((state) => state.userReducer);
    const { user } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const { updateChats, updateUser } = userSlice.actions;

    useEffect(() => {
        dispatch(
            updateChats([
                {
                    id: "1",
                    companion: {
                        id: "1",
                        email: "mail@mail.com",
                        isVerified: true,
                        isOnline: true,
                        isBanned: false,
                        role: "student",
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
                    ],
                },
            ]),
        );
    }, []);

    return (
        <ProfileRoute>
            <div suppressHydrationWarning className="container">
                <div className="selectLayout">
                    <SideBar>
                        <div className={styles.chatList}>
                            {chats.map((chat, index) => {
                                if (!chat.companion.isVerified) return null;
                                return (
                                    <Link
                                        href={`/chat/${index}`}
                                        key={index}
                                        className={styles.chatLink}
                                    >
                                        <ChatItem
                                            name={chat.companion.email}
                                            // name={chat.companion.role === "student" ? chat.companion.mail + " " + chat.companion.mail : chat.companion.mail}
                                            avatar={"#"}
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
                                                ].createdat
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
