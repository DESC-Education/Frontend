import classNames from "classnames";
import { FC } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
    text: string;
    type: "primary" | "secondary" | "tetraity" |"icon";
    icon?: string;
    disabled?: boolean;
};

const Button: FC<ButtonProps> = ({ text, icon, type, disabled = false }) => {
    return (
        <button
            disabled={disabled}
            className={classNames(styles.button, styles[type], {
                [styles.disabled]: disabled,
            })}
        >
            {icon && <img src={icon} alt="icon" />}
            {text}
        </button>
    );
};

export default Button;
