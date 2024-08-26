"use client"

import { createRef, ReactNode, RefObject, useState } from "react";
import styles from "./page.module.scss"
import Button from "@/app/_components/ui/Button/Button";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";


type StudentInfo = "general" | "chats" | "tasks"


const StudentPage = () => {
    const [activeTab, setActiveTab] = useState<StudentInfo>("general");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const student = {
        id: "1",
        isVerified: "true",
        admissionYear: "2023",
        description: "Описание студента",
        firstName: "Иван",
        lastName: "Иванов",
        logoImg: "/images/userImage10.png",
        phone: "123456789",
        emailVisibility: true,
        phoneVisibility: true,
        timezone: 3,
        university: {
            id: "1",
            name: "Университет имени X",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            }
        },
        speciality: {
            id: "1",
            name: "Специальность X",
            type: "speciality",
            code: "code",
        },
        faculty: {
            id: "1",
            name: "Факультет X",
            university: "Университет имени X",
        },
        formOfEducation: "bachelor",
        educationProgram: "bachelor",
        telegramLink: "https://t.me/joinchat/asdfasdf",
        vkLink: "https://vk.com/join/asdfasdf",
        city: {
            id: "1",
            name: "город X",
            region: "Регион X",
        },
        skills: [
            {
                id: "1",
                name: "Навык X",
                percent: 50,
            },
            {
                id: "2",
                name: "Навык Y",
                percent: 50,
            },
        ],

    };


    const getStudentContent = (activeTab: StudentInfo,): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>
    } => {
        switch (activeTab) {
            case "general":
                return {
                    content: (
                        <div className={styles.content}>
                            general
                        </div>
                    ),
                    ref: createRef(),
                }
            case "chats":
                return {
                    content: (
                        <div className={styles.content}>chats</div>
                    ),
                    ref: createRef(),
                }
            case "tasks":
                return {
                    content: (
                        <div className={styles.content}>tasks</div>
                    ),
                    ref: createRef(),
                }
        }
    }

    const handleTabChange = (newTab: StudentInfo) => {
        if (activeTab === newTab) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(newTab);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.studentHeader}>
                <Link href={`/admin-panel/students-list`} className={styles.backButton}> 
                <Image src="/icons/backIcon.svg" width={15} height={15} alt="arrow-left" className={styles.img}/>
                <p className="text green fz20">Вернуться к списку</p>
                </Link>
                <p className="title">
                    {`[${student.id}]`} {student.firstName} {student.lastName}
                </p>
            </div>
            <div className={styles.navigationButtons}>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "general" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("general")}
                >
                    Общие
                </Button>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "chats" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("chats")}
                >
                    Чаты
                </Button>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "tasks" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("tasks")}
                >
                    Задачи
                </Button>
            </div>
            <div
                className={classNames(styles.content, {
                    [styles.exit]: isAnimating,
                })}
            >
                {getStudentContent(activeTab).content}
            </div>
        </div>
    )

}
export default StudentPage;