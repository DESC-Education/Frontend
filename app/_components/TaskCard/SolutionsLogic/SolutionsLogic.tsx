"use client";

import styles from "./SolutionsLogic.module.scss";
import Link from "next/link";
import Button from "../../ui/Button/Button";
import classNames from "classnames";
import CustomSearch from "../../ui/CustomSearch/CustomSearch";
import { FC, useContext, useEffect, useState } from "react";
import { solutionStatuses } from "@/app/_utils/constants";
import { ISolution } from "@/app/_types";
import { getSolutions } from "@/app/_http/API/tasksApi";
import { AlertContext } from "@/app/_context/AlertContext";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomOval from "../../ui/CustomOval/CustomOval";

const POSTS_PER_PAGE = 1;

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const { showAlert } = useContext(AlertContext);

    const [sorting, setSorting] = useState<"createdAt" | "-createdAt">(
        "createdAt",
    );
    const [filter, setFilter] = useState<"completed" | "failed" | "pending">(
        "pending",
    );

    const [currentCompanySolutions, setCurrentCompanySolutions] = useState<
        ISolution[]
    >([]);

    useEffect(() => {
        getSolutionsByFiltersAndSort();
    }, [])

    // const get

    const getSolutionsByFiltersAndSort = async () => {
        setIsLoading(true);
        setCurrentPage(1);

        const res = await getSolutions(
            taskId,
            sorting,
            filter,
            currentPage,
            POSTS_PER_PAGE,
        );

        console.log("getSolutionsByFiltersAndSort res", res);

        if (res.status === 200) {
            setCurrentCompanySolutions(res.solutions!);
            setHasMore(res.pageCount! > 1);
        } else {
            showAlert(res.message);
        }
        setIsLoading(false);
    };

    const getMoreSolutions = async () => {
        setIsLoading(true);

        const res = await getSolutions(
            taskId,
            sorting,
            filter,
            currentPage,
            POSTS_PER_PAGE,
        );

        console.log("getMoreTasks res", res);

        if (res.status === 200) {
            setCurrentCompanySolutions((prev) => [...prev, ...res.solutions!]);
            setHasMore(res.pageCount! > currentPage + 1);
            setCurrentPage((prev) => prev + 1);
        } else {
            showAlert(res.message);
        }
        setIsLoading(false);
    };

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
                            <p className="title fz24 gray fw500">Фильтр</p>
                            <CustomSearch
                                options={filters}
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e);
                                }}
                            />
                        </div>
                        <div>
                            <p className="title fz24 gray fw500">Сортировка</p>
                            <CustomSearch
                                options={sortings}
                                value={sorting}
                                onChange={(e) => {
                                    setSorting(e);
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                type="primary"
                                onClick={() => getSolutionsByFiltersAndSort()}
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
                    <InfiniteScroll
                        dataLength={currentCompanySolutions.length}
                        className={classNames(
                            styles.solutionsList,
                            styles.company,
                        )}
                        next={getMoreSolutions}
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
                        {currentCompanySolutions.map((solution, index) => (
                            <div
                                className={classNames(
                                    styles.solutionItem,
                                    styles.company,
                                )}
                                key={index}
                            >
                                <div className={styles.solutionUser}>
                                    <img
                                        src={
                                            solution.userProfile.logoImg
                                                ? process.env
                                                      .NEXT_PUBLIC_ASSETS_PATH +
                                                  solution.userProfile.logoImg
                                                : "/images/avatar.png"
                                        }
                                        alt="logo"
                                        width={40}
                                        height={40}
                                    />
                                    <p className="text fz24">
                                        {solution.userProfile.firstName +
                                            " " +
                                            solution.userProfile.lastName}
                                        {solution.userProfile.firstName +
                                            " " +
                                            solution.userProfile.lastName}
                                    </p>
                                </div>
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
                                        className={styles.solutionTitle}
                                    >
                                        Перейти к решению
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </InfiniteScroll>
                </>
            )}
        </div>
    );
};

export default SolutionsLogic;
