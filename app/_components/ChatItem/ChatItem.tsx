"use client";

import Image from "next/image";
import styles from "./ChatItem.module.scss";
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

type ChatUserProps = {
    id: string;
    name: string;
    avatar: string;
    isFavourited: boolean;
    lastMessage?: IMessage;
};

const ChatUser: React.FC<ChatUserProps> = ({
    id,
    name,
    avatar,
    isFavourited,
    lastMessage,
}) => {
    const [lastMessageTime, setLastMessageTime] = useState<string>("");

    const { showAlert } = useContext(AlertContext);

    const dispatch = useTypesDispatch();
    const { updateChatFavourite, updateChats } = chatSlice.actions;

    const changeFavourite = async () => {
        const res = await changeFavouriteChat(id);

        const prevFav = isFavourited;

        dispatch(updateChatFavourite({ chat: id, isFavorite: !prevFav }));

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
            {lastMessage ? (
                <div className={styles.chatMeta}>
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
