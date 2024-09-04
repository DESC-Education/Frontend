import { createRef, FC, useState } from "react";
import styles from "./ChangeCredsModal.module.scss";
import classNames from "classnames";
import CustomOval from "../../ui/CustomOval/CustomOval";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Image from "next/image";

type ChangeCredsModalState = "phone" | "mail" | "password";

type ChangeCredsModalProps = {
    activeTab: ChangeCredsModalProps;
};

const ChangeCredsModal: FC<ChangeCredsModalProps> = ({ activeTab }) => {
    const [activeTabState, setActiveTabState] = useState<ChangeCredsModalProps>(
        activeTab,
    );

    const getModalContent = (
        tabState: ChangeCredsModalState,
    ): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>;
    } => {
        switch (tabState) {
            case "phone":
                return {
                    content: (
                        <form
                            className="formContent"
                            onSubmit={(e) => {
                                e.preventDefault();
                                valEmailBool(state.email) &&
                                    valPassBool(state.newPassword) &&
                                    state.password === state.newPassword &&
                                    sendVerificationCodeHandler("PW");
                            }}
                        ></form>
                    ),
                    ref: createRef(),
                };
            case "mail":
                return {
                    content: (
                        <form
                            className="formContent"
                            onSubmit={(e) => {
                                e.preventDefault();
                                valEmailBool(state.email) &&
                                    valPassBool(state.newPassword) &&
                                    state.password === state.newPassword &&
                                    sendVerificationCodeHandler("PW");
                            }}
                        ></form>
                    ),
                    ref: createRef(),
                };
            case "password":
                return {
                    content: (
                        <form
                            className="formContent"
                            onSubmit={(e) => {
                                e.preventDefault();
                                valEmailBool(state.email) &&
                                    valPassBool(state.newPassword) &&
                                    state.password === state.newPassword &&
                                    sendVerificationCodeHandler("PW");
                            }}
                        ></form>
                    ),
                    ref: createRef(),
                };
        }
    };

    return (
        <div
            className={classNames(styles.container, {
                [styles.loading]: isLoading,
            })}
        >
            <div className={styles.loadingScreen}>
                <CustomOval />
            </div>
            <p className="title">{titles[modalState]}</p>
            <div className={styles.content}>
                <CSSTransition
                    unmountOnExit
                    in={modalState === "reg"}
                    nodeRef={typeOfModalRef}
                    timeout={200}
                    classNames="typeOfModal"
                >
                    <div ref={typeOfModalRef} className={styles.typeOfModal}>
                        <div
                            className={classNames({
                                [styles.active]: regState === "regClient",
                            })}
                            onClick={() => setRegState("regClient")}
                        >
                            <Image
                                src={
                                    regState === "regClient"
                                        ? "/icons/student_active.svg"
                                        : "/icons/student.svg"
                                }
                                alt="student"
                                width={32}
                                height={32}
                            />
                            <p className="text fz24 fw500">Студент</p>
                        </div>
                        <div
                            className={classNames({
                                [styles.active]: regState === "regCompany",
                            })}
                            onClick={() => setRegState("regCompany")}
                        >
                            <Image
                                src={
                                    regState === "regCompany"
                                        ? "/icons/company_active.svg"
                                        : "/icons/company.svg"
                                }
                                alt="student"
                                width={32}
                                height={32}
                            />
                            <p className="text fz24 fw500">Компания</p>
                        </div>
                    </div>
                </CSSTransition>
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={modalState}
                        timeout={200}
                        nodeRef={nodeRef}
                        addEndListener={(done: any) => {
                            nodeRef.current!.addEventListener(
                                "transitionend",
                                done,
                                false,
                            );
                        }}
                        classNames="fade"
                    >
                        <div ref={nodeRef} className="button-container">
                            {getModalContent(modalState).content}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    );
};

export default ChangeCredsModal;
