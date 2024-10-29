"use client";

import Image from "next/image";
import styles from "./ChatItem.module.scss";
import "./ChatItem.scss";
import classNames from "classnames";
import Button from "../ui/Button/Button";
import { IMessage } from "@/app/_types";
import Moment from "react-moment";
import "moment/locale/ru";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import { getDateOrTime } from "@/app/_utils/time";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { chatSlice } from "@/app/_store/reducers/chatSlice";
import { changeFavouriteChat } from "@/app/_http/API/chatsApi";
import { AlertContext } from "@/app/_context/AlertContext";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";

type ChatUserProps = {
    id: string;
    name: string;
    unreadCount: number;
    avatar: string;
    active: boolean;
    isFavourited: boolean;
    lastMessage?: IMessage;
    isListType?: boolean;
};

const ChatUser: React.FC<ChatUserProps> = ({
    id,
    name,
    avatar,
    active,
    unreadCount,
    isFavourited,
    lastMessage,
    isListType = false,
}) => {
    const [lastMessageTime, setLastMessageTime] = useState<string>("");
    const { user } = useTypesSelector((state) => state.userReducer);

    const { showAlert } = useContext(AlertContext);

    const dispatch = useTypesDispatch();
    const { updateChatFavourite, updateChats } = chatSlice.actions;

    const changeFavourite = async () => {
        dispatch(updateChatFavourite({ chat: id, isFavorite: isFavourited }));

        const res = await changeFavouriteChat(id);

        const prevFav = isFavourited;

        if (res.status === 200) {
            dispatch(updateChats(res.chats!));
        } else {
            showAlert("Произошла ошибка");
            dispatch(updateChatFavourite({ chat: id, isFavorite: prevFav }));
        }
    };

    useEffect(() => {
        if (!lastMessage) return;

        setLastMessageTime(getDateOrTime(lastMessage.createdAt));
    }, [lastMessage?.createdAt]);

    return (
        <div
            className={classNames(styles.chatItem, {
                [styles.active]: active,
                [styles.unread]: unreadCount > 0,
                [styles.listType]: isListType,
            })}
        >
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
                        <p className="text fw500 fz20">{name}</p>
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
            {lastMessage ? (
                <div
                    className={classNames(styles.chatMeta, {
                        [styles.notMyMessage]: lastMessage.user.id !== user.id,
                    })}
                >
                    <div className={styles.metaHeader}>
                        <span className={classNames(styles.date, "text fz16")}>
                            {lastMessageTime}
                        </span>
                        <img
                            title={
                                isFavourited
                                    ? "Убрать из избранного"
                                    : "Добавить в избранное"
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                changeFavourite();
                            }}
                            src={
                                isFavourited
                                    ? "/icons/star.svg"
                                    : "/icons/starInactive.svg"
                            }
                            alt="star"
                            className={styles.star}
                        />
                    </div>
                    <div className={styles.metaFooter}>
                        {lastMessage.user.id === user.id &&
                            (lastMessage.isRead === false ? (
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
                            ))}
                        <div
                            className={classNames(styles.unreadCount, {
                                [styles.hide]: !unreadCount,
                            })}
                        >
                            {unreadCount}
                        </div>
                        {/* <div className={classNames(styles.unreadCount)}>
                            {1}
                        </div> */}
                    </div>
                </div>
            ) : (
                <div
                    className={classNames(
                        styles.chatMeta,
                        styles.noLastMessage,
                    )}
                >
                    <div className={styles.metaHeader}>
                        <img
                            title={
                                isFavourited
                                    ? "Убрать из избранного"
                                    : "Добавить в избранное"
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                changeFavourite();
                            }}
                            src={
                                isFavourited
                                    ? "/icons/star.svg"
                                    : "/icons/starInactive.svg"
                            }
                            alt="star"
                            className={styles.star}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatUser;
