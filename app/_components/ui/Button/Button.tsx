import classNames from "classnames";
import React, { FC } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    type: "primary" | "secondary" | "icon" | "ban" | "unban";
    icon?: string;
    onClick?: () => void;
    disabled?: boolean;
    htmlType?: "button" | "submit" | "reset";
    loading?: boolean;
    loadingWidth?: number;
};

const Button: FC<ButtonProps> = ({
    children,
    icon,
    type,
    className,
    onClick,
    disabled,
    htmlType,
    loading = false,
    loadingWidth = 190,
}) => {
    return (
        <button
            type={htmlType}
            onClick={onClick}
            disabled={disabled}
            style={{
                width: loading && loadingWidth ? loadingWidth : undefined,
            }}
            className={classNames(className, styles.button, styles[type], {
                [styles.disabled]: disabled,
                [styles.loading]: loading,
            })}
        >
            {icon && <img src={icon} alt="icon" />}
            {children}
        </button>
    );
};

export default Button;
