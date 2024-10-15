"use client";

import { IMessage } from "@/app/_types";
import classNames from "classnames";
import { FC, use, useEffect, useState } from "react";
import styles from "./Message.module.scss";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useInView } from "react-intersection-observer";
import { getDateOrTime } from "@/app/_utils/time";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { useParams } from "next/navigation";
import { chatSlice } from "@/app/_store/reducers/chatSlice";

type MessageProps = {
    message: IMessage;
    ws: WebSocket | null;
    wsStatus: number;
};

const Message: FC<MessageProps> = ({ message, ws, wsStatus }) => {
    const { user } = useTypesSelector((state) => state.userReducer);
    const [messageTime, setMessageTime] = useState<string>("");

    const { chat_id } = useParams<{ chat_id: string }>();

    const { updateChatUnread } = chatSlice.actions;
    const dispatch = useTypesDispatch();

    const { ref, inView, entry } = useInView();

    const [lightBoxOpened, setLightBoxOpened] = useState<boolean>(false);

    useEffect(() => {
        // console.log(
        //     !ws,
        //     message.isRead,
        //     wsStatus !== 1,
        //     !inView,
        //     message.user.id === user.id,
        // );

        if (
            !ws ||
            message.isRead ||
            wsStatus !== 1 ||
            !inView ||
            message.user.id === user.id
        )
            return;

        console.log("I VIEWED A MESSAGE AND SENT WS", message.message);

        ws.send(
            JSON.stringify({
                type: "viewed",
                payload: message.id,
            }),
        );

        dispatch(updateChatUnread({ chatId: chat_id, count: 1 }));
    }, [inView, message.isRead, wsStatus]);

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
                { [styles.hasFiles]: !!message.files.length },
            )}
        >
            {!!message.files.length && (
                <Lightbox
                    controller={{ closeOnBackdropClick: true }}
                    plugins={[Download]}
                    open={lightBoxOpened}
                    close={() => setLightBoxOpened(false)}
                    slides={message.files
                        .filter((i) =>
                            ["png", "jpg", "jpeg"].includes(i.extension),
                        )
                        .map((i) => ({
                            src: process.env.NEXT_PUBLIC_SERVER_PATH + i.path,
                        }))}
                />
            )}
            <div className={classNames(styles.decor)}></div>
            <p className={classNames("text fz20", styles.text)}>
                {message.message}
            </p>
            <div className={styles.messageFiles}>
                {!!message.files.length &&
                    message.files.map((file, index) =>
                        ["png", "jpg", "jpeg", "jfif"].includes(
                            file.extension,
                        ) ? (
                            <img
                                onClick={() => setLightBoxOpened(true)}
                                key={index}
                                className={styles.userImage}
                                src={
                                    process.env.NEXT_PUBLIC_SERVER_PATH +
                                    file.path
                                }
                                alt="logo"
                            />
                        ) : (
                            <a
                                key={index}
                                href={
                                    process.env.NEXT_PUBLIC_SERVER_PATH +
                                    file.path
                                }
                                download
                                target="_blank"
                                rel="noreferrer"
                                className={classNames(
                                    styles.userImage,
                                    styles.document,
                                )}
                            >
                                <img
                                    className={classNames(styles.imgDocument)}
                                    src={`/icons/extensions/${file.extension}.png`}
                                />
                                <p>{file.name}</p>
                            </a>
                        ),
                    )}
            </div>
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
        </div>
    );
};

export default Message;
