"use client";
import { useParams } from "next/navigation";
import styles from "./page.module.scss";
import { getUser, getUserChat } from "@/app/_http/API/adminApi";
import { useEffect, useRef, useState } from "react";
import { IChat, IStudentInfo, IStudentProfile } from "@/app/_types";
import { set } from "zod";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import classNames from "classnames";
import Message from "@/app/chat/[chat_id]/Message/Message";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { div, s } from "framer-motion/client";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { chatSlice } from "@/app/_store/reducers/chatSlice";




const ChatStudentPage = () => {
    const { chat_id } = useParams<{ chat_id: string }>();
    const { student_id } = useParams<{ student_id: string }>();

    const [currentChat, setCurrentChat] = useState<IChat>({} as IChat);
    const [student, setStudent] = useState<IStudentInfo | null>(null);

    const dispatch = useTypesDispatch();
    const { updateIsChatHasMoreMessages, } = chatSlice.actions;

    const getChatFunc = async () => {
        if (typeof chat_id !== "string") return;

        const data = await getUserChat({
            chatId: chat_id,
            userId: student_id,
        });
        if (data.status !== 200) return;
        dispatch(updateIsChatHasMoreMessages(data.chat!.hasMoreMessages));

        setCurrentChat(prev => {
            if (!prev.messages) {
                return data.chat!;
            }
            return {
                ...prev,
                messages: [...prev.messages, ...data.chat!.messages.toReversed()],
            };
        });
        console.log(data);
    }

    const getUserFunc = async () => {
        if (typeof student_id !== "string") return;

        const data = await getUser(student_id);
        setStudent(data);
    }

    useEffect(() => {
        getChatFunc();
        getUserFunc();
    }, []);



    const [scrollContainerScrollTop, setScrollContainerScrollTop] = useState(0);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);

    const dummyRef = useRef<HTMLDivElement>(null);


    if (!Object.keys(currentChat).length) return (<div className={styles.loading}><Oval /></div>);
    return (
        <div className="container">
            <BackButton
                className={styles.backButton}
            />
            <div className={styles.chatHeader}>
                <div>
                    <Link
                        href={`/admin-panel/companies-list/${currentChat.companion.id}`}
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
                    <Link
                        href={`/admin-panel/students-list/${student_id}`}
                        className={styles.userInfo}
                    >
                        <img
                            src={
                                student
                                    ? process.env
                                        .NEXT_PUBLIC_SERVER_PATH +
                                    student.profile.logoImg
                                    : "/images/avatar.png"
                            }
                            alt="Аватар"
                            className={styles.avatar}
                        />
                        <div>
                            <h4 className={styles.userName}>
                                {student?.firstName} {student?.lastName}
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
                                    isAdminWatch={student_id}
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
        </div>
    );
}

export default ChatStudentPage;