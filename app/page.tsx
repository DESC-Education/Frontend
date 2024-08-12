"use client";

import Image from "next/image";
import DownloadItem from "./components/ui/DownloadItem/DownloadItem";
import Button from "./components/ui/Button/Button";
import Input from "./components/ui/Input/Input";
import { useContext, useState } from "react";
import { ModalContext } from "./context/ModalContext";
import AuthModal from "./components/modals/AuthModal/AuthModal";

export default function Home() {
    const [tel, setTel] = useState("");
    const [text, setText] = useState("");
    const [errorText, setErrorText] = useState("");

    const { showModal } = useContext(ModalContext);

    return (
        <div
            style={{
                margin: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: "20px",
            }}
        >
            <DownloadItem extension="pdf" name="Download" url="sad" />
            <Input
                title="Phone"
                type="tel"
                value={tel}
                onChange={(val) => setTel(val)}
            />
            <Input
                title="pass"
                type="password"
                value={tel}
                onChange={(val) => setTel(val)}
            />
            <Input
                type="text"
                errorText={errorText}
                value={text}
                onChange={(val) => setText(val)}
            />
            <p
                onClick={() =>
                    setErrorText((prev) => (prev === "" ? "Error text" : ""))
                }
            >
                Click me
            </p>
            <p
                onClick={() =>
                    showModal!({
                        content: <AuthModal />,
                    })
                }
            >
                And me to show modal
            </p>
        </div>
    );
}
