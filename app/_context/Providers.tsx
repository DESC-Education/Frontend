"use client";

import { FC } from "react";
import ModalState from "./ModalContext";
import AlertState from "./AlertContext";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <AlertState>
            <ModalState>{children}</ModalState>
        </AlertState>
    );
};

export default Providers;
