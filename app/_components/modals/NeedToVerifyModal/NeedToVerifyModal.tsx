import { FC } from "react";
import styles from "./NeedToVerifyModal.module.scss";

type NeedToVerifyModalProps = {
    item: string;
};

const NeedToVerifyModal: FC<NeedToVerifyModalProps> = ({ item }) => {
    return (
        <div className={styles.container}>
            <p className="text fz24">
                Для доступа к {item} необходимо подтвердить профиль
            </p>
        </div>
    );
};

export default NeedToVerifyModal;
