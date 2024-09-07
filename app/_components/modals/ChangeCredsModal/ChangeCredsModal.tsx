import {
    createRef,
    FC,
    ReactNode,
    RefObject,
    useContext,
    useEffect,
    useMemo,
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
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import {
    recoverPassword,
    sendVerificationCode,
    verifyEmailChange,
} from "@/app/_http/API/userApi";
import { AlertContext } from "@/app/_context/AlertContext";
import {
    sendPhoneVerificationCode,
    verifyPhone,
} from "@/app/_http/API/profileApi";
import { ModalContext } from "@/app/_context/ModalContext";
import Button from "../../ui/Button/Button";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import Timer from "../../ui/Timer/Timer";
import { TIMER_TIME } from "@/app/_utils/constants";

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
    phone: string;
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
    | { type: "change_phone"; phone: string }
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
    phone: "",
    email: "",
    emailErr: "",
    passwordErr: "",
    newPasswordErr: "",
    codeErr: "",
};

const titles = {
    mail: "Смена почты",
    phone_add: "Добавление телефона",
    phone: "Смена телефона",
    password: "Смена пароля",
    code: "Подтверждение",
};

const messages = {
    phone: "На ваш телефон отправлен код подтверждения",
    mail: "На новую почту отправлен код подтверждения",
    password: "На ваш почту отправлен код подтверждения",
    code: "",
};

const ChangeCredsModal: FC<ChangeCredsModalProps> = ({ initActiveTab }) => {
    const [activeTab, setActiveTab] = useState<ChangeCredsTabState>(
        initActiveTab,
    );
    const [modalState, setModalState] = useState<ChangeCredsModalState>(
        initActiveTab,
    );
    const { user, studentProfile, companyProfile } = useTypesSelector(
        (state) => state.userReducer,
    );
    const {
        updateCompanyProfile,
        updateStudentProfile,
        updateUser,
    } = userSlice.actions;
    const dispatch = useTypesDispatch();

    const { showAlert } = useContext(AlertContext);
    const { closeModal } = useContext(ModalContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCodeSentAgain, setIsCodeSentAgain] = useState<boolean>(false);
    const [isCodeTimerTimeUp, setIsCodeTimerTimeUp] = useState<boolean>(false);

    const [timerState, setTimerState] = useState<
        "paused" | "running" | "stopped"
    >("paused");

    useEffect(() => {
        setModalState(activeTab);
    }, [activeTab]);

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
            case "change_phone": {
                return {
                    ...state,
                    phone: action.phone,
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

    const getValidPhone = (phone: string) => {
        return phone
            .replaceAll(" ", "")
            .replaceAll("-", "")
            .replaceAll("(", "")
            .replaceAll(")", "");
    };

    const sendVerificationCodeHandler = async (
        type: "PH" | "PW" | "EM",
        again: boolean = false,
    ) => {
        setIsLoading(true);
        setTimerState("running");

        let res;

        if (type === "PH") {
            res = await sendPhoneVerificationCode({
                phone: getValidPhone(state.phone),
            });
        } else {
            res = await sendVerificationCode({
                type,
                email: state.email,
            });
        }

        if (res.status === 200) {
            setModalState("code");

            if (again) {
                setTimerState("stopped");
                setIsCodeSentAgain(true);
            }
        } else if (res.status === 409) {
            setModalState("code");
        } else {
            showAlert!(JSON.stringify(res.message));

            if (again) {
                setTimerState("running");
            }
        }

        setIsLoading(false);
    };

    const verifyCodeHandler = async () => {
        setIsLoading(true);

        if (lastModalState === "phone") {
            const res = await verifyPhone({
                phone: getValidPhone(state.phone),
                code: Number(state.code),
            });

            if (res.status === 200) {
                setTimerState("stopped");
                showAlert("Телефон успешно подтвержден!", "success");
                if (user.role === "student") {
                    dispatch(
                        updateStudentProfile({
                            ...studentProfile,
                            phone: res.phone!,
                        }),
                    );
                } else {
                    dispatch(
                        updateCompanyProfile({
                            ...companyProfile,
                            phone: res.phone!,
                        }),
                    );
                }
                closeModal();
            } else {
                showAlert(JSON.stringify(res.message), "error");
            }
        } else if (lastModalState === "mail") {
            const res = await verifyEmailChange({
                code: Number(state.code),
            });

            if (res.status === 200) {
                setTimerState("stopped");
                showAlert("Почта успешно подтверждена!", "success");
                dispatch(updateUser({ ...user, email: state.email }));
                closeModal();
            } else {
                showAlert(JSON.stringify(res.message), "error");
            }
        } else {
            const res = await recoverPassword({
                code: Number(state.code),
                email: user.email,
                new_password: state.newPassword,
            });

            if (res.status === 200) {
                setTimerState("stopped");
                showAlert("Пароль успешно изменен!", "success");
                closeModal();
            } else {
                showAlert(JSON.stringify(res.message), "error");
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setIsCodeTimerTimeUp(false);
        setIsCodeSentAgain(false);
    }, [modalState]);

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
                            onSubmit={(e) => {
                                e.preventDefault();
                                state.phone.length === 18 &&
                                    sendVerificationCodeHandler("PH");
                            }}
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    title={
                                        activeProfile.phone
                                            ? "Новый номер телефона"
                                            : "Номер телефона"
                                    }
                                    type="tel"
                                    value={state.phone}
                                    onChange={(val) =>
                                        authDispatch({
                                            type: "change_phone",
                                            phone: val,
                                        })
                                    }
                                />
                            </div>
                            <Button
                                disabled={state.phone.length !== 18}
                                htmlType="submit"
                                className={styles.resButton}
                                type="secondary"
                            >
                                Продолжить
                            </Button>
                        </form>
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
                                    sendVerificationCodeHandler("EM");
                            }}
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    title="Новый адрес электронной почты"
                                    type="email"
                                    value={state.email}
                                    onChange={(val) =>
                                        authDispatch({
                                            type: "change_email",
                                            email: val,
                                        })
                                    }
                                    errorText={state.emailErr}
                                    onBlur={(val) => {
                                        const res = valEmailBool(val);

                                        if (res || val === "") {
                                            authDispatch({
                                                type: "change_email_err",
                                                err: "",
                                            });
                                            return;
                                        }

                                        const issues = EmailSchema.safeParse(
                                            val,
                                        ).error!.issues.map(
                                            (issue) => issue.message,
                                        );

                                        authDispatch({
                                            type: "change_email_err",
                                            err: issues!.join("\n"),
                                        });
                                    }}
                                />
                            </div>
                            <Button
                                htmlType="submit"
                                className={styles.resButton}
                                type="secondary"
                                disabled={!valEmailBool(state.email)}
                            >
                                Продолжить
                            </Button>
                        </form>
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
                                valPassBool(state.newPassword) &&
                                    state.password === state.newPassword &&
                                    sendVerificationCodeHandler("PW");
                            }}
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    autoComplete="password"
                                    title="Новый пароль"
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
                            <div className={styles.inputContainer}>
                                <Input
                                    autoComplete="password"
                                    title="Повторите пароль"
                                    type="password"
                                    value={state.newPassword}
                                    onChange={(val) =>
                                        authDispatch({
                                            type: "change_new_password",
                                            newPassword: val,
                                        })
                                    }
                                    errorText={state.newPasswordErr}
                                    onBlur={(val) => {
                                        if (
                                            val === state.password ||
                                            val === ""
                                        ) {
                                            authDispatch({
                                                type: "change_new_password_err",
                                                err: "",
                                            });
                                            return;
                                        }

                                        if (val !== state.password) {
                                            authDispatch({
                                                type: "change_new_password_err",
                                                err: "Пароли не совпадают",
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                htmlType="submit"
                                className={styles.resButton}
                                type="secondary"
                                disabled={
                                    !valPassBool(state.password) ||
                                    !valPassBool(state.newPassword) ||
                                    state.password !== state.newPassword
                                }
                            >
                                Продолжить
                            </Button>
                        </form>
                    ),
                    ref: createRef(),
                };
            case "code":
                return {
                    content: (
                        <form
                            className="formContent"
                            onSubmit={(e) => {
                                e.preventDefault();
                                !state.code.includes("_") &&
                                    verifyCodeHandler();
                            }}
                        >
                            <p
                                className={classNames(
                                    "text fz20 fw500",
                                    styles.hintText,
                                )}
                            >
                                {messages[lastModalState]}
                                {/* На вашу почту выслан 4-ех значный код */}
                                {/* подтверждения */}
                            </p>
                            <div className={styles.inputContainer}>
                                <Input
                                    title="Введите код из письма"
                                    type="code"
                                    value={state.code}
                                    onChange={(val) =>
                                        authDispatch({
                                            type: "change_code",
                                            code: val,
                                        })
                                    }
                                />
                            </div>
                            <Button
                                htmlType="submit"
                                className={styles.resButton}
                                type="secondary"
                                disabled={state.code.includes("_")}
                            >
                                Продолжить
                            </Button>
                            {isCodeSentAgain ? (
                                <div className={styles.tipBlock}>
                                    <p className="text fz20 fw500 center">
                                        Код отправлен!
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.tipBlock}>
                                    <p
                                        className={classNames(
                                            "text fz20 fw500 center",
                                            styles.tip,
                                        )}
                                    >
                                        Не приходит код?
                                    </p>
                                    <div className={styles.timerContainer}>
                                        {isCodeTimerTimeUp ? (
                                            <span
                                                className="text fz20 blue under pointer"
                                                onClick={() => {
                                                    sendVerificationCodeHandler(
                                                        lastModalState ===
                                                            "mail"
                                                            ? "EM"
                                                            : lastModalState ===
                                                              "password"
                                                            ? "PW"
                                                            : "PH",
                                                        true,
                                                    );
                                                }}
                                            >
                                                Отправить повторно
                                            </span>
                                        ) : (
                                            <>
                                                <p className="text fz20 fw500">
                                                    Отправить повторно через
                                                </p>
                                                <Timer
                                                    handlerTimeUp={() =>
                                                        setIsCodeTimerTimeUp(
                                                            true,
                                                        )
                                                    }
                                                    autostart
                                                    time={TIMER_TIME}
                                                    state={timerState}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </form>
                    ),
                    ref: createRef(),
                };
        }
    };

    const activeProfile = useMemo(() => {
        if (user.role === "student") {
            return studentProfile;
        } else {
            return companyProfile;
        }
    }, [studentProfile, companyProfile]);

    const [lastModalState, setLastModalState] = useState<ChangeCredsModalState>(
        modalState,
    );

    useEffect(() => {
        return () => {
            setLastModalState(modalState);
        };
    }, [modalState]);

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
                {
                    titles[
                        !activeProfile.phone && modalState === "phone"
                            ? "phone_add"
                            : modalState
                    ]
                }
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
                                [styles.active]: activeTab === "phone",
                            })}
                            onClick={() => setActiveTab("phone")}
                        >
                            <p className="text fz24 fw500">Телефон</p>
                        </div>
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
