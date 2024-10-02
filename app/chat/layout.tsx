"use client";

import "../../app/_scss/globals.scss";
import styles from "./layout.module.scss";
import Link from "next/link";
import ChatItem from "../_components/ChatItem/ChatItem";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { userSlice } from "../_store/reducers/userSlice";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { useEffect, useState } from "react";
import Header from "../_components/Header/Header";
import SideBar from "../_components/SideBar/SideBar";
import { useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";
import { contentSlice } from "../_store/reducers/contentSlice";
import "./page.scss";
import { getChats } from "../_http/API/chatsApi";
import CustomOval from "../_components/ui/CustomOval/CustomOval";
import { chatSlice } from "../_store/reducers/chatSlice";
import classNames from "classnames";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { chats } = useTypesSelector((state) => state.chatReducer);
    const { user } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const { updateChats } = chatSlice.actions;

    const [isChatsLoading, setIsChatsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (chats) return;

        setIsChatsLoading(true);
        const asyncFunc = async () => {
            const res = await getChats();

            // console.log("GET CHATS RES", res);

            if (res.status === 200) {
                dispatch(updateChats(res.results!));
            }
            setIsChatsLoading(false);
        };
        asyncFunc();
    }, []);

    return (
        <ProfileRoute>
            <div suppressHydrationWarning className={classNames("container", styles.chatContainer)}>
                <div className="selectLayout">
                    <SideBar>
                        {isChatsLoading ? (
                            <div className="centerContent">
                                <CustomOval />
                            </div>
                        ) : (
                            <div className={styles.chatList}>
                                {chats?.map((chat, index) => {
                                    if (!chat.companion) return;

                                    return (
                                        <Link
                                            href={`/chat/${chat.id}`}
                                            key={index}
                                            className={styles.chatLink}
                                        >
                                            <ChatItem
                                                name={chat.companion.name}
                                                // name={chat.companion.role === "student" ? chat.companion.mail + " " + chat.companion.mail : chat.companion.mail}
                                                avatar={chat.companion.avatar}
                                                lastMessage={chat.lastMessage}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </SideBar>
                    {children}
                </div>
            </div>
        </ProfileRoute>
    );
}
