import React, { createContext, useState } from "react";
import Alert from "../_components/ui/Alert/Alert";

type AlertStateProps = {
    children?: React.ReactNode;
    showAlert: (
        content: React.ReactNode | string,
        type?: "error" | "success" | "warning",
    ) => void;
};

export const AlertContext = createContext<AlertStateProps>(
    {} as AlertStateProps,
);

const AlertState = ({ children }: Partial<AlertStateProps>) => {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [currContent, setCurrContent] = useState<React.ReactNode>("");
    const [currType, setCurrType] = useState<"error" | "success" | "warning">(
        "error",
    );

    const showAlert = (
        content: React.ReactNode | string,
        type?: "error" | "success" | "warning",
    ) => {
        setIsOpened(true);
        setCurrContent(content);
        setCurrType(type ? type : "error");
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            <Alert
                type={currType}
                children={currContent}
                isOpen={isOpened}
                handleClose={() => setIsOpened(false)}
            />
            {children}
        </AlertContext.Provider>
    );
};

export default AlertState;
