"use client";

import { IMessage } from "@/app/_types";
import classNames from "classnames";
import { FC } from "react";
import styles from "./Message.module.scss";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";

type MessageProps = {
    message: IMessage;
};

const Message: FC<MessageProps> = ({ message }) => {
    const { user } = useTypesSelector((state) => state.userReducer);

    console.log(message, user);

    return (
        <div
            className={classNames(
                styles.container,
                message.userId === user.id
                    ? styles.outgoingMessage
                    : styles.incomingMessage,
            )}
        >
            <div className={classNames(styles.decor)}></div>
            <p className="text fz20">{message.text}</p>
            <div className={styles.footer}>
                <p className={classNames(styles.changed, "text fz16 gray")}>{message.changedId ? "Изменено" : ""}</p>
                <p className={classNames(styles.messageTime, "text fz16")}>{message.createdAt}</p> 
                <img
                    src={`/icons/${
                        message.isRead ? "isReadTrue.svg" : "isReadFalse.svg"
                    }`}
                    alt="readStatus"
                    className={styles.checkMark}
                />
            </div>
        </div>
    );
};

export default Message;
