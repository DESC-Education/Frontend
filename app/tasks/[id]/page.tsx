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
import TaskCard from "@/app/_components/TaskCard/TaskCard";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";

const TasksPage = () => {
    const { currentTask } = useTypesSelector((state) => state.taskReducer);

    // const [currentTask, setTask] = useState<ITask | null>(null);

    // const [dayTitle, setDayTitle] = useState<string>("");

    // const getDayTitle = (day: number): "дней" | "день" | "дня" | "дней" => {
    //     const number = day;

    //     if (number > 10 && [11, 12, 13, 14].includes(number % 100))
    //         return "дней";
    //     const last_num = number % 10;
    //     if (last_num == 1) return "день";
    //     if ([2, 3, 4].includes(last_num)) return "дня";
    //     if ([5, 6, 7, 8, 9, 0].includes(last_num)) return "дней";
    //     return "дней";
    // };

    // const daysRef = useRef<any>(null);

    // useEffect(() => {
    //     if (!daysRef.current) return;

    //     setDayTitle(getDayTitle(daysRef.current.state.content));
    // }, [daysRef.current, currentTask?.title]);

    if (!currentTask)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div className={classNames(styles.container, "container")}>
            <BackButton />
            <div className={styles.content}>
                <div className={styles.currentTask}>
                    <TaskCard task={currentTask} extended />
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
