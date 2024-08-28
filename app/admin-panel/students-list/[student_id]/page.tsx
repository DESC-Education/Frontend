"use client"

import { createRef, ReactNode, RefObject, useState } from "react";
import styles from "./page.module.scss"
import Button from "@/app/_components/ui/Button/Button";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useDispatch } from "react-redux";
import SelectSearch from "react-select-search";


type StudentInfo = "general" | "chats" | "tasks"


const StudentPage = () => {
    const [activeTab, setActiveTab] = useState<StudentInfo>("general");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const user = {
        id: "1",
        email: "test@gmail.com",
        isVerified: true,
        isOnline: false,
        isBanned: false,
        role: "student",
    }

    const student = {
        id: "1",
        isVerified: true,
        admissionYear: "2023",
        description: "Понятие подозрительный – содержащий 1) банворды 2) ссылки (не на фигму, гитхаб, гитлаб, стаковерфлов, и пр.) 3) подумать нал файлами картинками сисимасиси",
        firstName: "Иван",
        lastName: "Иванов",
        logoImg: "/images/userImage10.png",
        phone: "",
        emailVisibility: true,
        phoneVisibility: true,
        timezone: 3,
        university: {
            id: "1",
            name: "СФУ",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            }
        },
        speciality: {
            id: "1",
            name: "Специальность",
            type: "speciality",
            code: "12.34.56",
        },
        faculty: {
            id: "1",
            name: "Системы искуственного интеллекта",
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


    const chats = [
        {
            id: "1",
            companion: {
                id: "1",
                email: "test@gmail.com",
                isVerified: true,
                isOnline: true,
                isBanned: false,
                role: "student",
            },
            createdAt: "13.12.2023",
            taskId: "1",
            isSupport: true,
            isSuspicious: false,
            messages: [
                {
                    id: "1",
                    chatId: "1",
                    text: "Привет, как дела?",
                    ticketId: "1",
                    userId: "1",
                    isRead: true,
                    createdat: "12.12.2023",
                    isVisible: true,
                    changedId: "1",
                },
                {
                    id: "2",
                    chatId: "1",
                    text: "Привет, как дела?",
                    ticketId: "1",
                    userId: "1",
                    isRead: true,
                    createdat: "2023-05-01T00:00:00.000Z",
                    isVisible: true,
                    changedId: "1",
                },
            ],
        },
        {
            id: "2",
            companion: {
                id: "1",
                email: "test@gmail.com",
                isVerified: true,
                isOnline: true,
                isBanned: false,
                role: "student",
            },
            createdAt: "13.12.2023",
            taskId: "1",
            isSupport: true,
            isSuspicious: false,
            messages: [],

        },
        {
            id: "3",
            companion: {
                id: "1",
                email: "test@gmail.com",
                isVerified: true,
                isOnline: true,
                isBanned: false,
                role: "student",
            },
            createdAt: "13.12.2023",
            taskId: "1",
            isSupport: true,
            isSuspicious: false,
            messages: [],
        },
        {
            id: "4",
            companion: {
                id: "1",
                email: "test@gmail.com",
                isVerified: true,
                isOnline: true,
                isBanned: false,
                role: "student",
            },
            createdAt: "13.12.2023",
            taskId: "1",
            isSupport: true,
            isSuspicious: false,
            messages: [],
        },
        {
            id: "5",
            companion: {
                id: "1",
                email: "test@gmail.com",
                isVerified: true,
                isOnline: true,
                isBanned: false,
                role: "student",
            },
            taskId: "1",
            createdAt: "13.12.2023",
            isSupport: true,
            isSuspicious: false,
            messages: [],
        }
    ];

    const tasks = [
        {
            id: "1",
            companyId: "1",
            name: "Задание1",
            description: "Описание задания",
            deadline: "10.03.2024",
            createdat: "13.12.2023",
            catogoryId: "1",
            isVerified: true,
            isSuspicious: false,
            isVisible: true,
            files: [],
        },
        {
            id: "2",
            companyId: "1",
            name: "Задание2",
            description: "Описание задания",
            deadline: "10.03.2024",
            createdat: "13.12.2023",
            catogoryId: "1",
            isVerified: true,
            isSuspicious: false,
            isVisible: true,
            files: [],
        },
        {
            id: "3",
            companyId: "1",
            name: "Задание3",
            description: "Описание задания",
            deadline: "10.03.2024",
            createdat: "13.12.2023",
            catogoryId: "1",
            isVerified: true,
            isSuspicious: false,
            isVisible: true,
            files: [],
        },
    ];




    const getStudentContent = (activeTab: StudentInfo,): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>
    } => {
        switch (activeTab) {
            case "general":
                return {
                    content: (
                        <div className={styles.studentContent}>
                            <div className={styles.infoBlock}>
                                <p className="title">Образование:</p>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Университет:</p>
                                    <p className="text fz20">{student.university.name}, {student.university.city.name}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Факультет:</p>
                                    <p className="text fz20">{student.faculty.name}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Специальность:</p>
                                    <p className="text fz20">{student.speciality.name}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Форма обучения:</p>
                                    <p className="text fz20">{student.formOfEducation}</p>
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Описание:</p>
                                <div className={styles.textBlock}>
                                    <p className={classNames("text fz20", styles.description)}>{student.description}</p>
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Навыки:</p>
                                <div className={styles.skillsBlock}>
                                    {student.skills.map((skill, index) => (
                                        <div key={index} className={classNames("text fz20", styles.skill)}>{skill.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Контакты:</p>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Почта:</p>
                                    <p className="text fz20">{user.email}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Телеграм:</p>
                                    <p className="text fz20">{student.telegramLink ? <a href={student.telegramLink}>{"@" + student.telegramLink.slice(22)}</a> : "Не указан"}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Вконтакте:</p>
                                    <p className="text fz20">{student.vkLink ? <a href={student.vkLink}>{"@" + student.vkLink.slice(20)}</a> : "Не указан"}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Телефон:</p>
                                    <p className="text fz20">{student.phone ? student.phone : "Не указан"}</p>
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Управление:</p>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Верификация аккаунта:</p>
                                    {student.isVerified ? <p className="text fz20 green">Подтверждено</p> : <p className="text fz20 red">Не подтверждено</p>}
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Состояние аккаунта:</p>
                                    {user.isBanned ? <p className="text fz20 red">Забанен</p> : <p className="text fz20 green">Активен</p>}
                                    {user.isBanned ? <Button className={styles.unbanButton} type="unban">Разбанить</Button> : <Button className={styles.banButton} type="ban">Забанить</Button>}
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Послений онлайн:</p>
                                    {/* Ласт онлайн сюда */}
                                    {user.isOnline ? <p className="text fz20 green">В сети</p> : <p className="text fz20 red">Был в сети N минут назад</p>}
                                </div>
                            </div>
                            {/* <Button type="ban">Удалить аккаунт</Button> */}
                        </div>
                    ),
                    ref: createRef(),
                }
            case "chats":
                return {
                    content: (
                        <div className={styles.chatsContent}>
                            <div className={styles.searchBlock}>
                                <div className={styles.search}>
                                    <input type="text" placeholder="Поиск" className="text" />
                                </div>
                                <div className={styles.sorting}>
                                    <span className='text fw500'>Сортировка:</span>
                                    <SelectSearch options={[{ value: 'name', name: 'По имени' }, { value: 'task', name: 'По заданию' }, { value: 'date', name: 'По дате' }]} />
                                </div>
                            </div>
                            <div className={styles.chatsList}>
                                {chats.map((chat, index) => (
                                    <Link key={index} className={styles.chatItem} href="#">
                                        <div className={styles.chatHeader}>
                                            <p className="text fw500">{chat.companion.email}</p>
                                            <p className="text fz20">Время: {chat.createdAt}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                }
            case "tasks":
                return {
                    content: (
                        <div className={styles.tasksContent}>
                            <div className={styles.searchBlock}>
                                <div className={styles.search}>
                                    <input type="text" placeholder="Поиск" className="text" />
                                </div>
                                <div className={styles.sorting}>
                                    <span className='text fw500'>Сортировка:</span>
                                    <SelectSearch options={[{ value: 'name', name: 'По имени' }, { value: 'task', name: 'По заданию' }, { value: 'date', name: 'По дате' }]} />
                                </div>
                            </div>
                            <div className={styles.tasksList}>
                                {tasks.map((task, index) => (
                                    <Link key={index} className={styles.taskItem} href="#">
                                        <div className={styles.taskHeader}>
                                            <p className="text fw500">{task.name}</p>
                                            <p className="text fz20">Время: {task.createdat}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
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
                <Link href={"/admin-panel/students-list"} className={styles.backButton}>
                    <Image src="/icons/backIcon.svg" width={15} height={15} alt="arrow-left" className={styles.img} />
                    <p className="text green fz20">Вернуться к списку</p>
                </Link>
                <p className="title">
                    {student.firstName} {student.lastName}
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