"use client";

import BackButton from "@/app/_components/ui/BackButton/BackButton";
import classNames from "classnames";
import styles from "./page.module.scss";
import { useParams } from "next/navigation";

const TasksPage = () => {
    const { id } = useParams();

    return (
        <div className={classNames(styles.container, "container")}>
            <BackButton />
            <div>Tasks Page, {id}</div>
        </div>
    );
};

export default TasksPage;
