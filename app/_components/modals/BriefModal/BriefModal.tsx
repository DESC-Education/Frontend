import { createRef, FC, ReactNode, RefObject } from "react";
import styles from "./BriefModal.module.scss";
import classNames from "classnames";
import Image from "next/image";

type BriefModalProps = {
    initModalState: "forStudent" | "forCompany";
};

type ModalState = "forStudent" | "forCompany";

const BriefModal: FC<BriefModalProps> = ({ initModalState }) => {

    const getModalContent = (
        modalState: ModalState,
    ): { content: ReactNode; ref: RefObject<HTMLDivElement> } => {
        switch (modalState) {
            case "forStudent":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={styles.titleBlock}>
                                <p className="title">Инструкция для студента</p>
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                };
            case "forCompany":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={styles.titleBlock}>
                                <p className="title">Инструкция для компании</p>
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                };
        }
    };


    return (
        <div className={classNames(styles.container, "container")}>
            {getModalContent(initModalState).content}
        </div>
    );
};

export default BriefModal;