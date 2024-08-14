import { createRef, use, useEffect, useReducer, useRef, useState } from "react";
import styles from "./AuthModal.module.scss";
import "./AuthModal.scss";
import classNames from "classnames";
import Image from "next/image";
import Input from "../../ui/Input/Input";
import z from "zod";
import Link from "next/link";
import Button from "../../ui/Button/Button";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const PasswordSchema = z
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

const EmailSchema = z.string().email("Некорректный формат электронной почты");

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
    checkPrivacy: false,
    emailErr: "",
    passwordErr: "",
    newPasswordErr: "",
    codeErr: "",
};

const titles = {
    reg: "Регистрация",
    login: "Вход",
    regCode: "Подтверждение регистрации",
    recover: "Восстановление пароля",
    recoverCode: "Подтверждение",
    newPassword: "Новый пароль",
};

const AuthModal = () => {
    const [modalState, setModalState] = useState<
        "reg" | "login" | "regCode" | "recover" | "recoverCode" | "newPassword"
    >("reg");

    const [regState, setRegState] = useState<"regClient" | "regCompany">(
        "regClient",
    );

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
                return { ...initState };
            }
        }
    };

    const [state, authDispatch] = useReducer(reducer, initState);

    const valPassBool = (pass: string): boolean => {
        return PasswordSchema.safeParse(pass).success;
    };

    const valEmailBool = (email: string): boolean => {
        return EmailSchema.safeParse(email).success;
    };

    // { content: JSX.Element; ref: React.RefObject<any> }

    const getModalContent = (modalState: string): any => {
        switch (modalState) {
            case "reg":
                return {
                    content: (
                        <div className="formContent">
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
                                    autoComplete="new-password"
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
                                className={styles.resButton}
                                type="secondary"
                                disabled={
                                    !state.email ||
                                    !state.password ||
                                    !state.checkPrivacy ||
                                    !!state.emailErr ||
                                    !!state.passwordErr
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
                        </div>
                    ),
                    ref: createRef(),
                };
            case "login":
                return {
                    content: (
                        <div className="formContent">
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
                        </div>
                    ),
                    ref: createRef(),
                };
            case "recover":
                return {
                    content: (
                        <div className="formContent">
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
                            <Button
                                className={styles.resButton}
                                type="secondary"
                                disabled={!valEmailBool(state.email)}
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
                        </div>
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
        <div className={styles.container}>
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
                        nodeRef={nodeRef}
                        addEndListener={(done: any) => {
                            nodeRef.current.addEventListener(
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
