import styles from "./ChatItem.module.scss";
import classNames from "classnames";

type ChatUserProps = {
    name: string;
    status: string;
    avatar: string;
    lastMessage: string;
    lastMessageDate: string;
};


const ChatUser: React.FC<ChatUserProps> = ({
    name,
    status,
    avatar,
    lastMessage,
    lastMessageDate,
}) => {
    return (
        <div className={styles.chatItem}>
            <div className={styles.chatInfo}>
                <img src={avatar} alt="" className={styles.avatar} />
                <div className={styles.userInfo}>
                    <div className={styles.mainInfo}>
                        <h4 className="text fw500">{name}</h4>
                        <span className={classNames(styles.date, "text fz16")}>{lastMessageDate}</span>
                    </div>
                    <p className={classNames(styles.lastMessage, "text fz16")}>{lastMessage}</p>
                </div>
            </div>
            <div className={styles.chatMeta}>
            </div>
        </div>
    );
}

export default ChatUser;