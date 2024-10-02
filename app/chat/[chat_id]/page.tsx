"use client";

import styles from "./page.module.scss";
import { IChat, IFile, IMessage } from "../../_types/index";
import {
    createRef,
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

export default function Page() {
    const { chat_id } = useParams<{ chat_id: string }>();

    const { showAlert } = useContext(AlertContext);

    const [isChatLoading, setIsChatLoading] = useState<boolean>(true);

    const router = useRouter();

    const { chats, currentChat } = useTypesSelector(
        (state) => state.chatReducer,
    );
    const dispatch = useTypesDispatch();
    const {
        updateCurrentChat,
        addChatMessage,
        updateIsRead,
    } = chatSlice.actions;

    const createWsInstance = useCallback(() => {
        return new WebSocket(
            process.env.NEXT_PUBLIC_WS_ADDRESS! +
                `/ws/chat/${chat_id}/?token=${LocalStorage.getAccessToken()}`,
            // LocalStorage.getAccessToken(),
        );
    }, [chat_id]);

    const [ws, setWs] = useState<WebSocket | null>(null);

    useLayoutEffect(() => {
        setWs(createWsInstance());
    }, []);

    useEffect(() => {
        // console.log("in useEffect ws", ws, ws?.readyState);

        if (ws?.readyState !== WebSocket.OPEN) return;

        // console.log("ws is open");

        ws.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            const parsedPayload = JSON.parse(parsedData.payload);

            switch (parsedData.type) {
                case "message":
                    // const data = JSON.parse(event.data);
                    // const parsedPayload: IMessage = JSON.parse(data.payload);

                    dispatch(addChatMessage(parsedPayload));

                    // console.log(
                    //     "I GOT MESSAGE, parsedPayload is",
                    //     parsedPayload,
                    // );

                    break;
                case "viewed":
                    // console.log(
                    //     "I GOT VIEWED, parsedPayload is",
                    //     parsedPayload,
                    // );

                    dispatch(updateIsRead(parsedPayload));
                    break;
            }
        };

        ws.onerror = (e) => {
            showAlert("Ошибка подключения к серверу");
        };

        ws.onclose = (e) => {
            console.log("closed ws, trying to create new one", e);

            setWs(createWsInstance());
        };

        return () => {
            console.log("I KILLED SOCKET", ws);
            ws?.close();
        };
    }, [chat_id, ws?.readyState]);

    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [attachedFilesModified, setAttachedFilesModified] = useState<
        { file: File; isSent: boolean; id?: string }[]
    >([]);

    const [messageText, setMessageText] = useState<string>("");

    const sendFile = async () => {
        // console.log("sendFile", attachedFilesModified);

        if (!attachedFilesModified.length) return;

        const formdata = new FormData();

        for (const file of attachedFilesModified) {
            console.log("file in sendFile", file);

            if (file.isSent) continue;

            formdata.append("file", file.file);
            formdata.append("chat", chat_id);

            const res = await createFile(formdata);

            if (res.status === 200) {
                // console.log("file, createFile res", file, res);

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
        if (!ws) return;

        console.log("sendMessage", {
            message: messageText
                .replace(/\n{3,}/g, "\n\n")
                .trim()
                .replace(/^\n+|\n+$/g, ""),
            files: attachedFilesModified,
        });

        ws.send(
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

    useEffect(() => {
        setIsChatLoading(true);
        const asyncFunc = async () => {
            if (!currentChat?.messages || currentChat.id !== chat_id) {
                const res = await getChat(chat_id);

                // console.log("getChat res", res);

                if (res.status === 200) {
                    dispatch(
                        updateCurrentChat({
                            ...res.chat!,
                            messages: res.chat!.messages.reverse(),
                        }),
                    );
                } else {
                    router.replace("/chat");
                }
            }
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
    }, [messageText.length, attachedFilesModified.length]);

    const dummyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!currentChat?.messages.length || !dummyRef.current) return;

        dummyRef.current?.scrollIntoView({
            behavior: "instant",
        });

        setTimeout(() => {
            dummyRef.current?.scrollIntoView({
                behavior: "instant",
            });
        }, 140);
    }, [currentChat?.messages, dummyRef.current?.offsetHeight]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        console.log("what abaout out?");

        if (!textareaRef.current) return;

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textareaRef.current, messageText]);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    if (!currentChat || !currentChat?.companion || isChatLoading)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <img
                        src={
                            currentChat.companion.avatar
                                ? process.env.NEXT_PUBLIC_SERVER_PATH +
                                  currentChat.companion.avatar
                                : "/images/avatar.png"
                        }
                        alt="Аватар"
                        className={styles.avatar}
                    />
                    <div>
                        <h4 className={styles.userName}>
                            {currentChat.companion.name}
                        </h4>
                        {/* <span className={styles.userStatus}>в сети</span> */}
                    </div>
                </div>
                <div className={styles.chatActions}>
                    <img
                        src="/icons/searchIcon.svg"
                        alt="search"
                        className={styles.searchIcon}
                    />
                    <img
                        src="/icons/extraIcon.svg"
                        alt="search"
                        className={styles.pinIcon}
                    />
                </div>
            </div>
            <div className={styles.chatMessages}>
                {currentChat.messages.map((message, index) => (
                    <Message message={message} key={index} ws={ws} />
                ))}
                <div ref={dummyRef}></div>
            </div>
            <div
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log("onDrop", e, e.dataTransfer.files);

                    if (dragOverTimeoutRef.current) {
                        clearTimeout(dragOverTimeoutRef.current);
                    }

                    setIsDragging(false);

                    const files = e.dataTransfer.files;

                    if (!files.length) return;

                    const newFile = Array.from(files);

                    for (let i = 0; i < newFile.length; i++) {
                        let unsupportedFiles = false;

                        const item = newFile[i];

                        console.log("item", item);

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
                            showAlert(
                                "Один или несколько файлов слишким большие",
                            );
                            unsupportedFiles = true;
                        }

                        console.log("unsupportedFiles", unsupportedFiles);

                        if (unsupportedFiles) continue;

                        console.log(item);

                        setAttachedFiles((prev: any) => {
                            if (!prev) return newFile;
                            return [...prev, item].slice(0, 5);
                        });
                    }

                    // setAttachedFiles(Array.from(files));
                }}
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
                    type="file_multiple_chat"
                    file={attachedFiles}
                    setFile={setAttachedFiles}
                    multiple
                />
                <textarea
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
                            messageText.replaceAll("\n", "").replaceAll(" ", "")
                                .length > 0 ||
                            attachedFilesModified.length > 0
                        ) {
                            sendMessage();
                        }
                    }}
                    className={classNames(styles.send, {
                        [styles.disabled]:
                            messageText.replaceAll("\n", "").replaceAll(" ", "")
                                .length === 0 &&
                            attachedFilesModified.length === 0,
                    })}
                >
                    <img src="/icons/send.svg" alt="send" />
                </div>
            </div>
            {attachedFilesModified.length > 0 && (
                <div className={styles.attachedFiles}>
                    {attachedFilesModified.map((file, index) => (
                        <div className={styles.file} key={index}>
                            <img
                                className={styles.delete}
                                src="/icons/cross.png"
                                alt="delete"
                                onClick={() =>
                                    setAttachedFilesModified((prev) =>
                                        prev.filter((i) => i.id !== file.id),
                                    )
                                }
                            />
                            {["png", "jpg", "jpeg", "jfif"].includes(
                                file.file.name.split(".").slice(-1)[0],
                            ) ? (
                                <img
                                    key={index}
                                    className={styles.userImage}
                                    src={URL.createObjectURL(file.file)}
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
                                                .slice(-1)[0]
                                        }.png`}
                                    />
                                    <p>{file.file.name}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
