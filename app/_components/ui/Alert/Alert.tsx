import { FC, useEffect } from "react";
import ReactPortal from "../ReactPortal/ReactPortal";
import styles from "./Alert.module.scss";
import cn from "classnames";

interface AlertProps {
    children: React.ReactNode;
    type: "error" | "success" | "warning";
    isOpen: boolean;
    handleClose: () => void;
}

const Alert: FC<AlertProps> = ({
    children,
    type = "error",
    isOpen,
    handleClose,
}) => {
    useEffect(() => {
        let id: NodeJS.Timeout;
        if (isOpen) {
            id = setTimeout(() => {
                handleClose();
            }, 3000);
        }

        return () => {
            clearTimeout(id);
        };
    }, [isOpen, handleClose]);

    return (
        <ReactPortal>
            <div
                className={cn(
                    styles.container,
                    {
                        [styles.error]: type === "error",
                    },
                    {
                        [styles.success]: type === "success",
                    },
                    {
                        [styles.warning]: type === "warning",
                    },
                    {
                        [styles.active]: isOpen,
                    },
                )}
            >
                <p className="text small">{children}</p>
            </div>
        </ReactPortal>
    );
};

export default Alert;
