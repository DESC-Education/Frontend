import "../../app/_scss/globals.scss";
import styles from "./layout.module.scss";
import Link from "next/link";
import ChatItem from "../_components/ChatItem/ChatItem";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="chat-layout">
                <div className={styles.container}>
                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            <div className={styles.search}>
                                <input type="text" placeholder="Поиск" className="text" />
                            </div>
                            <div className={styles.chatList}>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <Link href={`/chat/${index}`} key={index} className={styles.chatLink}>
                                        <ChatItem
                                            name="Имя Фамилия"
                                            status="в сети"
                                            avatar="/images/userIcon.png"
                                            lastMessage="Последнее сообщение, которое пришло в чате"
                                            lastMessageDate="14.03.2024"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </aside>
                        <div className={styles.content}>{children}</div>
                    </div>
                </div>
            </body>
        </html>
    );
}