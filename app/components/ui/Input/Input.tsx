"use client";

import { InputMask } from "@react-input/mask";
import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import styles from "./Input.module.scss";
import "./Input.scss";
import { CSSTransition, SwitchTransition } from "react-transition-group";

type InputProps = {
    type: "text" | "password" | "tel" | "email" | "checkbox";
    containerClassName?: string;
    onChange?: (val: string) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCheck?: (val: boolean) => void;
    onBlur?: (val: string) => void;
    value?: string;
    checked?: boolean;
    labelContent?: React.ReactNode;
    autoComplete?: string;
    title?: string;
    errorText?: string;
};

const Input: FC<InputProps> = ({
    type,
    containerClassName = "",
    onChange = (val: string) => {},
    onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {},
    onCheck = (val: boolean) => {},
    onBlur = (val: string) => {},
    labelContent,
    title,
    value = "",
    checked = false,
    autoComplete = "off",
    errorText = "",
}) => {
    const uniqueId = "id" + Math.random().toString(16).slice(2);
    const errorRef = useRef<HTMLParagraphElement>(null);
    const checkRef = useRef<HTMLLabelElement>(null);

    switch (type) {
        case "checkbox":
            return (
                <div
                    className={classNames(
                        styles.inputWrapper,
                        styles.checkboxWrapper,
                        containerClassName,
                    )}
                >
                    <input
                        id={uniqueId}
                        autoComplete={autoComplete}
                        className={classNames(styles.input, styles.checkbox)}
                        type={type}
                        checked={checked}
                        onChange={(e) => onCheck(e.target.checked)}
                    />
                    <SwitchTransition>
                        <CSSTransition
                            key={checked ? "checked" : "unchecked"}
                            nodeRef={checkRef}
                            timeout={50}
                            classNames="checkLabel"
                        >
                    <label
                        ref={checkRef}
                        className={classNames("text fz20", styles.checkLabel)}
                        htmlFor={uniqueId}
                    >
                        {checked ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                            >
                                <rect
                                    width="25"
                                    height="25"
                                    rx="5"
                                    fill="#19282C"
                                />
                                <path
                                    d="M10.1253 15.825L7.3545 13.0542C7.28204 12.9808 7.19575 12.9226 7.10062 12.8829C7.00549 12.8431 6.90342 12.8226 6.80033 12.8226C6.69724 12.8226 6.59517 12.8431 6.50004 12.8829C6.40491 12.9226 6.31862 12.9808 6.24616 13.0542C6.17282 13.1266 6.11459 13.2129 6.07485 13.308C6.03511 13.4032 6.01465 13.5052 6.01465 13.6083C6.01465 13.7114 6.03511 13.8135 6.07485 13.9086C6.11459 14.0037 6.17282 14.09 6.24616 14.1625L9.56325 17.4796C9.872 17.7883 10.3707 17.7883 10.6795 17.4796L19.0712 9.09583C19.1445 9.02337 19.2027 8.93708 19.2425 8.84195C19.2822 8.74683 19.3027 8.64476 19.3027 8.54166C19.3027 8.43857 19.2822 8.3365 19.2425 8.24137C19.2027 8.14624 19.1445 8.05995 19.0712 7.9875C18.9987 7.91416 18.9124 7.85593 18.8173 7.81619C18.7222 7.77645 18.6201 7.75598 18.517 7.75598C18.4139 7.75598 18.3118 7.77645 18.2167 7.81619C18.1216 7.85593 18.0353 7.91416 17.9628 7.9875L10.1253 15.825Z"
                                    fill="white"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                            >
                                <rect
                                    x="0.5"
                                    y="0.5"
                                    width="24"
                                    height="24"
                                    rx="4.5"
                                    fill="white"
                                    stroke="#CFCFCF"
                                />
                            </svg>
                        )}
                    </label>
                    </CSSTransition>
                    </SwitchTransition>
                    <label
                        className={classNames("text fz20", styles.label)}
                        htmlFor={uniqueId}
                    >
                        {labelContent}
                    </label>
                </div>
            );

        case "tel":
            return (
                <div
                    className={classNames(
                        styles.inputWrapper,
                        containerClassName,
                    )}
                >
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <InputMask
                        onKeyUp={onKeyUp}
                        autoComplete={autoComplete}
                        className={classNames(styles.input, {
                            [styles.inputError]: errorText.length !== 0,
                        })}
                        mask="+7 (___) ___-__-__"
                        replacement={{ _: /\d/ }}
                        onBlur={(e) => onBlur(e.target.value)}
                        placeholder="+7 (___) ___-__-__"
                        onChange={(e) => onChange(e.target.value)}
                        value={value}
                    />
                </div>
            );
        default:
            return (
                <div
                    className={classNames(
                        styles.inputWrapper,
                        containerClassName,
                    )}
                >
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <input
                        onKeyUp={onKeyUp}
                        autoComplete={autoComplete}
                        className={classNames(styles.input, {
                            [styles.inputError]: errorText.length !== 0,
                        })}
                        type={type}
                        value={value}
                        onBlur={(e) => onBlur(e.target.value)}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <CSSTransition
                        in={errorText.length !== 0}
                        nodeRef={errorRef}
                        timeout={100}
                        classNames="errorText"
                    >
                        <p
                            ref={errorRef}
                            className={classNames(
                                "text fz16 fw500",
                                styles.errorText,
                            )}
                        >
                            {errorText}
                        </p>
                    </CSSTransition>
                </div>
            );
    }
};

export default Input;
