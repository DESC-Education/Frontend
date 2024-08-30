"use client";

import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { auth } from "@/app/_http/API/userApi";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { userSlice } from "@/app/_store/reducers/userSlice";
import LocalStorage from "@/app/_utils/LocalStorage";
import { FC, useEffect } from "react";

type ClientRootLayoutProps = {
    children: React.ReactNode;
};

const ClientRootLayout: FC<ClientRootLayoutProps> = ({ children }) => {
    const dispatch = useTypesDispatch();
    const { authUser } = userSlice.actions;
    const { updateIsLoading } = contentSlice.actions;

    useEffect(() => {
        const asyncFunc = async () => {
            const token = LocalStorage.getAccessToken();

            if (token) {
                const res = await auth();

                // console.log("res for auth", res);
                
                if (res.status === 200) {
                    dispatch(authUser({ user: res.user! }));
                }
            }
            dispatch(updateIsLoading(false));    
        };
        asyncFunc();
    }, []);

    return children;
};

export default ClientRootLayout;
