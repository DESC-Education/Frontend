import classNames from "classnames";
import React, { FC } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    type: "primary" | "secondary" | "tetraity" | "icon";
    icon?: string;
    onClick?: () => void;
    disabled?: boolean;
};

const Button: FC<ButtonProps> = ({
    children,
    icon,
    type,
    className,
    onClick,
    disabled,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={classNames(className, styles.button, styles[type], {
                [styles.disabled]: disabled,
            })}
        >
            {icon && <img src={icon} alt="icon" />}
            {children}
        </button>
    );
};

export default Button;
