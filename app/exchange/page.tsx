"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.scss";
import Button from "../_components/ui/Button/Button";
import Input from "../_components/ui/Input/Input";
import SelectSearch from "react-select-search";
import OrderCard from "../_components/TaskCard/TaskCard";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import classNames from "classnames";
import Header from "../_components/Header/Header";
import { ICategory, ICompanyProfile, ITask } from "../_types";
import TaskCard from "../_components/TaskCard/TaskCard";
import CustomOval from "../_components/ui/CustomOval/CustomOval";
import { getTasks } from "../_http/API/tasksApi";
import { getDateAndMonth } from "../_utils/time";
import Moment from "react-moment";
import "moment/locale/ru";
import {
    CSSTransition,
    SwitchTransition,
    TransitionGroup,
} from "react-transition-group";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { taskSlice } from "../_store/reducers/taskSlice";
import "./page.scss";
import { sortingOptions } from "../_utils/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { AlertContext } from "../_context/AlertContext";
import { div, s } from "framer-motion/client";
import CustomSearch from "../_components/ui/CustomSearch/CustomSearch";
import Link from "next/link";

const POSTS_PER_PAGE = 5;

export default function ExchangePage() {
    const { tasks, categories } = useTypesSelector(
        (state) => state.taskReducer,
    );
    const { replyCount } = useTypesSelector((state) => state.contentReducer);
    const { studentProfile, user } = useTypesSelector(
        (state) => state.userReducer,
    );
    const dispatch = useTypesDispatch();
    const { updateTasks } = taskSlice.actions;
    const [isLoading, setIsLoading] = useState(tasks?.length !== 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const listRef = useRef<any>(null);

    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
        null,
    );
    
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string[];
    }>({});

    const [sorting, setSorting] = useState<"createdAt" | "-createdAt">(
        "-createdAt",
    );
    const { showAlert } = useContext(AlertContext);

    const [isTasksFetched, setIsTasksFetched] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSelectFilter = (
        filterCategoryId: string,
        filterId: string,
        checked: boolean,
    ) => {
        if (checked) {
            setSelectedFilters((prev) => ({
                ...prev,
                [filterCategoryId]: [
                    ...(prev[filterCategoryId] || []),
                    filterId,
                ],
            }));
        } else {
            setSelectedFilters((prev) => ({
                ...prev,
                [filterCategoryId]: (prev[filterCategoryId] || []).filter(
                    (item) => item !== filterId,
                ),
            }));
        }
    };

    useEffect(() => {
        setIsTasksFetched(false);
    }, [selectedCategory, selectedFilters, sorting]);

    useEffect(() => {
        if (tasks) {
            setIsLoading(false);
            return;
        }

        const asyncFunc = async () => {
            const tasks = await getTasks(1, POSTS_PER_PAGE);

            if (tasks.status === 200) {
                dispatch(updateTasks({ tasks: tasks.tasks! }));
                setHasMore(tasks.pageCount! > 1);
                setIsTasksFetched(true);
                setIsLoading(false);
            }
        };
        asyncFunc();
    }, [tasks]);

    const clearTasks = async () => {
        setIsLoading(true);
        setHasMore(false);
        setCurrentPage(1);

        setSelectedCategory(null);
        setSelectedFilters({});

        const res = await getTasks(1, POSTS_PER_PAGE, "", [], "createdAt");

        if (res.status === 200) {
            dispatch(updateTasks({ tasks: res.tasks! }));
            setHasMore(res.pageCount! > 1);
            setIsTasksFetched(true);
        } else {
            showAlert(res.message);
        }
        setIsLoading(false);
    };

    const getTasksByFiltersAndSort = async (
        sortingBy: "createdAt" | "-createdAt" = "-createdAt",
    ) => {
        setIsLoading(true);
        setSorting(sortingBy);
        setCurrentPage(1);

        const res = await getTasks(
            1,
            POSTS_PER_PAGE,
            selectedCategory?.id,
            Object.keys(selectedFilters)
                .map((key) => selectedFilters[key])
                .flat(),
            sortingBy ? sortingBy : sorting,
        );

        if (res.status === 200) {
            dispatch(updateTasks({ tasks: res.tasks! }));
            setHasMore(res.pageCount! > 1);
            setIsTasksFetched(true);
        } else {
            showAlert(res.message);
        }
        setIsLoading(false);
    };

    const getMoreTasks = async () => {
        setIsLoading(true);

        const res = await getTasks(
            currentPage + 1,
            POSTS_PER_PAGE,
            selectedCategory?.id,
            Object.keys(selectedFilters)
                .map((key) => selectedFilters[key])
                .flat(),
            sorting,
        );

        if (res.status === 200) {
            dispatch(updateTasks({ tasks: [...tasks!, ...res.tasks!] }));
            setHasMore(res.pageCount! > currentPage + 1);
            setCurrentPage((prev) => prev + 1);
            setIsTasksFetched(true);
        } else {
            showAlert(res.message);
        }
        setIsLoading(false);
    };

    if (tasks === null)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div className="container">
            <h2 className={classNames(styles.exchangeTitle, "title fz32")}>
                Биржа заданий
            </h2>
            <div className={styles.mainContainer}>
                {isMobile && (
                    <div
                        className={classNames(styles.filtersMenu, {
                            [styles.open]: isOpen,
                        })}
                    >
                        <div className={styles.filters}>
                            <div className={styles.filtersHeader}>
                                <h3 className="title fz28 fw500">Фильтры</h3>
                                <div className={styles.closeButton} onClick={() => setIsOpen(false)}></div>
                            </div>
                            <div className={styles.filterGroup}>
                                <p
                                    className={classNames(
                                        "text gray fz20",
                                        styles.filterTitle,
                                    )}
                                >
                                    Категории
                                </p>
                                {categories?.map((category, index) => (
                                    <label
                                        key={index}
                                        className={styles.filterLabel}
                                    >
                                        <Input
                                            type="checkbox"
                                            checked={
                                                selectedCategory?.id ===
                                                category.id
                                            }
                                            onCheck={(e) =>
                                                setSelectedCategory(
                                                    categories.find(
                                                        (item) =>
                                                            item.id ===
                                                            category.id,
                                                    )!,
                                                )
                                            }
                                        />
                                        <p className="text fw500 fz20">
                                            {category.name}
                                        </p>
                                    </label>
                                ))}
                            </div>
                            {selectedCategory ? (
                                <TransitionGroup>
                                    {selectedCategory.filterCategories.map(
                                        (filterCategory, catIndex) => (
                                            <CSSTransition
                                                key={catIndex}
                                                timeout={200}
                                                classNames="filterGroup"
                                            >
                                                <div
                                                    key={catIndex}
                                                    className={
                                                        styles.filterGroup
                                                    }
                                                >
                                                    <h4 className="text gray fz20">
                                                        {filterCategory.name}
                                                    </h4>
                                                    {filterCategory.filters.map(
                                                        (filter, filIndex) => (
                                                            <label
                                                                key={filIndex}
                                                                className={
                                                                    styles.filterLabel
                                                                }
                                                            >
                                                                <Input
                                                                    type="checkbox"
                                                                    onCheck={(
                                                                        e,
                                                                    ) =>
                                                                        handleSelectFilter(
                                                                            filterCategory.id,
                                                                            filter.id,
                                                                            e,
                                                                        )
                                                                    }
                                                                    checked={selectedFilters[
                                                                        filterCategory
                                                                            .id
                                                                    ]?.includes(
                                                                        filter.id,
                                                                    )}
                                                                />
                                                                <p className="text fw500 fz20">
                                                                    {
                                                                        filter.name
                                                                    }
                                                                </p>
                                                            </label>
                                                        ),
                                                    )}
                                                </div>
                                            </CSSTransition>
                                        ),
                                    )}
                                </TransitionGroup>
                            ) : (
                                <p
                                    className={classNames(
                                        "text center fz20",
                                        styles.selectText,
                                    )}
                                >
                                    Выберите категорию
                                </p>
                            )}
                            <div className={styles.buttons}>
                                <Button
                                    disabled={isTasksFetched}
                                    type="secondary"
                                    onClick={() => (getTasksByFiltersAndSort(), setIsOpen(false))}
                                    className={styles.applyButton}
                                >
                                    Применить
                                </Button>
                                <Button
                                    type="primary"
                                    className={styles.clearButton}
                                    onClick={() => {
                                        clearTasks();
                                    }}
                                >
                                    Очистить
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {!isMobile && (
                    <div className={styles.sidebar}>
                        <div className={styles.filters}>
                            <div className={styles.filtersHeader}>
                                <h3 className="title fz28 fw500">Фильтры</h3>
                            </div>
                            <div className={styles.filterGroup}>
                                <p
                                    className={classNames(
                                        "text gray fz20",
                                        styles.filterTitle,
                                    )}
                                >
                                    Категории
                                </p>
                                {categories?.map((category, index) => (
                                    <label
                                        key={index}
                                        className={styles.filterLabel}
                                    >
                                        <Input
                                            type="checkbox"
                                            checked={
                                                selectedCategory?.id ===
                                                category.id
                                            }
                                            onCheck={(e) =>
                                                setSelectedCategory(
                                                    categories.find(
                                                        (item) =>
                                                            item.id ===
                                                            category.id,
                                                    )!,
                                                )
                                            }
                                        />
                                        <p className="text fw500 fz20">
                                            {category.name}
                                        </p>
                                    </label>
                                ))}
                            </div>
                            {selectedCategory ? (
                                <TransitionGroup>
                                    {selectedCategory.filterCategories.map(
                                        (filterCategory, catIndex) => (
                                            <CSSTransition
                                                key={catIndex}
                                                timeout={200}
                                                classNames="filterGroup"
                                            >
                                                <div
                                                    key={catIndex}
                                                    className={
                                                        styles.filterGroup
                                                    }
                                                >
                                                    <h4 className="text gray fz20">
                                                        {filterCategory.name}
                                                    </h4>
                                                    {filterCategory.filters.map(
                                                        (filter, filIndex) => (
                                                            <label
                                                                key={filIndex}
                                                                className={
                                                                    styles.filterLabel
                                                                }
                                                            >
                                                                <Input
                                                                    type="checkbox"
                                                                    onCheck={(
                                                                        e,
                                                                    ) =>
                                                                        handleSelectFilter(
                                                                            filterCategory.id,
                                                                            filter.id,
                                                                            e,
                                                                        )
                                                                    }
                                                                    checked={selectedFilters[
                                                                        filterCategory
                                                                            .id
                                                                    ]?.includes(
                                                                        filter.id,
                                                                    )}
                                                                />
                                                                <p className="text fw500 fz20">
                                                                    {
                                                                        filter.name
                                                                    }
                                                                </p>
                                                            </label>
                                                        ),
                                                    )}
                                                </div>
                                            </CSSTransition>
                                        ),
                                    )}
                                </TransitionGroup>
                            ) : (
                                <p
                                    className={classNames(
                                        "text center fz20",
                                        styles.selectText,
                                    )}
                                >
                                    Выберите категорию
                                </p>
                            )}
                            <div className={styles.buttons}>
                                <Button
                                    type="secondary"
                                    onClick={() => getTasksByFiltersAndSort()}
                                    className={styles.applyButton}
                                >
                                    Применить
                                </Button>
                                <Button
                                    type="primary"
                                    className={styles.clearButton}
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSelectedFilters({});
                                        setTimeout(() => {
                                            getTasksByFiltersAndSort();
                                        }, 100);
                                    }}
                                >
                                    Очистить
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <main className={styles.mainContent}>
                    <div className={styles.topPanel}>
                        {!!(user.role === "student") ? (
                            <div className={styles.replayCount}>
                                <div className={styles.bar}>
                                    <div className={styles.barText}>
                                        <p className="text fw500">Отклики</p>
                                        <p className="text gray fw500">
                                            Осталось {studentProfile.replyCount}{" "}
                                            из {replyCount}
                                        </p>
                                    </div>
                                    <div className={styles.barContent}>
                                        <div
                                            style={{
                                                width:
                                                    (studentProfile.replyCount /
                                                        replyCount) *
                                                    100 +
                                                    "%",
                                            }}
                                            className={styles.barProgress}
                                        ></div>
                                    </div>
                                </div>
                                <div className={styles.delimiter}></div>
                                <div className={styles.date}>
                                    <p className="text">Дата пополнения:</p>
                                    <p className="text fw500">
                                        <Moment format="DD MMMM" locale="ru">
                                            {studentProfile.replyReloadDate}
                                        </Moment>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Link
                                className={styles.createTask}
                                href="/create-task"
                            >
                                <Button type="primary">Создать задание</Button>
                            </Link>
                        )}
                        <div className={styles.sorting}>
                            <div className={styles.sort}>
                                <span className="title fz28 fw500">
                                    Сортировка:
                                </span>
                                <CustomSearch
                                    value={sorting}
                                    onChange={(e: any) => {
                                        setSorting(e);
                                        getTasksByFiltersAndSort(e);
                                    }}
                                    options={sortingOptions}
                                />
                            </div>
                            {isMobile && (
                                <button
                                    className={classNames(styles.filters, {
                                        [styles.open]: isOpen,
                                    })}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <div
                                        className={classNames(
                                            styles.filterButton,
                                            { [styles.open]: isOpen },
                                        )}
                                    >
                                        1
                                    </div>
                                    <div className="title fz28 fw500">
                                        Фильтры
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* {isLoading ? (
                        <div className="centerContent">
                            <CustomOval />
                        </div>
                    ) : ( */}
                    <CSSTransition
                        nodeRef={listRef}
                        in={!isLoading}
                        timeout={500}
                        classNames="tasks"
                    >
                        <div
                            ref={listRef}
                            className={classNames(styles.taskList, {
                                [styles.loading]: isLoading,
                            })}
                        >
                            {tasks?.length === 0 ? (
                                <div className="centerContent">
                                    <img src="/images/questions.png" />
                                    <p
                                        className={classNames(
                                            "text fz24 fw500 center",
                                            styles.noTasks,
                                        )}
                                    >
                                        Заданий с такими фильтрами нет!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.loader}>
                                        <CustomOval />
                                    </div>
                                    <InfiniteScroll
                                        dataLength={tasks!.length}
                                        className={styles.tasksList}
                                        next={getMoreTasks}
                                        hasMore={hasMore}
                                        loader={
                                            <div className="centerContent">
                                                <CustomOval />
                                            </div>
                                        }
                                    // endMessage={
                                    //     <p className="text fz24 fw500 center">
                                    //         Больше заданий нет!
                                    //     </p>
                                    // }
                                    >
                                        {tasks!.map((task, index) => (
                                            <TaskCard key={index} task={task} />
                                        ))}
                                    </InfiniteScroll>
                                    {hasMore && (
                                        <div
                                            className={styles.loadMore}
                                            onClick={() => getMoreTasks()}
                                        >
                                            <p className="text fz24 fw500">
                                                Загрузить еще
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CSSTransition>
                    {/* )} */}
                </main>
            </div>
        </div>
    );
}
