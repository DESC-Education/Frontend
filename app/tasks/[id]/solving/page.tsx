"use client";

import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { getTask } from "@/app/_http/API/tasksApi";
import { ITask } from "@/app/_types";
import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./page.module.scss";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import TaskCard from "@/app/_components/TaskCard/TaskCard";

const TaskSolutionPage = () => {
    const { currentTask } = useTypesSelector((state) => state.taskReducer);
    const { id } = useParams<{ id: string }>();

    const router = useRouter();

    useEffect(() => {
        if (
            currentTask &&
            currentTask.solutions.at(-1)?.status === "pending" &&
            typeof window !== "undefined"
        ) {
            router.replace(`/tasks/${id}/solutions`);
        }
    }, [currentTask]);

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
                <div className={styles.task}>
                    <TaskCard task={currentTask} isTaskPage isSolvingPage />
                </div>
            </div>
        </div>
    );
};

export default TaskSolutionPage;
