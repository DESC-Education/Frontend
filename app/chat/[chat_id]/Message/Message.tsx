"use client";

import { IMessage } from "@/app/_types";
import classNames from "classnames";
import {
    FC,
    ForwardedRef,
    forwardRef,
    Ref,
    SetStateAction,
    // SetStateAction,
    use,
    useEffect,
    useState,
} from "react";
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
import { getChat } from "@/app/_http/API/chatsApi";
import { Dispatch } from "@reduxjs/toolkit";

type ContainerRef = HTMLDivElement;

type MessageProps = {
    message: IMessage;
    isFirst: boolean;
    setIsMessagesLoading: any;
    ws?: WebSocket | null;
    wsStatus?: number;
};

const Message = forwardRef<ContainerRef, MessageProps>(
    ({ message, ws, wsStatus, isFirst, setIsMessagesLoading }, scrollRef) => {
        const { user } = useTypesSelector((state) => state.userReducer);
        const [messageTime, setMessageTime] = useState<string>("");

        const { isChatHasMoreMessages, messagesPerRequest } = useTypesSelector(
            (state) => state.chatReducer,
        );

        const { chat_id } = useParams<{ chat_id: string }>();

        const {
            prependMessages,
            updateIsChatHasMoreMessages,
        } = chatSlice.actions;
        const dispatch = useTypesDispatch();

        const { ref, inView } = useInView();
        const { ref: refFirst, inView: inViewFirst } = useInView();

        const [isScrolled, setIsScrolled] = useState(false);

        const [lightBoxOpened, setLightBoxOpened] = useState<boolean>(false);

        useEffect(() => {
            if (
                !ws ||
                message.isRead ||
                wsStatus !== 1 ||
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
        }, [inView, message.isRead, wsStatus]);

        useEffect(() => {
            if (!isFirst || !isChatHasMoreMessages) return;

            const scrollListener = (e: Event) => {
                setIsScrolled(true);
            };

            if (!isScrolled) {
                window.addEventListener("wheel", scrollListener);
                window.addEventListener("touchstart", scrollListener);
                return;
            }

            if (!inViewFirst || !scrollRef) return;

            setIsMessagesLoading(true);

            const asyncFunc = async () => {
                const res = await getChat({
                    id: chat_id,
                    messageId: message.id,
                    page: 1,
                    page_size: messagesPerRequest,
                });

                if (res.status === 200) {
                    dispatch(prependMessages(res.chat!.messages.toReversed()));
                    dispatch(updateIsChatHasMoreMessages(res.hasMoreMessages!));
                }
                setIsMessagesLoading(false);
            };

            asyncFunc();

            return () => {
                window.removeEventListener("wheel", scrollListener);
                window.removeEventListener("touchstart", scrollListener);
            };
        }, [inViewFirst, isScrolled, isChatHasMoreMessages]);

        useEffect(() => {
            setMessageTime(getDateOrTime(message.createdAt));
        }, [message.createdAt]);

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
                                src:
                                    process.env.NEXT_PUBLIC_SERVER_PATH +
                                    i.path,
                            }))}
                    />
                )}
                <div className={classNames(styles.decor)}></div>
                <p
                    ref={isFirst ? refFirst : null}
                    className={classNames("text fz16", styles.text)}
                >
                    {message.message} {message.id}
                    {/* {message.message} */}
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
                                        className={classNames(
                                            styles.imgDocument,
                                        )}
                                        src={`/icons/extensions/${file.extension}.png`}
                                    />
                                    <p>{file.name}</p>
                                </a>
                            ),
                        )}
                </div>
                <div className={styles.footer}>
                    <p className={classNames(styles.changed, "text fz14 gray")}>
                        {message.changedId ? "Изменено" : ""}
                    </p>
                    <p className={classNames(styles.messageTime, "text fz14")}>
                        {messageTime}
                    </p>
                    {/* <p className={classNames(styles.messageTime, "text fz14")}>
                        {new Date(message.createdAt).getTime()}
                    </p> */}
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
    },
);

export default Message;
