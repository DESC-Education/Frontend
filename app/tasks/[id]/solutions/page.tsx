"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import TaskCard from "@/app/_components/TaskCard/TaskCard";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSolutions } from "@/app/_http/API/tasksApi";
import { ISolution } from "@/app/_types";

const SolutionsPage = () => {
    const { currentTask } = useTypesSelector((state) => state.taskReducer);
    const [solutions, setSolutions] = useState<ISolution[]>([]);

    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     const asyncFunc = async () => {
    //         if (typeof id !== "string") return;

    //         const res = await getSolutions(id);

    //         if (res.status === 200) {
    //             setSolutions(res.solutions!);
    //         }
    //         setIsLoading(false);
    //         // console.log(res);
    //     };
    //     asyncFunc();
    // }, []);

    if (!currentTask || isLoading)
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
                    <TaskCard task={currentTask} isTaskPage isSolutionsPage />
                </div>
            </div>
        </div>
    );
};

export default SolutionsPage;
