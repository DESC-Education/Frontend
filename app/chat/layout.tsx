import "/app/scss/globals.scss";
import styles from "./layout.module.scss";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="chat-layout">
                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.search}>
                            <input type="text" placeholder="Поиск" />
                        </div>
                        <ul className={styles.chatList}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li key={index} className={styles.chatItem}>
                                    <div className={styles.chatInfo}>
                                        <h4>Имя Фамилия</h4>
                                        <p>Последнее сообщение, котор...</p>
                                    </div>
                                    <div className={styles.chatMeta}>
                                        <span className={styles.date}>14.03.2024</span>
                                        <span className={styles.star}>⭐</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <main className={styles.content}>{children}</main>
                </div>
            </body>
        </html>
    );
}