"use client";

import BackButton from "@/app/_components/ui/BackButton/BackButton";
import classNames from "classnames";
import styles from "./page.module.scss";
import { useParams } from "next/navigation";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useEffect, useRef, useState } from "react";
import { ITask } from "@/app/_types";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import Moment from "react-moment";
import { getTask } from "@/app/_http/API/tasksApi";

const TasksPage = () => {
    const { id } = useParams();

    const { tasks } = useTypesSelector((state) => state.taskReducer);

    const [task, setTask] = useState<ITask | null>(null);

    useEffect(() => {
        const asyncFunc = async () => {
            if (tasks && tasks.length > 0) {
                if (tasks.find((item) => item.id === id)) {
                    setTask(tasks.find((item) => item.id === id)!);
                } else {
                    if (typeof id === "string") {
                        const res = await getTask(id);

                        console.log(res);
                    }
                }
            }
        };
        asyncFunc();
    }, [tasks?.length]);

    const [dayTitle, setDayTitle] = useState<string>("");

    const getDayTitle = (day: number): "дней" | "день" | "дня" | "дней" => {
        const number = day;

        if (number > 10 && [11, 12, 13, 14].includes(number % 100))
            return "дней";
        const last_num = number % 10;
        if (last_num == 1) return "день";
        if ([2, 3, 4].includes(last_num)) return "дня";
        if ([5, 6, 7, 8, 9, 0].includes(last_num)) return "дней";
        return "дней";
    };

    const daysRef = useRef<any>(null);

    useEffect(() => {
        if (!daysRef.current) return;

        setDayTitle(getDayTitle(daysRef.current.state.content));
    }, [daysRef.current, task?.title]);

    if (!task)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    console.log(task);

    return (
        <div className={classNames(styles.container, "container")}>
            <BackButton />
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.company}>
                        <img src={task.profile.logoImg} alt="logo" />
                        <p className="title fz24">{task.profile.companyName}</p>
                    </div>
                    <div className={styles.deadline}>
                        <p>Срок выполнения:</p>
                        <p className="text fw500">
                            <Moment
                                diff={task.createdAt}
                                unit="days"
                                locale="ru"
                            >
                                {task.deadline}
                            </Moment>{" "}
                            {dayTitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
