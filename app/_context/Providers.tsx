"use client";

import { FC, useRef } from "react";
import ModalState from "./ModalContext";
import AlertState from "./AlertContext";
import { AppStore, makeStore } from "../_store";
import { Provider } from "react-redux";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }) => {
    const storeRef = useRef<AppStore>();

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <AlertState>
                <ModalState>{children}</ModalState>
            </AlertState>
        </Provider>
    );
};

export default Providers;
