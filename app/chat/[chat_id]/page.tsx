"use client";

import styles from "./page.module.scss";
import "./page.scss";
import { IChat, IFile, IMessage } from "../../_types/index";
import {
    createRef,
    UIEventHandler,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import Message from "./Message/Message";
import { createFile, getChat } from "@/app/_http/API/chatsApi";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { chatSlice } from "@/app/_store/reducers/chatSlice";
import LocalStorage from "@/app/_utils/LocalStorage";
import Input from "@/app/_components/ui/Input/Input";
import { AlertContext } from "@/app/_context/AlertContext";
import Button from "@/app/_components/ui/Button/Button";
import Link from "next/link";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import { MAX_MESSAGE_LENGTH } from "@/app/_utils/constants";

type AttachedFileModifiedType = { file: File; isSent: boolean; id?: string };

export default function Page() {
    const { chat_id } = useParams<{ chat_id: string }>();

    const { showAlert } = useContext(AlertContext);

    const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
    const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
    const [isWsLoading, setIsWsLoading] = useState<boolean>(true);

    const router = useRouter();

    const { user } = useTypesSelector((state) => state.userReducer);
    const { chats, currentChat, messagesPerRequest } = useTypesSelector(
        (state) => state.chatReducer,
    );
    const { screenWidth } = useTypesSelector((state) => state.contentReducer);
    const dispatch = useTypesDispatch();
    const {
        updateCurrentChat,
        addChatMessage,
        updateIsRead,
        updateIsChatHasMoreMessages,
        updateLastMessage,
        updateLastMessageViewed,
        updateUnreadChatsCount,
    } = chatSlice.actions;

    const createWsInstance = useCallback(() => {
        const newWs = new WebSocket(
            process.env.NEXT_PUBLIC_WS_ADDRESS! +
                `/ws/chat/${chat_id}/?token=${LocalStorage.getAccessToken()}`,
        );

        return newWs;
    }, [chat_id]);

    const wsRef = useRef<WebSocket>();
    const [wsReadyState, setWsReadyState] = useState<number>(0);

    useLayoutEffect(() => {
        wsRef.current = createWsInstance();
    }, []);

    useEffect(() => {
        if (!wsRef.current) return;

        wsRef.current.onopen = (e) => {
            setIsWsLoading(false);
            setWsReadyState(WebSocket.OPEN);
        };

        wsRef.current.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            const parsedPayload: any = JSON.parse(parsedData.payload);

            switch (parsedData.type) {
                case "message":
                    dispatch(addChatMessage(parsedPayload));

                    if (parsedPayload.user.id === user.id) {
                        dispatch(
                            updateLastMessage({
                                chatId: chat_id,
                                message: parsedPayload,
                                myMessage: true,
                            }),
                        );
                    }
                    break;
            }
        };

        wsRef.current.onerror = (e) => {
            if (e.eventPhase === WebSocket.CLOSING) return;

            setIsWsLoading(true);

            showAlert("Ошибка при загрузке чата");
        };

        wsRef.current.onclose = (e) => {
            setWsReadyState(WebSocket.CLOSED);
        };
    }, [chat_id, wsRef.current]);

    useEffect(() => {
        return () => {
            wsRef.current?.close();
        };
    }, []);

    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [attachedFilesModified, setAttachedFilesModified] = useState<
        AttachedFileModifiedType[]
    >([]);

    const [messageText, setMessageText] = useState<string>("");

    useEffect(() => {
        if (messageText.length > MAX_MESSAGE_LENGTH) {
            setMessageText((prev) => prev.slice(0, MAX_MESSAGE_LENGTH));
        }
    }, [messageText]);

    const validateFiles = (e: any, event: "drop" | "paste") => {
        if (event === "paste") {
            if (e.clipboardData.getData("Text")) {
                setMessageText(
                    (prev) => prev + e.clipboardData.getData("Text"),
                );
            }
        }
        e.preventDefault();
        e.stopPropagation();

        if (dragOverTimeoutRef.current) {
            clearTimeout(dragOverTimeoutRef.current);
        }
        setIsDragging(false);

        let files: FileList;

        if (event === "drop") {
            if (!e.dataTransfer?.files.length) return;

            files = e.dataTransfer.files;
        } else {
            if (!e.clipboardData?.files.length) return;

            files = e.clipboardData.files;
        }

        if (!files.length) return;

        const newFile = Array.from(files);

        for (let i = 0; i < newFile.length; i++) {
            let unsupportedFiles = false;

            const item: any = newFile[i];

            if (
                ![
                    "pdf",
                    "vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "png",
                    "jpg",
                    "jpeg",
                ].includes(item.type.split("/")[1])
            ) {
                showAlert(
                    "Формат одного или нескольких файлов не поддерживается",
                );
                unsupportedFiles = true;
            }

            if (item.size > 5e6) {
                showAlert("Один или несколько файлов слишким большие");
                unsupportedFiles = true;
            }

            if (unsupportedFiles) continue;

            setAttachedFiles((prev: any) => {
                if (!prev) return newFile;
                return [...prev, item].slice(0, 5);
            });
        }
    };

    const sendFile = async () => {
        if (!attachedFilesModified.length) return;

        const formdata = new FormData();

        for (const file of attachedFilesModified) {
            if (file.isSent) continue;

            formdata.append("file", file.file);
            formdata.append("chat", chat_id);

            const res = await createFile(formdata);

            if (res.status === 200) {
                setAttachedFilesModified((prev) => {
                    return prev.map((i) => {
                        if (i.file.size === file.file.size) {
                            return { ...i, isSent: true, id: res.file!.id };
                        }
                        return i;
                    });
                });
            } else if (res.status !== 401) {
                showAlert("Произошла ошибка при загрузке файла!");
            }
        }
    };

    const sendMessage = async () => {
        if (!wsRef.current) return;

        const establishWs = async () => {
            if (wsRef.current?.readyState === WebSocket.CLOSED) {
                wsRef.current = createWsInstance();

                while (wsRef.current.readyState !== 1) {
                    await new Promise((r) => setTimeout(r, 50));
                }
            }
        };

        await establishWs();

        wsRef.current.send(
            JSON.stringify({
                type: "message",
                payload: {
                    message: messageText
                        .replace(/\n{3,}/g, "\n\n")
                        .trim()
                        .replace(/^\n+|\n+$/g, ""),
                    files: attachedFilesModified.map((i) => i.id),
                },
            }),
        );

        setMessageText("");
        setAttachedFiles([]);
    };

    const isTotalLoading =
        !currentChat || !currentChat?.companion || isChatLoading || isWsLoading;

    useEffect(() => {
        setIsChatLoading(true);
        const asyncFunc = async () => {
            const res = await getChat({
                id: chat_id,
                page_size: messagesPerRequest,
                page: 1,
            });

            if (res.status === 200) {
                dispatch(updateIsChatHasMoreMessages(res.hasMoreMessages!));
                dispatch(
                    updateCurrentChat({
                        ...res.chat!,
                        id: chat_id,
                        messages: res.chat!.messages.reverse(),
                    }),
                );
            } else {
                router.replace("/chat");
            }
            // }
            setIsChatLoading(false);
        };
        asyncFunc();
    }, []);

    useEffect(() => {
        setAttachedFilesModified(
            attachedFiles.map((i) => ({ file: i, isSent: false })),
        );
    }, [attachedFiles]);

    useEffect(() => {
        if (!attachedFiles?.length) {
            return;
        }

        sendFile();
    }, [attachedFilesModified]);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (e.shiftKey) {
                    return;
                } else {
                    e.preventDefault();
                    e.stopPropagation();

                    if (
                        messageText.replaceAll("\n", "").replaceAll(" ", "")
                            .length > 0 ||
                        attachedFilesModified.length > 0
                    ) {
                        sendMessage();
                    }
                }
            }
        };

        window.addEventListener("keydown", listener);

        return () => {
            window.removeEventListener("keydown", listener);
        };
    }, [messageText.length, attachedFilesModified.map((i) => i?.id)]);

    const dummyRef = useRef<HTMLDivElement>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollContainerScrollTop, setScrollContainerScrollTop] = useState(0);
    const [
        scrollContainerScrollHeight,
        setScrollContainerScrollHeight,
    ] = useState(0);

    useEffect(() => {
        if (!scrollContainerRef.current?.scrollHeight) return;

        setScrollContainerScrollHeight(scrollContainerRef.current.scrollHeight);
    }, [scrollContainerRef.current?.scrollHeight]);

    useEffect(() => {
        if (!textareaRef.current) return;

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textareaRef.current, messageText]);

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const listenerDragEnter = (e: any) => {
            e.preventDefault();

            setIsDragging(true);
        };

        const listenerDragOver = (e: any) => {
            e.preventDefault();

            if (dragOverTimeoutRef.current) {
                clearTimeout(dragOverTimeoutRef.current);
            }

            dragOverTimeoutRef.current = setTimeout(() => {
                setIsDragging(false);
            }, 120);
        };

        window.addEventListener("dragenter", listenerDragEnter);
        window.addEventListener("dragover", listenerDragOver);

        return () => {
            window.removeEventListener("dragenter", listenerDragEnter);
            window.removeEventListener("dragover", listenerDragOver);
        };
    }, []);

    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!currentChat?.messages.length || isTotalLoading) return;

        dummyRef.current?.scrollIntoView({
            behavior: "instant",
            block: "end",
            inline: "nearest",
        });

        setTimeout(() => {
            dummyRef.current?.scrollIntoView({
                behavior: "instant",
                block: "end",
                inline: "nearest",
            });
        }, 140);
    }, [isTotalLoading]);

    const [lastLength, setLastLength] = useState(0);

    // useEffect(() => {
    //     return () => {
    //         if (!currentChat?.messages) return;
    //         setLastLength(currentChat?.messages.length);
    //     };
    // }, [currentChat?.messages.length]);

    useEffect(() => {
        if (!currentChat?.messages.length || isTotalLoading) return;

        if (
            currentChat.messages.length - lastLength === 1 ||
            (lastLength === 0 &&
                currentChat.messages.length > messagesPerRequest * 2)
        ) {
            dummyRef.current?.scrollIntoView({
                behavior: "instant",
                block: "end",
                inline: "nearest",
            });
            setTimeout(() => {
                dummyRef.current?.scrollIntoView({
                    behavior: "instant",
                    block: "end",
                    inline: "nearest",
                });
            }, 50);
        }

        setLastLength(currentChat.messages.length);
    }, [currentChat?.messages.length, isTotalLoading]);

    useEffect(() => {
        if (
            !currentChat?.messages.length ||
            isTotalLoading ||
            !scrollContainerRef.current ||
            currentChat.messages.length === lastLength ||
            currentChat.messages.length - 1 === lastLength ||
            lastLength === 0
        )
            return;

        // Was invented empirically
        scrollContainerRef.current.scrollTop =
            scrollContainerRef.current?.scrollHeight +
            16 -
            scrollContainerScrollHeight;
    }, [
        currentChat?.messages.length,
        isTotalLoading,
        scrollContainerScrollTop,
        scrollContainerScrollHeight,
    ]);

    return (
        <SwitchTransition>
            <CSSTransition
                key={String(isTotalLoading)}
                nodeRef={nodeRef}
                addEndListener={(done: any) => {
                    nodeRef.current!.addEventListener(
                        "transitionend",
                        done,
                        false,
                    );
                }}
                timeout={120}
                classNames="fade"
            >
                <div
                    ref={nodeRef}
                    className={classNames({
                        centerContent: isTotalLoading,
                        [styles.container]: !isTotalLoading,
                    })}
                >
                    {isTotalLoading ? (
                        <CustomOval />
                    ) : (
                        <>
                            <div className={styles.chatHeader}>
                                <div>
                                    {screenWidth < 1024 && (
                                        <BackButton
                                            className={styles.backButton}
                                        />
                                    )}
                                    <Link
                                        href={
                                            user.role === "company"
                                                ? `/profile/student/${currentChat.companion.id}`
                                                : `/profile/company/${currentChat.companion.id}`
                                        }
                                        className={styles.userInfo}
                                    >
                                        <img
                                            src={
                                                currentChat.companion.avatar
                                                    ? process.env
                                                          .NEXT_PUBLIC_SERVER_PATH +
                                                      currentChat.companion
                                                          .avatar
                                                    : "/images/avatar.png"
                                            }
                                            alt="Аватар"
                                            className={styles.avatar}
                                        />
                                        <div>
                                            <h4 className={styles.userName}>
                                                {currentChat.companion.name}
                                            </h4>
                                        </div>
                                    </Link>
                                </div>
                                {!!currentChat.task?.title && (
                                    <Link
                                        href={`/tasks/${currentChat.task.id}`}
                                        className={classNames(
                                            styles.title,
                                            "text fz16",
                                        )}
                                    >
                                        Чат по заданию: {currentChat.task.title}
                                    </Link>
                                )}
                                <div></div>
                            </div>
                            <div
                                onScroll={(e: any) =>
                                    setScrollContainerScrollTop(
                                        e.target.scrollTop,
                                    )
                                }
                                ref={scrollContainerRef}
                                className={classNames(styles.chatMessages, {
                                    [styles.loading]: isMessagesLoading,
                                })}
                            >
                                <div className={styles.messagesLoader}>
                                    <CustomOval />
                                </div>
                                <div className={styles.chatMessagesContainer}>
                                    {currentChat.messages.length > 0 ? (
                                        currentChat.messages.map(
                                            (message, index) => (
                                                <Message
                                                    setIsMessagesLoading={
                                                        setIsMessagesLoading
                                                    }
                                                    ref={scrollContainerRef}
                                                    isFirst={index === 0}
                                                    message={message}
                                                    key={index}
                                                    ws={wsRef.current!}
                                                    wsStatus={wsReadyState}
                                                />
                                            ),
                                        )
                                    ) : (
                                        <div className="centerContent">
                                            <p className="text fz28 fw500 gray center">
                                                Тут пока нет сообщений!
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={styles.dummy}
                                    ref={dummyRef}
                                ></div>
                            </div>
                            <div
                                onDrop={(e) => validateFiles(e, "drop")}
                                className={classNames(styles.messageInput, {
                                    [styles.dragging]: isDragging,
                                })}
                            >
                                <div className={styles.dragOverlay}>
                                    <div className={styles.dragOverlayText}>
                                        Перетащите файлы сюда
                                    </div>
                                </div>
                                <Input
                                    accept="image/png, image/jpeg, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    type="file_multiple_chat"
                                    file={attachedFiles}
                                    setFile={setAttachedFiles}
                                    multiple
                                />
                                <textarea
                                    onPaste={(e) => validateFiles(e, "paste")}
                                    rows={1}
                                    ref={textareaRef}
                                    style={{
                                        height: `${textareaRef.current?.scrollHeight}px`,
                                    }}
                                    placeholder="Напишите сообщение..."
                                    value={messageText}
                                    onChange={(e) => {
                                        setMessageText(e.target.value);
                                    }}
                                />
                                <div
                                    onClick={() => {
                                        if (
                                            messageText
                                                .replaceAll("\n", "")
                                                .replaceAll(" ", "").length >
                                                0 ||
                                            attachedFilesModified.length > 0
                                        ) {
                                            sendMessage();
                                        }
                                    }}
                                    className={classNames(styles.send, {
                                        [styles.disabled]:
                                            messageText
                                                .replaceAll("\n", "")
                                                .replaceAll(" ", "").length ===
                                                0 &&
                                            attachedFilesModified.length === 0,
                                    })}
                                >
                                    <img src="/icons/send.svg" alt="send" />
                                </div>
                            </div>
                            {attachedFilesModified.length > 0 && (
                                <div className={styles.attachedFiles}>
                                    {attachedFilesModified.map(
                                        (file, index) => (
                                            <div
                                                className={styles.file}
                                                key={index}
                                            >
                                                <img
                                                    className={styles.delete}
                                                    src="/icons/cross.png"
                                                    alt="delete"
                                                    onClick={() =>
                                                        setAttachedFilesModified(
                                                            (prev) =>
                                                                prev.filter(
                                                                    (i) =>
                                                                        i.id !==
                                                                        file.id,
                                                                ),
                                                        )
                                                    }
                                                />
                                                {[
                                                    "png",
                                                    "jpg",
                                                    "jpeg",
                                                    "jfif",
                                                ].includes(
                                                    file.file.name
                                                        .split(".")
                                                        .slice(-1)[0],
                                                ) ? (
                                                    <img
                                                        key={index}
                                                        className={
                                                            styles.userImage
                                                        }
                                                        src={URL.createObjectURL(
                                                            file.file,
                                                        )}
                                                        alt="logo"
                                                    />
                                                ) : (
                                                    <>
                                                        <img
                                                            key={index}
                                                            className={classNames(
                                                                styles.userImage,
                                                                styles.imgDocument,
                                                            )}
                                                            src={`/icons/extensions/${
                                                                file.file.name
                                                                    .split(".")
                                                                    .slice(
                                                                        -1,
                                                                    )[0]
                                                            }.png`}
                                                        />
                                                        <p>{file.file.name}</p>
                                                    </>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
}
