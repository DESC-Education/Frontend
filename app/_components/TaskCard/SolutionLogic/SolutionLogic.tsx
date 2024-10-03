"use client";

import { FC, useContext, useEffect, useState } from "react";
import styles from "./SolutionLogic.module.scss";
import classNames from "classnames";
import { ISolution } from "@/app/_types";
import { evaluateTaskSolution, getSolution } from "@/app/_http/API/tasksApi";
import { useRouter } from "next/navigation";
import CustomOval from "../../ui/CustomOval/CustomOval";
import { solutionStatuses } from "@/app/_utils/constants";
import DownloadItem from "../../ui/DownloadItem/DownloadItem";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import Button from "../../ui/Button/Button";
import Link from "next/link";
import Input from "../../ui/Input/Input";
import { AlertContext } from "@/app/_context/AlertContext";

type SolutionLogicProps = {
    solutionId: string;
};

const SolutionLogic: FC<SolutionLogicProps> = ({ solutionId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [solution, setSolution] = useState<ISolution | null>(null);
    const { user } = useTypesSelector((state) => state.userReducer);

    const { showAlert } = useContext(AlertContext);

    const [verdict, setVerdict] = useState<"completed" | "failed">("completed");
    const [comment, setComment] = useState<string>("");

    console.log(solution);

    const evaluateTask = async () => {
        const res = await evaluateTaskSolution({
            id: solutionId,
            status: verdict,
            companyComment: comment,
        });

        if (res.status === 200) {
            setSolution((prev) => ({
                ...prev!,
                status: verdict,
                companyComment: comment,
            }));
            showAlert("Решение успешно оценено!", "success");
        } else {
            showAlert("Произошла ошибка");
        }

        console.log("evaluateTaskSolution res", res);
    };

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);

        const asyncFunc = async () => {
            const res = await getSolution(solutionId);

            console.log("getSolution res is", res);

            if (res.status === 200) {
                setSolution(res.solution!);
            } else {
                router.back();
            }
        };
        asyncFunc();
        setIsLoading(false);
    }, [solutionId]);

    if (!solution)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div className={styles.solutionContent}>
            <div className={classNames(styles.solutionTitle, "title fz24")}>
                <Link
                    href={`/profile/student/${solution.user}`}
                    className={styles.avatar}
                >
                    <img
                        src={
                            solution.userProfile.logoImg
                                ? process.env.NEXT_PUBLIC_SERVER_PATH +
                                  solution.userProfile.logoImg
                                : "/images/avatar.png"
                        }
                        alt="avatar"
                    />
                    <p>
                        {solution.userProfile.firstName}{" "}
                        {solution.userProfile.lastName}
                    </p>
                </Link>
                <div
                    style={{
                        background: solutionStatuses.find(
                            (i) => i.value === solution.status,
                        )?.color,
                    }}
                    className={styles.status}
                >
                    <p
                        style={{
                            color: solutionStatuses.find(
                                (i) => i.value === solution.status,
                            )?.textColor,
                        }}
                        className="text fz20 fw500"
                    >
                        {
                            solutionStatuses.find(
                                (i) => i.value === solution.status,
                            )?.name
                        }
                    </p>
                </div>
            </div>
            <div>
                <p className={classNames("text fz24", styles.description)}>
                    {solution?.description}
                </p>
            </div>
            <div className={styles.files}>
                {!!solution.files?.length &&
                    solution.files.map((file, index) => (
                        <div key={index} className={styles.downloadItem}>
                            <DownloadItem
                                extension={file.extension}
                                name={`${file.name}.${file.extension}`}
                                url={
                                    process.env.NEXT_PUBLIC_SERVER_PATH! +
                                    file.path
                                }
                            />
                        </div>
                    ))}
            </div>
            {user.role === "company" && solution.status === "pending" && (
                <div
                    className={classNames(styles.controls, {
                        [styles.loading]: isLoading,
                    })}
                >
                    <p className="text fz24 fw500">Выберите вердикт:</p>
                    <div className={styles.verdicts}>
                        <div
                            onClick={() => setVerdict("completed")}
                            className={classNames(styles.success, {
                                [styles.active]: verdict === "completed",
                            })}
                        >
                            <p className="text fz20">Выполнил</p>
                        </div>
                        <div
                            onClick={() => setVerdict("failed")}
                            className={classNames(styles.failure, {
                                [styles.active]: verdict === "failed",
                            })}
                        >
                            <p className="text fz20">Не выполнил</p>
                        </div>
                    </div>
                    <div
                        className={classNames(styles.comment, {
                            [styles.active]: verdict === "failed",
                        })}
                    >
                        <Input
                            value={comment}
                            onChange={(e) => {
                                setComment(e);
                            }}
                            type="textarea"
                            placeholder="Оставьте свой комментарий..."
                        />
                    </div>
                    <Button type="secondary" onClick={() => evaluateTask()}>
                        Подтвердить
                    </Button>
                </div>
            )}
            {user.role === "company" && solution.status === "failed" && (
                <div className={styles.comment}>
                    <p className="text fz24">
                        <i>Ваш комментарий к решению:</i> {solution.companyComment}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SolutionLogic;
