"use client";

import Image from "next/image";
import DownloadItem from "./components/ui/DownloadItem/DownloadItem";
import Button from "./components/ui/Button/Button";
import Input from "./components/ui/Input/Input";
import { useContext, useState } from "react";
import { ModalContext } from "./context/ModalContext";
import AuthModal from "./components/modals/AuthModal/AuthModal";
import Select from "./components/ui/Select/Select";
import SelectSearch from "react-select-search";
import SelectSkills from "./components/SelectSkills/SelectSkills";
// import "react-select-search/style.css";

export default function Home() {
    const [tel, setTel] = useState("");
    const [text, setText] = useState("");
    const [errorText, setErrorText] = useState("");

    const { showModal } = useContext(ModalContext);

    const skillsList = [
        "Javascript",
        "React",
        "Node",
        "Typescript",
        "Next.js",
        "Tailwind",
        "CSS",
        "HTML",
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Firebase",
        "Git",
        "Figma",
        "Adobe XD",
    ];
    const [skills, setSkills] = useState<string[]>([]);

    const [checked, setChecked] = useState(false);

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
                type="checkbox"
                labelContent="Checkbox"
                checked={checked}
                onCheck={setChecked}
            />
            {/* <DownloadItem extension="pdf" name="Download" url="sad" />
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
            <SelectSearch
                search
                options={Array(100)
                    .fill(0)
                    .map((_, i) => ({
                        name: `Option ${i + 1}`,
                        value: i + 1,
                    }))}
            /> */}
            <SelectSkills
                title="Навыки"
                options={skillsList}
                maxItems={10}
                values={skills}
                selectValues={setSkills}
            />
        </div>
    );
}
