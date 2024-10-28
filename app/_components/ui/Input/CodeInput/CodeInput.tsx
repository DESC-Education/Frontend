import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "./CodeInput.module.scss";
import "./CodeInput.scss";
import classNames from "classnames";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";

const CODE_LEN = 4;

type CodeInputProps = {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    className?: string;
};

const CodeInput: FC<CodeInputProps> = ({ value, setValue, className = "" }) => {
    const { isMobileDevice } = useTypesSelector(
        (state) => state.contentReducer,
    );

    const changeValue = (char: string, value: string) => {
        if (char === "Backspace") {
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
            // if (char.length > 4) return;

            if (value[0] === "_") {
                setValue((prev) => `${char}___`);
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
                                char,
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
        if (isMobileDevice) return;

        const listenerKeyDown = (e: KeyboardEvent) => {
            if ("1234567890".includes(e.key) || e.key === "Backspace") {
                changeValue(e.key, value);
            }
        };
        const listenerPaste = (e: ClipboardEvent) => {
            if (e.clipboardData) {
                const pastedText = e.clipboardData.getData("text").trim();

                if (/^\d{4}$/.test(pastedText)) {
                    setValue(pastedText);
                }
            }
        };
        window.addEventListener("keydown", listenerKeyDown);
        window.addEventListener("paste", listenerPaste);

        return () => {
            window.removeEventListener("keydown", listenerKeyDown);
            window.removeEventListener("paste", listenerPaste);
        };
    }, [value, isMobileDevice]);

    const isActiveChar = (index: number, value: string) => {
        if (index === 0 && value[0] === "_") return true;

        for (let i = 1; i < value.length; i++) {
            if (value[i] === "_" && value[i - 1] && value[i - 1] !== "_") {
                return i === index;
            } else {
                continue;
            }
        }
    };

    if (isMobileDevice)
        return (
            <input
                value={value}
                onChange={(e) => {
                    if (e.target.value.length < value.length) {
                        changeValue("Backspace", value);
                    } else {
                        if (
                            !!e.target.value.match(/_/g) &&
                            e.target.value.match(/_/g)!.length === 4
                        ) {
                            changeValue(
                                e.target.value.replaceAll("_", "")[0],
                                value,
                            );
                        } else {
                            changeValue(e.target.value[4], value);
                        }
                    }
                }}
                className={classNames(styles.input, className)}
            />
        );

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
