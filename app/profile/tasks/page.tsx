"use client";

import {
    act,
    createRef,
    ReactNode,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import styles from "./page.module.scss";
import "./page.scss";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { AlertContext } from "@/app/_context/AlertContext";
import { CSSTransition } from "react-transition-group";

const POSTS_PER_PAGE = 4;

type TasksPage = "current" | "past";

export default function JobsPage() {
    const [activeTab, setActiveTab] = useState<TasksPage>("current");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const { user, profileVerification } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { myTasks, myArchivedTasks } = useTypesSelector(
        (state) => state.contentReducer,
    );
    const dispatch = useTypesDispatch();
    const { updateMyTasks, updateMyArchivedTasks } = contentSlice.actions;

    const { showAlert } = useContext(AlertContext);

    const [hasMoreMyTasks, setHasMoreMyTasks] = useState<boolean>(false);
    const [hasMoreMyArchivedTasks, setHasMoreMyArchivedTasks] = useState<
        boolean
    >(false);

    const [currentPageMyTasks, setCurrentPageMyTasks] = useState<number>(1);
    const [
        currentPageMyArchivedTasks,
        setCurrentPageMyArchivedTasks,
    ] = useState<number>(1);

    const getMoreMyTasks = async () => {
        setIsLoadingMyTasks(true);

        const res = await getMyTasks({
            page: currentPageMyTasks + 1,
            limit: POSTS_PER_PAGE,
            q: "",
            role: user.role,
            status: "active",
        });

        if (res.status === 200) {
            // dispatch(updateTasks({ tasks: [...tasks!, ...res.tasks!] }));
            dispatch(updateMyTasks([...myTasks!, ...res.results!]));
            setHasMoreMyTasks(res.pageCount! > currentPageMyTasks + 1);
            setCurrentPageMyTasks((prev) => prev + 1);
        } else {
            showAlert(res.message);
        }
        setIsLoadingMyTasks(false);
    };

    const getMoreMyArchivedTasks = async () => {
        setIsLoadingMyTasks(true);

        const res = await getMyTasks({
            page: currentPageMyArchivedTasks + 1,
            limit: POSTS_PER_PAGE,
            q: "",
            role: user.role,
            status: "archived",
        });

        if (res.status === 200) {
            // dispatch(updateTasks({ tasks: [...tasks!, ...res.tasks!] }));
            dispatch(
                updateMyArchivedTasks([...myArchivedTasks!, ...res.results!]),
            );
            setHasMoreMyArchivedTasks(
                res.pageCount! > currentPageMyArchivedTasks + 1,
            );
            setCurrentPageMyArchivedTasks((prev) => prev + 1);
        } else {
            showAlert(res.message);
        }
        setIsLoadingMyTasks(false);
    };

    const [isLoadingMyTasks, setIsLoadingMyTasks] = useState<boolean>(true);
    const [isLoadingMyArchivedTasks, setIsLoadingMyArchivedTasks] = useState<
        boolean
    >(true);

    const myTasksListRef = useRef<HTMLDivElement>(null);
    const myArchivedTasksListRef = useRef<HTMLDivElement>(null);

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

        if (myTasks) {
            setIsLoading(false);
            return;
        }

        const asyncFunc = async () => {
            const activeTasks = await getMyTasks({
                page: 1,
                limit: POSTS_PER_PAGE,
                q: "",
                role: user.role,
                status: "active",
            });

            setHasMoreMyTasks(activeTasks.pageCount! > 1);
            setIsLoadingMyTasks(false);

            if (activeTasks.status === 200) {
                dispatch(updateMyTasks(activeTasks.results!));
                // dispatch(updateMyArchivedTasks(tasks.archived_tasks!));
            }

            const archivedTasks = await getMyTasks({
                page: 1,
                limit: POSTS_PER_PAGE,
                q: "",
                role: user.role,
                status: "archived",
            });

            setHasMoreMyArchivedTasks(archivedTasks.pageCount! > 1);
            setIsLoadingMyArchivedTasks(false);

            if (archivedTasks.status === 200) {
                dispatch(updateMyArchivedTasks(archivedTasks.results!));
            }

            setIsLoading(false);
        };
        asyncFunc();
    }, [user.role, myTasks]);

    console.log(isLoadingMyTasks, myTasks);

    const getJobsPageContent = useCallback(
        (
            jobsPage: TasksPage,
        ): {
            content: ReactNode;
            ref: RefObject<HTMLDivElement>;
        } => {
            switch (jobsPage) {
                case "current":
                    return {
                        content: (
                            <div className={styles.content}>
                                <CSSTransition
                                    nodeRef={myTasksListRef}
                                    in={!isLoadingMyTasks}
                                    timeout={500}
                                    classNames="tasks"
                                >
                                    <div
                                        ref={myTasksListRef}
                                        className={classNames(styles.taskList, {
                                            [styles.loading]: isLoading,
                                        })}
                                    >
                                        {myTasks && myTasks.length > 0 ? (
                                            <>
                                                <div className={styles.loader}>
                                                    <CustomOval />
                                                </div>
                                                <InfiniteScroll
                                                    dataLength={myTasks!.length}
                                                    className={styles.tasksList}
                                                    next={getMoreMyTasks}
                                                    hasMore={hasMoreMyTasks}
                                                    loader={
                                                        <div className="centerContent">
                                                            <CustomOval />
                                                        </div>
                                                    }
                                                >
                                                    {myTasks!.map(
                                                        (task, index) => (
                                                            <TaskCard
                                                                key={index}
                                                                task={task}
                                                            />
                                                        ),
                                                    )}
                                                </InfiniteScroll>
                                                {hasMoreMyTasks && (
                                                    <div
                                                        className={
                                                            styles.loadMore
                                                        }
                                                        onClick={() =>
                                                            getMoreMyTasks()
                                                        }
                                                    >
                                                        <p className="text fz24 fw500">
                                                            Загрузить еще
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className={styles.noTasks}>
                                                <img
                                                    src="/images/no-tasks.png"
                                                    alt="no tasks"
                                                />
                                                <p className="title">
                                                    Заданий нет
                                                </p>
                                                {!!(
                                                    user.role === "company"
                                                ) && (
                                                    <Link href="/create-task">
                                                        <Button type="secondary">
                                                            Создать задание
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CSSTransition>
                            </div>
                        ),
                        ref: createRef(),
                    };
                case "past":
                    return {
                        content: (
                            <div className={styles.content}>
                                <CSSTransition
                                    nodeRef={myArchivedTasksListRef}
                                    in={!isLoadingMyArchivedTasks}
                                    timeout={500}
                                    classNames="tasks"
                                >
                                    <div
                                        ref={myArchivedTasksListRef}
                                        className={classNames(styles.taskList, {
                                            [styles.loading]: isLoading,
                                        })}
                                    >
                                        {myArchivedTasks &&
                                        myArchivedTasks.length > 0 ? (
                                            <>
                                                <div className={styles.loader}>
                                                    <CustomOval />
                                                </div>
                                                <InfiniteScroll
                                                    dataLength={
                                                        myArchivedTasks!.length
                                                    }
                                                    className={styles.tasksList}
                                                    next={
                                                        getMoreMyArchivedTasks
                                                    }
                                                    hasMore={
                                                        hasMoreMyArchivedTasks
                                                    }
                                                    loader={
                                                        <div className="centerContent">
                                                            <CustomOval />
                                                        </div>
                                                    }
                                                >
                                                    {myArchivedTasks!.map(
                                                        (task, index) => (
                                                            <TaskCard
                                                                key={index}
                                                                task={task}
                                                            />
                                                        ),
                                                    )}
                                                </InfiniteScroll>
                                                {hasMoreMyArchivedTasks && (
                                                    <div
                                                        className={
                                                            styles.loadMore
                                                        }
                                                        onClick={() =>
                                                            getMoreMyArchivedTasks()
                                                        }
                                                    >
                                                        <p className="text fz24 fw500">
                                                            Загрузить еще
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className={styles.noTasks}>
                                                <img
                                                    src="/images/no-tasks.png"
                                                    alt="no tasks"
                                                />
                                                <p className="title">
                                                    Архивных заданий нет
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CSSTransition>
                            </div>
                        ),
                        ref: createRef(),
                    };
            }
        },
        [user.role, myTasks, myArchivedTasks],
    );

    if (profileVerification.status !== "verified") {
        return <ProfileStatus profileVerification={profileVerification} />;
    }

    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.navigation}>
                <p className="title fz48">Мои задания</p>
                <div className={styles.navigationButtons}>
                    <Button
                        className={styles.navigationButton}
                        type={activeTab === "current" ? "secondary" : "primary"}
                        onClick={() => handleTabChange("current")}
                    >
                        Актуальные
                    </Button>
                    <Button
                        className={styles.navigationButton}
                        type={activeTab === "past" ? "secondary" : "primary"}
                        onClick={() => handleTabChange("past")}
                    >
                        Архив
                    </Button>
                    {!!(user.role === "company") && (
                        <Link
                            className={styles.navigationButtonLast}
                            href="/create-task"
                        >
                            <Button type="secondary">Создать задание</Button>
                        </Link>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="centerContent">
                    <CustomOval />
                </div>
            ) : (
                <div
                    className={classNames(styles.content, {
                        [styles.exit]: isAnimating,
                    })}
                >
                    {getJobsPageContent(activeTab).content}
                </div>
            )}
        </div>
    );
}
