"use client";

import { InputMask } from "@react-input/mask";
import classNames from "classnames";
import {
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styles from "./Input.module.scss";
import "./Input.scss";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import CodeInput from "./CodeInput/CodeInput";
import { AlertContext } from "@/app/_context/AlertContext";

type InputProps = {
    type:
        | "text"
        | "password"
        | "tel"
        | "email"
        | "checkbox"
        | "radio"
        | "code"
        | "number"
        | "file"
        | "file_multiple"
        | "textarea";
    containerClassName?: string;
    onChange?: (val: string) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCheck?: (val: boolean) => void;
    onBlur?: (val: string) => void;
    value?: string;
    max?: number;
    placeholder?: string;
    checked?: boolean;
    labelContent?: React.ReactNode;
    autoComplete?: string;
    title?: string;
    errorText?: string;
    accept?: string;
    file?: any; // File | File[] | null
    setFile?: any; // Dispatch<SetStateAction<File | File[] | null>>
    multiple?: boolean;
    rows?: number;
    maxFiles?: number;
    maxFileSize?: number;
    fileTipContent?: ReactNode | string;
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
    max = Infinity,
    placeholder = "",
    value = "",
    checked = false,
    autoComplete = "off",
    errorText = "",
    accept = "",
    file,
    setFile,
    multiple = false,
    rows = 5,
    maxFiles = 5,
    maxFileSize = 5e6,
    fileTipContent = "",
}) => {
    const [uniqueId, setUniqueId] = useState<string>();

    useEffect(() => {
        setUniqueId("id" + Math.random().toString(16).slice(2));
    }, []);

    const errorRef = useRef<HTMLParagraphElement>(null);
    const checkRef = useRef<HTMLLabelElement>(null);
    const [codeValue, setCodeValue] = useState<string>("____");
    const { showAlert } = useContext(AlertContext);

    const addFileHandler = async (file: any, fileSetter: any) => {
        if (!file) {
            fileSetter(null);
            return;
        }

        if (multiple) {
            const newFile = Array.from(file);

            let unsupportedFiles = false;

            newFile.forEach((item: any) => {
                if (
                    ![
                        "pdf",
                        "vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "png",
                        "jpg",
                        "jpeg",
                    ].includes(item.type.split("/")[1])
                ) {
                    showAlert("Формат файла не поддерживается");
                    unsupportedFiles = true;
                }

                if (item.size > maxFileSize) {
                    showAlert("Файл слишком большой");
                    unsupportedFiles = true;
                }
            });

            if (unsupportedFiles) return;

            fileSetter((prev: any) => {
                if (!prev) return newFile;
                return [...prev, ...newFile].slice(0, maxFiles);
            });
        } else {
            if (!["png", "jpg", "jpeg"].includes(file.type.split("/")[1])) {
                showAlert("Формат файла не поддерживается");
                return;
            }

            if (file.size > maxFileSize) {
                showAlert("Файл слишком большой");
                return;
            }

            fileSetter(file);
        }
    };

    const removeFile = (index: number) => {
        if (!file) return;

        const newFile = file.filter((_: any, i: number) => i !== index);

        setFile(newFile);
    };

    useEffect(() => {
        if (type === "code") {
            onChange(codeValue);
        }
    }, [codeValue]);

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
                                className={classNames(
                                    "text fz20",
                                    styles.checkLabel,
                                )}
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
        case "radio":
            return (
                <div
                    className={classNames(
                        styles.inputWrapper,
                        styles.checkboxWrapper,
                        styles.radioWrapper,
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
                                className={classNames(
                                    "text fz20",
                                    styles.checkLabel,
                                )}
                                htmlFor={uniqueId}
                            >
                                {checked ? (
                                    <div className={styles.check}>
                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="25"
                                                height="25"
                                                viewBox="0 0 25 25"
                                                fill="none"
                                            >
                                                <path
                                                    d="M10.1253 15.825L7.3545 13.0542C7.28204 12.9808 7.19575 12.9226 7.10062 12.8829C7.00549 12.8431 6.90342 12.8226 6.80033 12.8226C6.69724 12.8226 6.59517 12.8431 6.50004 12.8829C6.40491 12.9226 6.31862 12.9808 6.24616 13.0542C6.17282 13.1266 6.11459 13.2129 6.07485 13.308C6.03511 13.4032 6.01465 13.5052 6.01465 13.6083C6.01465 13.7114 6.03511 13.8135 6.07485 13.9086C6.11459 14.0037 6.17282 14.09 6.24616 14.1625L9.56325 17.4796C9.872 17.7883 10.3707 17.7883 10.6795 17.4796L19.0712 9.09583C19.1445 9.02337 19.2027 8.93708 19.2425 8.84195C19.2822 8.74683 19.3027 8.64476 19.3027 8.54166C19.3027 8.43857 19.2822 8.3365 19.2425 8.24137C19.2027 8.14624 19.1445 8.05995 19.0712 7.9875C18.9987 7.91416 18.9124 7.85593 18.8173 7.81619C18.7222 7.77645 18.6201 7.75598 18.517 7.75598C18.4139 7.75598 18.3118 7.77645 18.2167 7.81619C18.1216 7.85593 18.0353 7.91416 17.9628 7.9875L10.1253 15.825Z"
                                                    fill="white"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.unCheck}>
                                        <div></div>
                                    </div>
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
        case "code":
            return (
                <CodeInput
                    value={codeValue}
                    setValue={setCodeValue}
                    className={containerClassName}
                />
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
        case "textarea":
            return (
                <div
                    className={classNames(
                        styles.inputWrapper,
                        styles.textareaWrapper,
                        containerClassName,
                    )}
                >
                    {title && <p className="text fz20 fw500">{title}</p>}
                    <textarea
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className={classNames(styles.input, {
                            [styles.inputError]: errorText.length !== 0,
                        })}
                        rows={rows}
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
                                "text fz20",
                                styles.errorText,
                            )}
                        >
                            {errorText}
                        </p>
                    </CSSTransition>
                </div>
            );
        case "file":
            return (
                <label className={styles.fileInput}>
                    <div>
                        <input
                            accept={accept}
                            type="file"
                            onChange={async (e) => {
                                if (!e.target.files) return;

                                addFileHandler!(e.target.files[0], setFile!);
                            }}
                        />
                        {file ? (
                            <img
                                className={styles.userImage}
                                src={URL.createObjectURL(file)}
                                alt="logo"
                            />
                        ) : (
                            <>
                                <img src="/icons/add_file.svg" alt="add" />
                                <div>
                                    <p className="text fz16 gray">
                                        Форматы: PNG, JPG, JPEG
                                    </p>
                                    <p className="text fz16 gray">
                                        Максимальный вес: 5МБ
                                    </p>
                                    <p className="text fz16 gray">
                                        Ваше имя, лицо и институт должны быть
                                        четко различимы
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <p className={classNames("text fz20", styles.errorText)}>
                        {errorText}
                    </p>
                </label>
            );
        case "file_multiple":
            return (
                <>
                    {Boolean(file!.length) && (
                        <div className={styles.filesContainer}>
                            {file.map((file: File, index: number) => {
                                return (
                                    <div className={styles.file} key={index}>
                                        <img
                                            className={styles.delete}
                                            src="/icons/cross.png"
                                            alt="delete"
                                            onClick={() => removeFile(index)}
                                        />
                                        {[
                                            "png",
                                            "jpg",
                                            "jpeg",
                                            "jfif",
                                        ].includes(
                                            file.name.split(".").slice(-1)[0],
                                        ) ? (
                                            <img
                                                className={styles.userImage}
                                                src={URL.createObjectURL(file)}
                                                alt="logo"
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    className={classNames(
                                                        styles.userImage,
                                                        styles.imgDocument,
                                                    )}
                                                    src={`/icons/extensions/${
                                                        file.name
                                                            .split(".")
                                                            .slice(-1)[0]
                                                    }.png`}
                                                />
                                                <p>{file.name}</p>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {file!.length < maxFiles && (
                        <label htmlFor={uniqueId} className={styles.fileInput}>
                            <div>
                                <input
                                    id={uniqueId}
                                    accept={accept}
                                    type="file"
                                    multiple
                                    onChange={async (e) => {
                                        if (!e.target.files) return;

                                        addFileHandler!(
                                            e.target.files,
                                            setFile!,
                                        );
                                    }}
                                />
                                <img src="/icons/add_file.svg" alt="add" />
                                {fileTipContent}
                            </div>

                            <p
                                className={classNames(
                                    "text fz20",
                                    styles.errorText,
                                )}
                            >
                                {errorText}
                            </p>
                        </label>
                    )}
                </>
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
                        max={max}
                        placeholder={placeholder}
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
                                "text fz20",
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
