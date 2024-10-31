"use client"


import { createRef, ReactNode, RefObject, useEffect, useState } from "react";
import styles from "./page.module.scss"
import Button from "@/app/_components/ui/Button/Button";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useDispatch } from "react-redux";
import SelectSearch from "react-select-search";
import { useParams } from "next/navigation";
import { IChat, IStudentInfo, IStudentProfile, ITask } from "@/app/_types";
import { getStudentSolutions, getUser, getUserChats } from "@/app/_http/API/adminApi";
import { Oval } from "react-loader-spinner";
import ChatUser from "@/app/_components/ChatItem/ChatItem";
import { get } from "http";
import TaskCard from "@/app/_components/TaskCard/TaskCard";


type StudentInfo = "general" | "chats" | "tasks"


const StudentPage = () => {
    const [activeTab, setActiveTab] = useState<StudentInfo>("general");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);



    const { student_id } = useParams();

    const [student, setStudent] = useState<IStudentInfo | null>(null);

    const [chats, setChats] = useState<IChat[] | null>(null);

    const [tasks, setTasks] = useState<ITask[] | null>(null);

    const getUserFunc = async () => {
        if (typeof student_id !== "string") return;

        const data = await getUser(student_id);
        setStudent(data);
    }

    const getChatsFunc = async () => {
        if (typeof student_id !== "string") return;

        const data = await getUserChats(student_id);
        setChats(data.chats.results);
    }

    const getTasksFunc = async () => {
        if (typeof student_id !== "string") return;

        const data = await getStudentSolutions(student_id);
        setTasks(data.solutions.results);
        console.log(data.solutions.results);
    }

    useEffect(() => {
        getUserFunc();
        getChatsFunc();
        getTasksFunc();
    }, []);


    if (!student || !chats || !tasks) return (<div className={styles.loading}><Oval /></div>);
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
                                    <p className="text fz20">{student.profile.university.name}, {student.profile.university.city.name}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Факультет:</p>
                                    <p className="text fz20">{student.profile.faculty.name}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Специальность:</p>
                                    <p className="text fz20">{student.profile.specialty.name}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Форма обучения:</p>
                                    <p className="text fz20">{student.profile.formOfEducation}</p>
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Описание:</p>
                                <div className={styles.textBlock}>
                                    <p className={classNames("text fz20", styles.description)}>{student.profile.description}</p>
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Навыки:</p>
                                <div className={styles.skillsBlock}>
                                    {student.profile.skills.map((skill, index) => (
                                        <div key={index} className={classNames("text fz20", styles.skill)}>{skill.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <p className="title">Контакты:</p>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Почта:</p>
                                    <p className="text fz20">{student.email}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Телеграм:</p>
                                    <p className="text fz20">{student.profile.telegramLink ? <a href={student.profile.telegramLink}>{"@" + student.profile.telegramLink.slice(13)}</a> : "Не указан"}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Вконтакте:</p>
                                    <p className="text fz20">{student.profile.vkLink ? <a href={student.profile.vkLink}>{"@" + student.profile.vkLink.slice(20)}</a> : "Не указан"}</p>
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Телефон:</p>
                                    <p className="text fz20">{student.profile.phone ? student.profile.phone : "Не указан"}</p>
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
                                    {student.isActive ? <p className="text fz20 green">Активен</p> : <p className="text fz20 red">Забанен</p>}
                                    {/* {user.isBanned ? <Button className={styles.unbanButton} type="unban">Разбанить</Button> : <Button className={styles.banButton} type="ban">Забанить</Button>} */}
                                </div>
                                <div className={styles.textBlock}>
                                    <p className="text fw500">Права</p>
                                    {/* Ласт онлайн сюда */}
                                    {student.isStaff ? <p className="text fz20 green">Модератор</p> : <p className="text fz20 red">Не модератор</p>}
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
                                    <Link key={index} href={`/admin-panel/students-list/${student_id}/${chat.id}`}>
                                        <ChatUser id={chat.id} name={chat.companion.name} avatar={chat.companion.avatar} lastMessage={chat.lastMessage} unreadCount={chat.unreadCount} active={false} isFavourited={chat.isFavorite} isListType={true}/>
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
                                    <TaskCard key={index} task={task} isAdminWatch={true} isSolutionsPage isTaskPage/>
                                    // <Link key={index} className={styles.taskItem} href="#">
                                    //     <div className={styles.taskHeader}>
                                    //         <p className="text fw500">{task.name}</p>
                                    //         <p className="text fz20">Время: {task.createdat}</p>
                                    //     </div>
                                    // </Link>
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
            {student.profile.verification.status === "verified" ?
                (<div>
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
                </div>)
                :
                (
                    <div className={styles.content}>
                        <img src="/images/questions.png" alt="notVerified" className={styles.notVerified} />
                        <p className="text fw500 fz20">Профиль не верифицирован, информации нет.</p>
                    </div>
                )
            }

        </div>
    )

}
export default StudentPage;