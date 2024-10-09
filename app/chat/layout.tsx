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
import { useParams, useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";
import { contentSlice } from "../_store/reducers/contentSlice";
import "./page.scss";
import { getChat, getChats } from "../_http/API/chatsApi";
import CustomOval from "../_components/ui/CustomOval/CustomOval";
import { chatSlice } from "../_store/reducers/chatSlice";
import classNames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { chats, currentChat } = useTypesSelector(
        (state) => state.chatReducer,
    );
    const { user } = useTypesSelector((state) => state.userReducer);
    const dispatch = useTypesDispatch();
    const { updateChats, tryToAddChat } = chatSlice.actions;
    const { chat_id } = useParams<{ chat_id: string }>();

    const [isChatsLoading, setIsChatsLoading] = useState<boolean>(false);

    useEffect(() => {
        // if (chats) return;

        setIsChatsLoading(true);
        const asyncFunc = async () => {
            const res = await getChats();

            if (res.status === 200) {
                if (
                    chat_id &&
                    res.results?.filter((i) => i.id === chat_id).length === 0
                ) {
                    const getChatRes = await getChat(chat_id);

                    if (getChatRes.status === 200) {
                        res.results?.push(getChatRes.chat!);
                        dispatch(
                            tryToAddChat({ ...getChatRes.chat!, id: chat_id }),
                        );
                    }
                }
                dispatch(updateChats(res.results!));
            }
            setIsChatsLoading(false);
        };
        asyncFunc();
    }, []);

    return (
        <ProfileRoute>
            <div
                suppressHydrationWarning
                className={classNames("container", styles.chatContainer)}
            >
                <div className="selectLayout">
                    <SideBar>
                        {isChatsLoading ? (
                            <div className="centerContent">
                                <CustomOval />
                            </div>
                        ) : (
                            <TransitionGroup className={styles.chatList}>
                                {chats?.map((chat, index) => {
                                    if (!chat.companion) return;
                                    
                                    return (
                                        <CSSTransition
                                            key={chat.id}
                                            timeout={200}
                                            classNames="item-value"
                                        >
                                            <Link
                                                href={`/chat/${chat.id}`}
                                                key={index}
                                                className={styles.chatLink}
                                            >
                                                <ChatItem
                                                    unreadCount={
                                                        chat.unreadCount
                                                    }
                                                    active={
                                                        chat.id ===
                                                        currentChat?.id
                                                    }
                                                    id={chat.id}
                                                    name={chat.companion.name}
                                                    isFavourited={
                                                        chat.isFavorite
                                                    }
                                                    avatar={
                                                        chat.companion.avatar
                                                    }
                                                    lastMessage={
                                                        chat.lastMessage
                                                    }
                                                />
                                            </Link>
                                        </CSSTransition>
                                    );
                                })}
                            </TransitionGroup>
                            // <div className={styles.chatList}>
                            //     {chats?.map((chat, index) => {
                            //         if (!chat.companion) return;

                            //         return (
                            //             <Link
                            //                 href={`/chat/${chat.id}`}
                            //                 key={index}
                            //                 className={styles.chatLink}
                            //             >
                            //                 <ChatItem
                            //                     unreadCount={chat.unreadCount}
                            //                     active={
                            //                         chat.id === currentChat?.id
                            //                     }
                            //                     id={chat.id}
                            //                     name={chat.companion.name}
                            //                     isFavourited={chat.isFavorite}
                            //                     avatar={chat.companion.avatar}
                            //                     lastMessage={chat.lastMessage}
                            //                 />
                            //             </Link>
                            //         );
                            //     })}
                            // </div>
                        )}
                    </SideBar>
                    {children}
                </div>
            </div>
        </ProfileRoute>
    );
}
