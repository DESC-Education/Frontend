"use client";


import { act, createRef, ReactNode, RefObject, useState } from "react";
import styles from "./page.module.scss";
import Button from "../_components/ui/Button/Button";
import classNames from "classnames";
import Link from "next/link";


type TasksPage = "current" | "past";

export default function JobsPage() {
    const [activeTab, setActiveTab] = useState<TasksPage>("current");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);


    const handleTabChange = (newTab: TasksPage) => {
        if (activeTab === newTab) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(newTab);
            setIsAnimating(false);
        }, 300);
    };

    const tasks = [];


    const getJobsPageContent = (
        jobsPage: TasksPage,
    ): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>;
    } => {
        switch (jobsPage) {
            case "current":
                return {
                    content: (
                        <div className={styles.content}>
                            {tasks.length > 0 ?
                                (
                                    <div>
                                        Такси есть
                                    </div>
                                )
                                :
                                (
                                    <div className={styles.noTasks}>
                                        <img src="/images/no-tasks.png" alt="no tasks" />
                                        <p className="title">
                                            Заданий нет
                                        </p>
                                        <Link href="/tasks/create-task">
                                            <Button type="secondary">
                                                Создать задание
                                            </Button>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    ),
                    ref: createRef(),
                };
            case "past":
                return {
                    content: (
                        <div className={styles.content}>
                            {tasks.length > 0 ?
                                (
                                    <div>
                                        Такси есть
                                    </div>
                                )
                                :
                                (
                                    <div className={styles.noTasks}>
                                        <img src="/images/no-tasks.png" alt="no tasks" />
                                        <p className="title">
                                            Заданий нет
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    ),
                    ref: createRef(),
                };
        }
    };


    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.navigation}>
                <p className="title fz48"> Мои задания</p>
                <div className={styles.navigationButtons}>
                    <Button
                        className={styles.navigationButton}
                        type={activeTab === "current" ? "secondary" : "primary"}
                        onClick={() => handleTabChange("current")}
                    >
                        Актуальные
                    </Button>
                    <Button
                        className={styles.navigationButton}
                        type={activeTab === "past" ? "secondary" : "primary"}
                        onClick={() => handleTabChange("past")}
                    >
                        Архив
                    </Button>
                </div>
            </div>
            <div className={classNames(styles.content, {
                [styles.exit]: isAnimating,
            })}
            >
                {getJobsPageContent(activeTab).content}
            </div>
        </div>
    );
}