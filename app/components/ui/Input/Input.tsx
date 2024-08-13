"use client";

import { InputMask } from "@react-input/mask";
import classNames from "classnames";
import { FC, useRef, useState } from "react";
import styles from "./Input.module.scss";
import "./Input.scss";
import { CSSTransition } from "react-transition-group";

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

    switch (type) {
        case "checkbox":
            return (
                <div
                    className={classNames(
                        styles.inputWrapper,
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
