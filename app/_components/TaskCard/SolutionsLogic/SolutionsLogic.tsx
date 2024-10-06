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

const POSTS_PER_PAGE = 3;

const filters = [
    { name: "Выполненные", value: "completed" },
    { name: "Не выполненные", value: "failed" },
    { name: "На оценке", value: "pending" },
];

const sortings = [
    { name: "Сначала новые", value: "createdAt" },
    { name: "Сначала старые", value: "-createdAt" },
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
                                        {solution.description}
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Nihil officiis unde
                                        quibusdam ratione numquam praesentium
                                        laboriosam quos. Explicabo, doloremque
                                        consequuntur. Ducimus, deleniti
                                        molestiae minus quidem deserunt
                                        perferendis in blanditiis ipsa amet modi
                                        dicta officia similique? Corporis
                                        commodi natus rerum sunt. Lorem ipsum
                                        dolor sit amet consectetur, adipisicing
                                        elit. Natus alias aperiam fugiat
                                        corporis eius nam id veniam ex
                                        repellendus fuga.
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
                                        className={styles.solutionTitle}
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
                            <div>
                                <p className="title fz24 gray fw500">Фильтр:</p>
                                <CustomSearch
                                    options={filters}
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e);
                                    }}
                                />
                            </div>
                            <div>
                                <p className="title fz24 gray fw500">
                                    Сортировка:
                                </p>
                                <CustomSearch
                                    options={sortings}
                                    value={sorting}
                                    onChange={(e) => {
                                        setSorting(e);
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
                                    <div className={styles.solutionsList}>
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
                                                                    .userProfile
                                                                    .logoImg
                                                                    ? process
                                                                          .env
                                                                          .NEXT_PUBLIC_SERVER_PATH +
                                                                      solution
                                                                          .userProfile
                                                                          .logoImg
                                                                    : "/images/avatar.png"
                                                            }
                                                            alt="logo"
                                                            width={40}
                                                            height={40}
                                                        />
                                                        <p className="text fz24">
                                                            {solution
                                                                .userProfile
                                                                .firstName +
                                                                " " +
                                                                solution
                                                                    .userProfile
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
                <div className={styles.pagination}>
                    {Array(totalPages)
                        .fill(0)
                        .map((i, ind) => (
                            <div
                                className={classNames(styles.paginationItem, {
                                    [styles.active]: page === ind + 1,
                                })}
                                key={ind}
                                onClick={() => setPage(ind + 1)}
                            >
                                <div>{ind + 1}</div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default SolutionsLogic;
