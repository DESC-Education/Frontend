import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import styles from "./layout.module.scss";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { useEffect } from "react";
import Link from "next/link";
import ChatUser from "@/app/_components/ChatItem/ChatItem";
import { IStudentProfile } from "@/app/_types";
import SideBar from "../../_components/SideBar/SideBar";





export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const chats = [
        { id: "1", companion: { id: "1", isVerified: true, name: "Igor", surname: "Petrov", logoImg: { id: "1", name: "photo", path: "/images/userIcon.png", type: "image" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile, createdAt: "14.03.2024", taskId: "1", isSupport: true, isSuspicious: false, messages: [{ id: "1", chatId: "1", text: "dfdvgdv", ticketId: "1", userId: "1", isRead: true, createdat: "14.03.2024", isVisible: true, changedId: "1" }, { id: "2", chatId: "1", text: "last message", ticketId: "1", userId: "1", isRead: true, createdat: "10.03.2024", isVisible: true, changedId: "1" }] },
        { id: "2", companion: { id: "1", isVerified: true, name: "Igor", surname: "Petrov", logoImg: { id: "1", name: "photo", path: "/images/userIcon.png", type: "image" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile, createdAt: "14.03.2024", taskId: "1", isSupport: true, isSuspicious: false, messages: [{ id: "1", chatId: "1", text: "dfdvgdv", ticketId: "1", userId: "1", isRead: true, createdat: "14.03.2024", isVisible: true, changedId: "1" }, { id: "2", chatId: "1", text: "last message", ticketId: "1", userId: "1", isRead: true, createdat: "10.03.2024", isVisible: true, changedId: "1" }] },

    ];

    return (
        <div className="container">
            <div className="selectLayout">
                <SideBar>
                    <div className={styles.chatList}>
                        {chats.map((chat, index) => {
                            if (!chat.companion.isVerified) return null;
                            return <Link href={`/admin-panel/chats/${index}`} key={index} className={styles.chatLink}>
                                <ChatUser
                                    name={chat.companion.name}
                                    avatar={chat.companion.logoImg.path}
                                    lastMessage={chat.messages[chats[index].messages.length - 1].text}
                                    lastMessageDate={chat.messages[chats[index].messages.length - 1].createdat}
                                    isRead={chat.messages[chat.messages.length - 1].isRead}
                                />
                            </Link>
                        })}
                    </div>
                </SideBar>
                {children}
            </div>
        </div>
    );
};