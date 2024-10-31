"use client";

import styles from "./SolutionsLogic.module.scss";
import "./SolutionsLogic.scss";
import Link from "next/link";
import Button from "../../ui/Button/Button";
import classNames from "classnames";
import CustomSearch from "../../ui/CustomSearch/CustomSearch";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { solutionStatuses } from "@/app/_utils/constants";
import { ISolution } from "@/app/_types";
import { getSolutions } from "@/app/_http/API/tasksApi";
import { AlertContext } from "@/app/_context/AlertContext";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomOval from "../../ui/CustomOval/CustomOval";
import usePagination from "@/app/_hooks/usePagination";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Pagination from "../../ui/Pagination/Pagination";

const POSTS_PER_PAGE = 7;

const filters = [
    { label: "Выполненные", value: "completed" },
    { label: "Не выполненные", value: "failed" },
    { label: "На оценке", value: "pending" },
];

const sortings = [
    { label: "Сначала новые", value: "createdAt" },
    { label: "Сначала старые", value: "-createdAt" },
];

type SolutionsLogicProps = {
    taskId: string;
    role: "student" | "company";
    studnetSolutions: ISolution[] | null;
};

const SolutionsLogic: FC<SolutionsLogicProps> = ({
    taskId,
    role,
    studnetSolutions,
}) => {
    const { showAlert } = useContext(AlertContext);

    const [sorting, setSorting] = useState<"createdAt" | "-createdAt">(
        "createdAt",
    );
    const [filter, setFilter] = useState<"completed" | "failed" | "pending">(
        "pending",
    );

    const [
        currentCompanySolutions,
        totalPages,
        page,
        setPage,
        loading,
        fetchData,
    ] = usePagination<ISolution>(
        getSolutions,
        {
            task_id: taskId,
            ordering: sorting,
            status: filter,
        },
        POSTS_PER_PAGE,
    );

    const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.solutions}>
            {role === "student" ? (
                <>
                    <div className={styles.header}>
                        <div>
                            <p className="title fz24 gray fw500">Описание</p>
                        </div>
                        <div>
                            <p className="title fz24 gray fw500">Статус</p>
                        </div>
                    </div>
                    <div className={styles.solutionsList}>
                        {studnetSolutions!.map((solution, index) => (
                            <div className={styles.solutionItem} key={index}>
                                <div className={styles.solutionDescription}>
                                    <p className="text fz20">
                                        {solution.description}
                                    </p>
                                </div>
                                <p
                                    className={classNames(
                                        "text fz28 fw500",
                                        styles.status,
                                        styles[solution.status],
                                    )}
                                >
                                    {
                                        solutionStatuses.find(
                                            (i) => i.value === solution.status,
                                        )?.name
                                    }
                                </p>
                                <Link
                                    href={`/tasks/${taskId}/solutions/${solution.id}`}
                                    className={styles.button}
                                >
                                    <Button
                                        type="secondary"
                                        className={classNames(
                                            styles.solutionTitle,
                                            styles.button,
                                        )}
                                    >
                                        Перейти к решению
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.solutionsFilters}>
                        <div>
                            <div className={styles.row}>
                                <p className="title fz24 gray fw500">Фильтр:</p>
                                <CustomSearch
                                    initValue={filters[0]}
                                    options={filters}
                                    onChange={(e) => {
                                        setFilter(e.value);
                                    }}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className="title fz24 gray fw500">
                                    Сортировка:
                                </p>
                                <CustomSearch
                                    initValue={sortings[0]}
                                    options={sortings}
                                    onChange={(e) => {
                                        setSorting(e.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <Button
                                type="secondary"
                                // onClick={() => getSolutionsByFiltersAndSort()}
                                onClick={() => fetchData()}
                            >
                                Применить
                            </Button>
                        </div>
                    </div>
                    <div className={classNames(styles.header, styles.company)}>
                        <div>
                            <p className="title fz24 gray fw500">Студент</p>
                        </div>
                        <div>
                            <p className="title fz24 gray fw500">Описание</p>
                        </div>
                        <div>
                            <p className="title fz24 gray fw500">Статус</p>
                        </div>
                    </div>
                    <SwitchTransition>
                        <CSSTransition
                            key={loading ? "Goodbye, world!" : "Hello, world!"}
                            nodeRef={nodeRef}
                            timeout={200}
                            classNames="solutions"
                        >
                            <div ref={nodeRef}>
                                {loading ? (
                                    <div className={styles.centerContent}>
                                        <CustomOval />
                                    </div>
                                ) : currentCompanySolutions.length > 0 ? (
                                    <div className={classNames(styles.solutionsList, styles.company)}>
                                        {currentCompanySolutions.map(
                                            (solution, index) => (
                                                <div
                                                    className={classNames(
                                                        styles.solutionItem,
                                                        styles.company,
                                                    )}
                                                    key={index}
                                                >
                                                    <Link
                                                        href={`/profile/student/${solution.user}`}
                                                        className={
                                                            styles.solutionUser
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                solution
                                                                    .studentProfile
                                                                    .logoImg
                                                                    ? process
                                                                          .env
                                                                          .NEXT_PUBLIC_SERVER_PATH +
                                                                      solution
                                                                          .studentProfile
                                                                          .logoImg
                                                                    : "/images/avatar.png"
                                                            }
                                                            alt="logo"
                                                            width={40}
                                                            height={40}
                                                        />
                                                        <p className="text fz24">
                                                            {solution
                                                                .studentProfile
                                                                .firstName +
                                                                " " +
                                                                solution
                                                                    .studentProfile
                                                                    .lastName}
                                                        </p>
                                                    </Link>
                                                    <div
                                                        className={
                                                            styles.solutionDescription
                                                        }
                                                    >
                                                        <p className="text fz20">
                                                            {
                                                                solution.description
                                                            }
                                                        </p>
                                                    </div>
                                                    <p
                                                        className={classNames(
                                                            "text fz28 fw500",
                                                            styles.status,
                                                            styles[
                                                                solution.status
                                                            ],
                                                        )}
                                                    >
                                                        {
                                                            solutionStatuses.find(
                                                                (i) =>
                                                                    i.value ===
                                                                    solution.status,
                                                            )?.name
                                                        }
                                                    </p>
                                                    <Link
                                                        href={`/tasks/${taskId}/solutions/${solution.id}`}
                                                        className={
                                                            styles.button
                                                        }
                                                    >
                                                        <Button
                                                            type="secondary"
                                                            className={
                                                                styles.solutionTitle
                                                            }
                                                        >
                                                            Перейти к решению
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles.centerContent}>
                                        <p className="text fz24 fw500">
                                            Решений с такими фильтрами нет!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                </>
            )}
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
};

export default SolutionsLogic;
