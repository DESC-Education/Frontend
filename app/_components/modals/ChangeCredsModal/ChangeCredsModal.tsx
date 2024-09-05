import {
    createRef,
    FC,
    ReactNode,
    RefObject,
    useReducer,
    useRef,
    useState,
} from "react";
import styles from "./ChangeCredsModal.module.scss";
import classNames from "classnames";
import CustomOval from "../../ui/CustomOval/CustomOval";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Image from "next/image";
import Input from "../../ui/Input/Input";
import { z } from "zod";

export const PasswordSchema = z
    .string()
    .min(6, "Пароль должен быть содержать хотя бы шесть символов")
    .regex(
        new RegExp(".*[A-Z].*"),
        "В пароле должна быть хотя бы одна буква в верхнем регистре",
    )
    .regex(
        new RegExp(".*[a-z].*"),
        "В пароле должна быть хотя бы одна буква в нижнем регистре",
    )
    .regex(new RegExp(".*[0-9].*"), "В пароле должна быть хотя бы одна цифра")
    .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "В пароле должен быть хотя бы один специальный символ",
    );

export const EmailSchema = z
    .string()
    .email("Некорректный формат электронной почты");

type ChangeCredsTabState = "phone" | "mail" | "password";

type ChangeCredsModalState = "phone" | "mail" | "password" | "code";

type ChangeCredsModalProps = {
    initActiveTab: ChangeCredsTabState;
};

type ChangeCredsState = {
    code: string;
    email: string;
    password: string;
    newPassword: string;
    emailErr: string;
    passwordErr: string;
    newPasswordErr: string;
    codeErr: string;
};

type ChangeCredsAction =
    | { type: "change_code"; code: string }
    | { type: "change_email"; email: string }
    | { type: "change_password"; password: string }
    | { type: "change_new_password"; newPassword: string }
    | { type: "change_email_err"; err: string }
    | { type: "change_password_err"; err: string }
    | { type: "change_new_password_err"; err: string }
    | { type: "change_code_err"; err: string }
    | { type: "clear_errors" }
    | { type: "clear" };

const initState = {
    code: "",
    password: "",
    newPassword: "",
    email: "",
    emailErr: "",
    passwordErr: "",
    newPasswordErr: "",
    codeErr: "",
};

const ChangeCredsModal: FC<ChangeCredsModalProps> = ({ initActiveTab }) => {
    const [activeTab, setActiveTab] = useState<ChangeCredsTabState>(
        initActiveTab,
    );
    const [modalState, setModalState] = useState<ChangeCredsModalState>(
        initActiveTab,
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const reducer = (
        state: ChangeCredsState,
        action: ChangeCredsAction,
    ): ChangeCredsState => {
        switch (action.type) {
            case "change_code": {
                return {
                    ...state,
                    code: action.code,
                };
            }
            case "change_password": {
                return {
                    ...state,
                    password: action.password,
                };
            }
            case "change_new_password": {
                return {
                    ...state,
                    newPassword: action.newPassword,
                };
            }
            case "change_email": {
                return {
                    ...state,
                    email: action.email,
                };
            }
            case "change_email_err": {
                return {
                    ...state,
                    emailErr: action.err,
                };
            }
            case "change_password_err": {
                return {
                    ...state,
                    passwordErr: action.err,
                };
            }
            case "change_new_password_err": {
                return {
                    ...state,
                    newPasswordErr: action.err,
                };
            }
            case "change_code_err": {
                return {
                    ...state,
                    codeErr: action.err,
                };
            }
            case "clear_errors": {
                return {
                    ...state,
                    codeErr: "",
                    passwordErr: "",
                    emailErr: "",
                };
            }
            case "clear": {
                return {
                    ...initState,
                    email: state.email,
                    password: state.password,
                };
            }
        }
    };

    const valPassBool = (pass: string): boolean => {
        return PasswordSchema.safeParse(pass).success;
    };

    const valEmailBool = (email: string): boolean => {
        return EmailSchema.safeParse(email).success;
    };

    const [state, authDispatch] = useReducer(reducer, initState);

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
                            // onSubmit={(e) => {
                            //     e.preventDefault();
                            //     valEmailBool(state.email) &&
                            //         valPassBool(state.newPassword) &&
                            //         state.password === state.newPassword &&
                            //         sendVerificationCodeHandler("PW");
                            // }}
                        ></form>
                    ),
                    ref: createRef(),
                };
            case "mail":
                return {
                    content: (
                        <form
                            className="formContent"
                            // onSubmit={(e) => {
                            //     e.preventDefault();
                            //     valEmailBool(state.email) &&
                            //         valPassBool(state.newPassword) &&
                            //         state.password === state.newPassword &&
                            //         sendVerificationCodeHandler("PW");
                            // }}
                        ></form>
                    ),
                    ref: createRef(),
                };
            case "password":
                return {
                    content: (
                        <form
                            className="formContent"
                            // onSubmit={(e) => {
                            //     e.preventDefault();
                            //     valEmailBool(state.email) &&
                            //         valPassBool(state.newPassword) &&
                            //         state.password === state.newPassword &&
                            //         sendVerificationCodeHandler("PW");
                            // }}
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    autoComplete="password"
                                    title="Пароль"
                                    type="password"
                                    value={state.password}
                                    onChange={(val) =>
                                        authDispatch({
                                            type: "change_password",
                                            password: val,
                                        })
                                    }
                                    errorText={state.passwordErr}
                                    onBlur={(val) => {
                                        const res = valPassBool(val);

                                        if (res || val === "") {
                                            authDispatch({
                                                type: "change_password_err",
                                                err: "",
                                            });
                                            return;
                                        }

                                        const issues = PasswordSchema.safeParse(
                                            val,
                                        ).error!.issues.map(
                                            (issue) => issue.message,
                                        );

                                        authDispatch({
                                            type: "change_password_err",
                                            err: issues!.join("\n"),
                                        });
                                    }}
                                />
                            </div>
                        </form>
                    ),
                    ref: createRef(),
                };
            case "code":
                return {
                    content: (
                        <form
                            className="formContent"
                            // onSubmit={(e) => {
                            //     e.preventDefault();
                            //     valEmailBool(state.email) &&
                            //         valPassBool(state.newPassword) &&
                            //         state.password === state.newPassword &&
                            //         sendVerificationCodeHandler("PW");
                            // }}
                        ></form>
                    ),
                    ref: createRef(),
                };
        }
    };

    const tabModalRef = useRef(null);
    const nodeRef = useRef<any>(null);

    return (
        <div
            className={classNames(styles.container, {
                [styles.loading]: isLoading,
            })}
        >
            <div className={styles.loadingScreen}>
                <CustomOval />
            </div>
            <p className="title">
                {modalState === "code"
                    ? "Подтверждение"
                    : "Смена персональных данных"}
            </p>
            <div className={styles.content}>
                <CSSTransition
                    unmountOnExit
                    in={modalState !== "code"}
                    nodeRef={tabModalRef}
                    timeout={200}
                    classNames="typeOfModal"
                >
                    <div ref={tabModalRef} className={styles.typeOfModal}>
                        <div
                            className={classNames({
                                [styles.active]: activeTab === "mail",
                            })}
                            onClick={() => setActiveTab("mail")}
                        >
                            <p className="text fz24 fw500">Почта</p>
                        </div>
                        <div
                            className={classNames({
                                [styles.active]: activeTab === "password",
                            })}
                            onClick={() => setActiveTab("password")}
                        >
                            <p className="text fz24 fw500">Пароль</p>
                        </div>
                        <div
                            className={classNames({
                                [styles.active]: activeTab === "phone",
                            })}
                            onClick={() => setActiveTab("phone")}
                        >
                            <p className="text fz24 fw500">Телефон</p>
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
