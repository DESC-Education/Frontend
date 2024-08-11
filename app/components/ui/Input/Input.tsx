"use client";

import { InputMask } from "@react-input/mask";
import classNames from "classnames";
import { FC, useState } from "react";
import styles from "./Input.module.scss";

type InputProps = {
    type: "text" | "password" | "tel" | "email";
    onChange: (val: string) => void;
    value: string;
    title?: string;
    errorText?: string;
};

const Input: FC<InputProps> = ({
    type,
    value,
    onChange,
    title,
    errorText = "",
}) => {
    const [telError, setTelError] = useState(false);

    switch (type) {
        case "tel":
            return (
                <div className={styles.inputWrapper}>
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <InputMask
                        className={classNames(styles.input, {
                            [styles.inputError]:
                                telError,
                        })}
                        mask="+7 (___) ___-__-__"
                        replacement={{ _: /\d/ }}
                        onBlur={(e) =>
                            setTelError(value.length !== 18 && value !== "")
                        }
                        placeholder="+7 (___) ___-__-__"
                        onChange={(e) => onChange(e.target.value)}
                        value={value}
                    />
                    {errorText && (
                        <p
                            className={classNames(
                                "text fz16 fw500",
                                styles.errorText,
                            )}
                        >
                            {errorText}
                        </p>
                    )}
                </div>
            );
        default:
            return (
                <div className={styles.inputWrapper}>
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <input
                        className={classNames(styles.input, {
                            [styles.inputError]: errorText.length !== 0,
                        })}
                        type={type}
                        value={value}
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
