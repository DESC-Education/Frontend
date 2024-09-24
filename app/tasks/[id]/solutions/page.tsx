"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import TaskCard from "@/app/_components/TaskCard/TaskCard";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";

const SolutionsPage = () => {
    const { currentTask } = useTypesSelector((state) => state.taskReducer);
    
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
                    <TaskCard task={currentTask} isTaskPage isSolutionsPage />
                </div>
            </div>
        </div>
    );
};

export default SolutionsPage;
