"use client";


import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { getTask } from "@/app/_http/API/tasksApi";
import { ITask } from "@/app/_types";
import classNames from "classnames";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import TaskCard from "@/app/_components/TaskCard/TaskCard";



const TaskSolutionPage = () => {

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

    if (!task)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div className={classNames(styles.container, "container")}>
            <BackButton />
            <div className={styles.content}>
                <div className={styles.task}>
                    <TaskCard task={task} solution={true} />
                </div>
            </div>
        </div>
    )
}

export default TaskSolutionPage