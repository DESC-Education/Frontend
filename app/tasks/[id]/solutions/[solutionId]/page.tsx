"use client";

import styles from "./page.module.scss";
import TaskCard from "@/app/_components/TaskCard/TaskCard";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { getSolution } from "@/app/_http/API/tasksApi";
import classNames from "classnames";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const SolutionPage = () => {
    const { solutionId } = useParams();

    if (typeof solutionId !== "string") return null;

    const { currentTask } = useTypesSelector((state) => state.taskReducer);

    useEffect(() => {
        const asyncFunc = async () => {
            const res = await getSolution(solutionId);

            console.log(res);
        };
        asyncFunc();
    }, []);

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
                    <TaskCard
                        task={currentTask}
                        isTaskPage
                        isSolutionPage
                        solutionId={solutionId}
                    />
                </div>
            </div>
        </div>
    );
};

export default SolutionPage;
