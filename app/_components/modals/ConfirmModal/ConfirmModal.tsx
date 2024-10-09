import { FC } from "react";
import styles from "./ConfirmModal.module.scss";
import Button from "../../ui/Button/Button";

type ConfirmModalProps = {
    text: string | React.ReactNode;
    onConfirm: () => void;
    buttonText?: string;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
    text,
    onConfirm,
    buttonText = "Подтвердить",
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.text}>{text}</div>
            <div className={styles.buttons}>
                <Button type="secondary" onClick={() => onConfirm()}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmModal;
