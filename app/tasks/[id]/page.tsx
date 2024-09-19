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

const TasksPage = () => {
    const { id } = useParams();

    // const { tasks } = useTypesSelector((state) => state.taskReducer);
    const { currentTask } = useTypesSelector((state) => state.taskReducer);

    const [task, setTask] = useState<ITask | null>(null);

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
                <div className={styles.currentTask}>
                    <TaskCard task={currentTask} isTaskPage />
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
