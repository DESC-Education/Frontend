import React, { createContext, useState, useEffect } from "react";
import Modal from "../components/modals/Modal/Modal";

export type ModalStateProps = {
    children?: React.ReactNode;
    showModal?: (data: {
        content: React.ReactNode | string;
        closeOnBorder?: boolean;
        onCloseFunction?: boolean;
        onClose?: (() => any) | undefined;
        allowClose?: boolean;
    }) => void;
    closeModal?: () => void;
};

export const ModalContext = createContext<ModalStateProps>(
    {} as ModalStateProps,
);

const ModalState = ({ children }: ModalStateProps) => {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [closeOnBorder, setCloseOnBorder] = useState<boolean>(true);
    const [allowClose, setAllowClose] = useState<boolean>(true);
    const [currContent, setCurrContent] = useState<React.ReactNode>("");
    const [onCloseFunction, setOnCloseFunction] = useState<boolean>(false);
    const [onClose, setOnClose] = useState<(() => void) | undefined>(undefined);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (isOpened && e.key === "Escape" && closeOnBorder && allowClose) {
                setIsOpened(false);
                setTimeout(() => {
                    closeModal();
                }, 300);
            }
        };
        window.addEventListener("keydown", listener);

        return () => {
            window.removeEventListener("keydown", listener);
        };
        // eslint-disable-next-line
    }, [isOpened, closeOnBorder, allowClose]);

    const showModal = (data: {
        content: React.ReactNode | string;
        closeOnBorder?: boolean;
        onCloseFunction?: boolean;
        onClose?: (() => any) | undefined;
        allowClose?: boolean;
    }) => {
        const closeOnBorder =
            data.closeOnBorder === undefined ? true : data.closeOnBorder;
        const onCloseFunction =
            data.onCloseFunction === undefined ? false : data.onCloseFunction;
        const allowClose =
            data.allowClose == undefined ? true : data.allowClose;
        setIsOpened(true);
        setAllowClose(allowClose);
        setCloseOnBorder(closeOnBorder);
        setCurrContent(data.content);
        setOnCloseFunction(onCloseFunction);
        setOnClose((prev) => {
            return data.onClose;
        });
    };

    const closeModal = () => {
        if (onCloseFunction) {
            console.log(onClose);
            setIsOpened(false);
            setCurrContent("");
            onClose!();
            return;
        }
        setIsOpened(false);
        setCurrContent("");
    };

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            <Modal
                closeOnBorder={closeOnBorder}
                children={currContent}
                isOpen={isOpened}
                allowClose={allowClose}
                handleClose={() => {
                    if (onCloseFunction) {
                        setIsOpened(false);
                        onClose!();
                        return;
                    }
                    setIsOpened(false);
                }}
            />
            {children}
        </ModalContext.Provider>
    );
};

export default ModalState;
