"use client";

import React, { FC, ForwardedRef, useEffect, useRef, useState } from "react";
import styles from "./LoadingScreen.module.scss";
import "./LoadingScreen.scss";
import { CSSTransition } from "react-transition-group";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import LocalStorage from "@/app/_utils/LocalStorage";
// import { contentSlice } from "@/app/_store/reducers/contentSlice";
// import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";

const LoadingScreen = () => {
    const [dots, setDots] = useState<number>(1);

    const { isLoading } = useTypesSelector((state) => state.contentReducer);

    // const { updateIsLoading } = contentSlice.actions
    // const dispatch = useTypesDispatch();

    const loadingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("isLoading", isLoading);
        
    }, [isLoading]);

    useEffect(() => {
        const loading = setInterval(() => {
            setDots((prev) => (prev === 3 ? 1 : prev + 1));
        }, 300);

        return () => {
            clearInterval(loading);
        };
    }, []);

    if (typeof window !== "undefined" && !LocalStorage.getAccessToken()) {
        return null;
    }

    return (
        <CSSTransition
            classNames="loading"
            timeout={1000}
            in={isLoading}
            nodeRef={loadingRef}
            unmountOnExit
        >
            <div className={styles.container} ref={loadingRef}>
                <p className="title fz34">Загрузка{Array(dots).fill(".")}</p>
                {/* <img style={{width: `${270 * value / 100}px`}} className={styles.hummingbird_loading} src="/icons/hummingbird.svg" alt="hummingbird" /> */}
                <img src="/icons/hummingbird.svg" alt="hummingbird" />
            </div>
        </CSSTransition>
    );
};

export default LoadingScreen;
