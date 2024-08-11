"use client";

import Image from "next/image";
import DownloadItem from "./components/ui/DownloadItem/DownloadItem";
import Button from "./components/ui/Button/Button";
import Input from "./components/ui/Input/Input";
import { useState } from "react";

export default function Home() {
    const [tel, setTel] = useState("");
    const [text, setText] = useState("");
    const [errorText, setErrorText] = useState("");

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
        </div>
    );
}
