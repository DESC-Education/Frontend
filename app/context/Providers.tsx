"use client";

import { FC } from "react";
import ModalState from "./ModalContext";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }) => {
    return <ModalState>{children}</ModalState>;
};

export default Providers;
