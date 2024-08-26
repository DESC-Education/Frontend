import { FC, useState } from "react";
import styles from "./ChangeCredsModal.module.scss";

type ChangeCredsModalProps = {
    activeTab: "phone" | "mail";
};

const ChangeCredsModal: FC<ChangeCredsModalProps> = ({
    activeTab,
}) => {
    const [activeTabState, setActiveTabState] = useState<"phone" | "mail">(activeTab);

    return <div className={styles.container}>
        
    </div>;
};

export default ChangeCredsModal;
