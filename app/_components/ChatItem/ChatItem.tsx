import Image from "next/image";
import styles from "./ChatItem.module.scss";
import classNames from "classnames";
import Button from "../ui/Button/Button";

type ChatUserProps = {
    name: string;
    avatar: string;
    lastMessage: string;
    lastMessageDate: string;
    isRead: boolean;
};

const ChatUser: React.FC<ChatUserProps> = ({
    name,
    avatar,
    lastMessage,
    lastMessageDate,
    isRead,
}) => {
    return (
        <div className={styles.chatItem}>
            <div className={styles.chatInfo}>
                <img src={avatar} alt="avatar" className={styles.avatar} />
                <div className={styles.userInfo}>
                    <div className={styles.mainInfo}>
                        <h4 className="text fw500">{name}</h4>
                    </div>
                    <p className={classNames(styles.lastMessage, "text fz16")}>{lastMessage}</p>
                </div>
            </div>
            <div className={styles.chatMeta}>
                <span className={classNames(styles.date, "text fz16")}>{lastMessageDate}</span>
                {isRead === false ? <Image src="/icons/isReadFalse.svg" alt="" className={styles.checkMark} width={14} height={24}/> : <Image src="/icons/isReadTrue.svg" alt="" className={styles.checkMark} width={24} height={24}/>}
            </div>
        </div>
    );
}

export default ChatUser;