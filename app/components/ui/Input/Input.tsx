"use client";

import { InputMask } from "@react-input/mask";
import classNames from "classnames";
import { FC, ReactComponentElement, useState } from "react";
import styles from "./Input.module.scss";

type InputProps = {
    type: "text" | "password" | "tel" | "email" | "checkbox";
    onChange?: (val: string) => void;
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
    onChange = (val: string) => {},
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

    switch (type) {
        case "checkbox":
            return (
                <div className={styles.inputWrapper}>
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
                <div className={styles.inputWrapper}>
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <InputMask
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
                <div className={styles.inputWrapper}>
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <input
                        autoComplete={autoComplete}
                        className={classNames(styles.input, {
                            [styles.inputError]: errorText.length !== 0,
                        })}
                        type={type}
                        value={value}
                        onBlur={(e) => onBlur(e.target.value)}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <p
                        className={classNames(
                            "text fz16 fw500",
                            { hide: errorText.length === 0 },
                            styles.errorText,
                        )}
                    >
                        {errorText}
                    </p>
                </div>
            );
    }
};

export default Input;
