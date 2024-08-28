import {
    createRef,
    FC,
    ReactNode,
    RefObject,
    use,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
import styles from "./AuthModal.module.scss";
import "./AuthModal.scss";
import classNames from "classnames";
import Image from "next/image";
import Input from "../../ui/Input/Input";
import z, { set } from "zod";
import Link from "next/link";
import Button from "../../ui/Button/Button";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import {
    loginUser,
    recoverPassword,
    registerUser,
    sendVerificationCode,
    verifyEmail,
} from "@/app/_http/API/userApi";
import { AlertContext } from "@/app/_context/AlertContext";
import { ModalContext } from "@/app/_context/ModalContext";
import Timer, { TimerState } from "../../ui/Timer/Timer";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import CustomOval from "../../ui/CustomOval/CustomOval";

export const PasswordSchema = z.string();

// export const PasswordSchema = z
//     .string()
//     .min(6, "Пароль должен быть содержать хотя бы шесть символов")
//     .regex(
//         new RegExp(".*[A-Z].*"),
//         "В пароле должна быть хотя бы одна буква в верхнем регистре",
//     )
//     .regex(
//         new RegExp(".*[a-z].*"),
//         "В пароле должна быть хотя бы одна буква в нижнем регистре",
//     )
//     .regex(new RegExp(".*[0-9].*"), "В пароле должна быть хотя бы одна цифра")
//     .regex(
//         new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
//         "В пароле должен быть хотя бы один специальный символ",
//     );

// export const EmailSchema = z
//     .string()
//     .email("Некорректный формат электронной почты");
export const EmailSchema = z.string();

type AuthState = {
    code: string;
    email: string;
    password: string;
    newPassword: string;
    checkPrivacy: boolean;
    emailErr: string;
    passwordErr: string;
    newPasswordErr: string;
    codeErr: string;
};

type AuthAction =
    | { type: "change_code"; code: string }
    | { type: "change_email"; email: string }
    | { type: "change_password"; password: string }
    | { type: "change_new_password"; newPassword: string }
    | { type: "change_email_err"; err: string }
    | { type: "change_check_privacy"; check: boolean }
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
    checkPrivacy: true,
    emailErr: "",
    passwordErr: "",
    newPasswordErr: "",
    codeErr: "",
};

const titles = {
    reg: "Регистрация",
    login: "Вход",
    regCode: "Подтверждение регистрации",
    password: "Регистрация",
    recover: "Восстановление пароля",
    recoverCode: "Подтверждение",
    newPassword: "Новый пароль",
};

type AuthModalProps = {
    initModalState: "reg" | "login";
};

type ModalState = "reg" | "login" | "regCode" | "recover" | "recoverCode";

const TIMER_TIME = 59;

const AuthModal: FC<AuthModalProps> = ({ initModalState }) => {
    const [modalState, setModalState] = useState<ModalState>(initModalState);

    const [regState, setRegState] = useState<"regClient" | "regCompany">(
        "regClient",
    );

    const { showAlert } = useContext(AlertContext);
    const { showModal, closeModal } = useContext(ModalContext);

    const reducer = (state: AuthState, action: AuthAction): AuthState => {
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
            case "change_check_privacy": {
                return {
                    ...state,
                    checkPrivacy: action.check,
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

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { authUser } = userSlice.actions;
    const dispatch = useTypesDispatch();

    const [state, authDispatch] = useReducer(reducer, initState);

    const valPassBool = (pass: string): boolean => {
        return PasswordSchema.safeParse(pass).success;
    };

    const valEmailBool = (email: string): boolean => {
        return EmailSchema.safeParse(email).success;
    };

    const valCodeBool = (code: string): boolean => {
        return !code.includes("_");
    };

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (modalState === "regCode") {
                    valCodeBool(state.code) && verifyRegCodeHandler();
                } else if (modalState === "recoverCode") {
                    valCodeBool(state.code) && recoverHandler();
                }
            }
        };

        if (modalState === "regCode" || modalState === "recoverCode") {
            window.addEventListener("keydown", listener);
        }

        return () => {
            window.removeEventListener("keydown", listener);
        };
    }, [modalState, state.code]);

    const registerHandler = async () => {
        setIsLoading(true);

        const res = await registerUser({
            email: state.email,
            password: state.password,
        });

        if (res.status === 200) {
            setModalState("regCode");
            setTimerState("running");
        } else {
            showAlert(res.message);
        }

        setIsLoading(false);
    };

    const sendVerificationCodeHandler = async (type: "RG" | "PW" | "EM") => {
        setIsLoading(true);
        setTimerState("running");
        const res = await sendVerificationCode({
            type,
            email: state.email,
        });

        if (res.status === 200) {
            showAlert!("Код отправлен", "success");
        } else {
            showAlert!(res.message);
        }

        setIsLoading(false);
    };

    const verifyRegCodeHandler = async () => {
        setIsLoading(true);
        setCodeSentAgain(false);
        
        const res = await verifyEmail({
            email: state.email,
            code: Number(state.code),
        });
        
        if (res.status === 200) {
            setTimerState("stopped");
            showAlert("Почта успешно подтверждена!", "success");
            dispatch(authUser({ user: res.user!, tokens: res.tokens! }));
            closeModal();
        } else {
            showAlert!(res.message);
        }
        setIsLoading(false);
    };

    const loginHandler = async () => {
        setIsLoading(true);
        const res = await loginUser({
            email: state.email,
            password: state.password,
        });

        if (res.status === 200) {
            showAlert!("Вы успешно вошли в аккаунт!", "success");
            dispatch(authUser({ user: res.user!, tokens: res.tokens! }));
            closeModal();
        } else if (res.status === 406) {
            setModalState("regCode");
            setTimerState("running");
        } else {
            showAlert!(res.message);
        }
        setIsLoading(false);
    };

    const recoverHandler = async () => {
        setIsLoading(true);
        const res = await recoverPassword({
            email: state.email,
            code: Number(state.code),
            new_password: state.password,
        });

        if (res.status === 200) {
            showAlert!("Пароль успешно изменен", "success");
            setModalState("login");
            closeModal();
        } else {
            showAlert!(res.message);
        }
        setIsLoading(false);
    };

    const [timerState, setTimerState] = useState<TimerState>("paused");
    const [codeSentAgain, setCodeSentAgain] = useState<boolean>(false);
    const [isSentAgain, setIsSentAgain] = useState<boolean>(false);

    const getModalContent = (
        modalState: ModalState,
    ): { content: ReactNode; ref: RefObject<HTMLDivElement> } => {
        switch (modalState) {
            case "reg":
                return {
                    content: (
                        <form
                            className="formContent"
                            onSubmit={(e) => {
                                e.preventDefault();
                                valEmailBool(state.email) &&
                                    valPassBool(state.password) &&
                                    state.checkPrivacy &&
                                    registerHandler();
                            }}
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    title="Электронная почта"
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
                            <div className={styles.inputContainer}>
                                <Input
                                    type="checkbox"
                                    checked={state.checkPrivacy}
                                    onCheck={(val) =>
                                        authDispatch({
                                            type: "change_check_privacy",
                                            check: val,
                                        })
                                    }
                                    labelContent={
                                        <p
                                            className={classNames(
                                                styles.labelContent,
                                                "text fz20 fw500",
                                            )}
                                        >
                                            Я ознакомлен(-а), понимаю и принимаю{" "}
                                            <Link
                                                className="text fz20 blue under"
                                                href="policy"
                                            >
                                                Пользовательское соглашение
                                            </Link>{" "}
                                            и{" "}
                                            <Link
                                                className="text fz20 blue under"
                                                href="policy"
                                            >
                                                Политику конфиденциальности
                                            </Link>
                                        </p>
                                    }
                                />
                            </div>
                            <Button
                                type="secondary"
                                className={styles.resButton}
                                htmlType="submit"
                                disabled={
                                    !valEmailBool(state.email) ||
                                    !valPassBool(state.password) ||
                                    !state.checkPrivacy
                                }
                            >
                                Регистрация
                            </Button>
                            <div className={styles.tipBlock}>
                                <p className="text fz20 fw500">
                                    Уже есть аккаунт?{" "}
                                    <span
                                        className="text fz20 blue under pointer"
                                        onClick={() => setModalState("login")}
                                    >
                                        Войти
                                    </span>
                                </p>
                            </div>
                        </form>
                    ),
                    ref: createRef(),
                };
            case "regCode":
                return {
                    content: (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                valCodeBool(state.code) &&
                                    verifyRegCodeHandler();
                            }}
                            className="formContent"
                        >
                            <p
                                className={classNames(
                                    "text fz20 fw500",
                                    styles.hintText,
                                )}
                            >
                                На вашу почту выслан 4-ех значный код
                                подтверждения
                            </p>
                            <div className={styles.inputContainer}>
                                <Input
                                    containerClassName={
                                        styles.codeInputContainer
                                    }
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
                                disabled={!valCodeBool(state.code)}
                            >
                                Подтвердить регистрацию
                            </Button>
                            {isSentAgain ? (
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
                                        {codeSentAgain ? (
                                            <span
                                                className="text fz20 blue under pointer"
                                                onClick={() =>
                                                    sendVerificationCodeHandler(
                                                        "RG",
                                                    )
                                                }
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
                                                        setCodeSentAgain(true)
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
            case "login":
                return {
                    content: (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                valEmailBool(state.email) &&
                                    !valPassBool(state.password) &&
                                    loginHandler();
                            }}
                            className="formContent"
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    title="Электронная почта"
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
                            <Button
                                onClick={() => loginHandler()}
                                className={styles.resButton}
                                type="secondary"
                                disabled={
                                    !valEmailBool(state.email) ||
                                    !valPassBool(state.password)
                                }
                            >
                                Вход
                            </Button>

                            <div className={styles.tipBlock}>
                                <p
                                    className={classNames(
                                        "text fz20 fw500 center",
                                        styles.tip,
                                    )}
                                >
                                    Забыли пароль?{" "}
                                    <span
                                        className="text fz20 blue under pointer"
                                        onClick={() => setModalState("recover")}
                                    >
                                        Восстановить пароль
                                    </span>
                                </p>
                                <p className="text fz20 fw500">
                                    Еще нет аккаунта?{" "}
                                    <span
                                        className="text fz20 blue under pointer"
                                        onClick={() => setModalState("reg")}
                                    >
                                        Зарегистрироваться
                                    </span>
                                </p>
                            </div>
                        </form>
                    ),
                    ref: createRef(),
                };
            case "recover":
                return {
                    content: (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                valEmailBool(state.email) &&
                                    valPassBool(state.password) &&
                                    valPassBool(state.newPassword) &&
                                    state.password === state.newPassword &&
                                    sendVerificationCodeHandler("PW");
                            }}
                            className="formContent"
                        >
                            <div className={styles.inputContainer}>
                                <Input
                                    title="Электронная почта"
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
                                    !valEmailBool(state.email) ||
                                    !valPassBool(state.password) ||
                                    !valPassBool(state.newPassword) ||
                                    state.password !== state.newPassword
                                }
                            >
                                Восстановить пароль
                            </Button>
                            <div className={styles.tipBlock}>
                                <p className="text fz20 fw500">
                                    <span
                                        className="text fz20 blue under pointer"
                                        onClick={() => setModalState("login")}
                                    >
                                        Назад
                                    </span>
                                </p>
                            </div>
                        </form>
                    ),
                    ref: createRef(),
                };
            case "recoverCode":
                return {
                    content: (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                valCodeBool(state.code) && recoverHandler();
                            }}
                            className="formContent"
                        >
                            <p
                                className={classNames(
                                    "text fz20 fw500",
                                    styles.hintText,
                                )}
                            >
                                На вашу почту выслан 4-ех значный код
                                подтверждения
                            </p>
                            <div className={styles.inputContainer}>
                                <Input
                                    containerClassName={
                                        styles.codeInputContainer
                                    }
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
                                disabled={!valCodeBool(state.code)}
                            >
                                Восстановить пароль
                            </Button>
                            {isSentAgain ? (
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
                                        {codeSentAgain ? (
                                            <span
                                                className="text fz20 blue under pointer"
                                                onClick={() =>
                                                    sendVerificationCodeHandler(
                                                        "PW",
                                                    )
                                                }
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
                                                        setCodeSentAgain(true)
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

    useEffect(() => {
        authDispatch({ type: "clear" });
    }, [modalState]);

    const nodeRef = getModalContent(modalState).ref;
    const typeOfModalRef = useRef<HTMLDivElement>(null);

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

export default AuthModal;
