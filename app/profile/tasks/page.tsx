"use client";

import {
    act,
    createRef,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useState,
} from "react";
import styles from "./page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import Link from "next/link";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { getMyTasks } from "@/app/_http/API/tasksApi";
import TaskCard from "@/app/_components/TaskCard/TaskCard";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import ProfileStatus from "../ProfileStatus/ProfileStatus";

type TasksPage = "current" | "past";

export default function JobsPage() {
    const [activeTab, setActiveTab] = useState<TasksPage>("current");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const { user, profileVerification } = useTypesSelector((state) => state.userReducer);
    const { myTasks, myArchivedTasks } = useTypesSelector(
        (state) => state.contentReducer,
    );
    const dispatch = useTypesDispatch();
    const { updateMyTasks, updateMyArchivedTasks } = contentSlice.actions;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleTabChange = (newTab: TasksPage) => {
        if (activeTab === newTab) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(newTab);
            setIsAnimating(false);
        }, 300);
    };

    useEffect(() => {
        if (!user.id) return;
        const asyncFunc = async () => {
            const tasks = await getMyTasks({
                page: 1,
                limit: 15,
                q: "",
                role: user.role,
                status: "archived"
            });

            console.log("tasks", tasks);

            if (tasks.status === 200) {
                // dispatch(updateMyTasks(tasks.active_tasks!));
                // dispatch(updateMyArchivedTasks(tasks.archived_tasks!));
            }

            setIsLoading(false);
        };
        asyncFunc();
    }, [user.role]);

return <div></div>
//     const getJobsPageContent = useCallback((
//         jobsPage: TasksPage,
//     ): {
//         content: ReactNode;
//         ref: RefObject<HTMLDivElement>;
//     } => {
//         switch (jobsPage) {
//             case "current":
//                 console.log(user, myTasks);
                
//                 return {
//                     content: (
//                         <div className={styles.content}>
//                             {myTasks.length > 0 ? (
//                                 <div>
//                                     {myTasks.map((task, index) => (
//                                         <TaskCard viewer={user.role} key={index} task={task} />
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className={styles.noTasks}>
//                                     <img
//                                         src="/images/no-tasks.png"
//                                         alt="no tasks"
//                                     />
//                                     <p className="title">Заданий нет</p>
//                                     {!!(user.role === "company") && (
//                                         <Link href="/create-task">
//                                             <Button type="secondary">
//                                                 Создать задание
//                                             </Button>
//                                         </Link>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     ),
//                     ref: createRef(),
//                 };
//             case "past":
//                 return {
//                     content: (
//                         <div className={styles.content}>
//                             {myArchivedTasks.length > 0 ? (
//                                 <div>Такси есть</div>
//                             ) : (
//                                 <div className={styles.noTasks}>
//                                     <img
//                                         src="/images/no-tasks.png"
//                                         alt="no tasks"
//                                     />
//                                     <p className="title">Заданий нет</p>
//                                 </div>
//                             )}
//                         </div>
//                     ),
//                     ref: createRef(),
//                 };
//         }
//     }, [user.role, myTasks, myArchivedTasks]);

//     if (profileVerification.status !== "verified") {
//         return <ProfileStatus profileVerification={profileVerification} />;
//     }

//     return (
//         <div className={classNames(styles.container, "container")}>
//             <div className={styles.navigation}>
//                 <p className="title fz48">Мои задания</p>
//                 <div className={styles.navigationButtons}>
//                     <Button
//                         className={styles.navigationButton}
//                         type={activeTab === "current" ? "secondary" : "primary"}
//                         onClick={() => handleTabChange("current")}
//                     >
//                         Актуальные
//                     </Button>
//                     <Button
//                         className={styles.navigationButton}
//                         type={activeTab === "past" ? "secondary" : "primary"}
//                         onClick={() => handleTabChange("past")}
//                     >
//                         Архив
//                     </Button>
//                     {!!(user.role === "company") && (
//                         <Link
//                             className={styles.navigationButtonLast}
//                             href="/create-task"
//                         >
//                             <Button type="secondary">Создать задание</Button>
//                         </Link>
//                     )}
//                 </div>
//             </div>
//             {isLoading ? (
//                 <div className="centerContent">
//                     <CustomOval />
//                 </div>
//             ) : (
//                 <div
//                     className={classNames(styles.content, {
//                         [styles.exit]: isAnimating,
//                     })}
//                 >
//                     {getJobsPageContent(activeTab).content}
//                 </div>
//             )}
//         </div>
//     );
}
