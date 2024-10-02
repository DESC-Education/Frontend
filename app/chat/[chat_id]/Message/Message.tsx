"use client";

import { IMessage } from "@/app/_types";
import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import styles from "./Message.module.scss";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useInView } from "react-intersection-observer";
import { getDateOrTime } from "@/app/_utils/time";

type MessageProps = {
    message: IMessage;
    ws: WebSocket | null;
};

const Message: FC<MessageProps> = ({ message, ws }) => {
    const { user } = useTypesSelector((state) => state.userReducer);
    const [messageTime, setMessageTime] = useState<string>("");

    const { ref, inView, entry } = useInView();

    useEffect(() => {
        if (
            !ws ||
            message.isRead ||
            ws.readyState !== 1 ||
            !inView ||
            message.user.id === user.id
        )
            return;

        ws.send(
            JSON.stringify({
                type: "viewed",
                payload: message.id,
            }),
        );
    }, [inView, message.isRead, ws?.readyState]);

    console.log(message.files);
    

    useEffect(() => {
        setMessageTime(getDateOrTime(message.createdAt));
    }, []);

    return (
        <div
            ref={ref}
            className={classNames(
                styles.container,
                message.user.id === user.id
                    ? styles.outgoingMessage
                    : styles.incomingMessage,
            )}
        >
            <div className={classNames(styles.decor)}></div>
            <p className={classNames("text fz20", styles.text)}>
                {message.message}
            </p>
            <div className={styles.footer}>
                <p className={classNames(styles.changed, "text fz16 gray")}>
                    {message.changedId ? "Изменено" : ""}
                </p>
                <p className={classNames(styles.messageTime, "text fz16")}>
                    {messageTime}
                </p>
                {user.id === message.user.id && (
                    <img
                        src={`/icons/${
                            message.isRead
                                ? "isReadTrue.svg"
                                : "isReadFalse.svg"
                        }`}
                        alt="readStatus"
                        className={classNames(styles.checkMark, {
                            [styles.checkMarkActive]: message.isRead,
                        })}
                    />
                )}
            </div>
            <div className={styles.messageFiles}>
                {!!message.files.length && (
                    <div>
                        {message.files.map((file, index) => (
                            <div className={styles.file} key={index}>
                                <img
                                    src={
                                        process.env.NEXT_PUBLIC_SERVER_PATH +
                                        file.path
                                    }
                                    alt="icon"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
