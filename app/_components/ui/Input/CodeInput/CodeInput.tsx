import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "./CodeInput.module.scss";
import "./CodeInput.scss";
import classNames from "classnames";

const CODE_LEN = 4;

type CodeInputProps = {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    className?: string;
};

const CodeInput: FC<CodeInputProps> = ({ value, setValue, className = "" }) => {
    const changeValue = (val: string, value: string) => {
        if (val === "Backspace") {
            // Delete last char
            setValue((prev) => {
                for (let i = CODE_LEN - 1; i >= 0; i--) {
                    if (prev[i] !== "_") {
                        return [
                            prev.slice(0, i),
                            Array(CODE_LEN - i)
                                .fill("_")
                                .join(""),
                        ].join("");
                    }
                }
                return "____";
            });
        } else {
            if (value[0] === "_") {
                setValue((prev) => `${val}___`);
                return;
            }
            // Enter digit
            setValue((prev) => {
                for (let i = CODE_LEN - 1; i >= 1; i--) {
                    if (prev[i] === "_") {
                        if (prev[i - 1] === "_") {
                            continue;
                        } else {
                            return [
                                prev.slice(0, i),
                                val,
                                Array(CODE_LEN - i - 1)
                                    .fill("_")
                                    .join(""),
                            ].join("");
                        }
                    }
                }
                return prev;
            });
        }
    };

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if ("1234567890".includes(e.key) || e.key === "Backspace") {
                changeValue(e.key, value);
            }
        };
        window.addEventListener("keydown", listener);

        return () => {
            window.removeEventListener("keydown", listener);
        };
    }, [value]);

    const isActiveChar = (index: number, value: string) => {
        if (index === 0 && value[0] === "_") return true;
        
        for (let i = 1; i < value.length; i++) {
            if (value[i] === "_" && value[i - 1] && value[i - 1] !== "_") {
                return i === index;
            } else {
                continue
            }
        }
    };

    return (
        <div className={classNames(styles.container, className)}>
            {value.split("").map((char, index) => (
                <span key={index} className={styles.charContainer}>
                    <span
                        className={classNames(styles.char, {
                            [styles.active]: isActiveChar(index, value),
                            [styles.hide]: char === "_",
                        })}
                    >
                        {char === "_" ? "" : char}
                    </span>
                    <span
                        className={classNames(styles.charLine, {
                            [styles.active]: isActiveChar(index, value),
                        })}
                    ></span>
                </span>
            ))}
        </div>
    );
};

export default CodeInput;
