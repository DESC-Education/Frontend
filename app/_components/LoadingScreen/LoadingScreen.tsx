"use client";

import React, { FC, ForwardedRef, useEffect, useRef, useState } from "react";
import styles from "./LoadingScreen.module.scss";
import "./LoadingScreen.scss";
import { CSSTransition } from "react-transition-group";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import LocalStorage from "@/app/_utils/LocalStorage";

const LoadingScreen = () => {
    const [dots, setDots] = useState<number>(1);

    const { isLoading } = useTypesSelector((state) => state.contentReducer);

    const loadingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loading = setInterval(() => {
            setDots((prev) => (prev === 3 ? 1 : prev + 1));
        }, 300);

        return () => {
            clearInterval(loading);
        };
    }, []);

    return (
        <CSSTransition
            classNames="loading"
            timeout={1000}
            in={isLoading}
            nodeRef={loadingRef}
            unmountOnExit
        >
            <div className={styles.container} ref={loadingRef}>
                <img src="/icons/hummingbird.svg" alt="hummingbird" />
            </div>
        </CSSTransition>
    );
};

export default LoadingScreen;
