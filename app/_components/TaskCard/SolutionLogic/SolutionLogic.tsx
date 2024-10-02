"use client";

import { FC, useEffect, useState } from "react";
import styles from "./SolutionLogic.module.scss";
import classNames from "classnames";
import { ISolution } from "@/app/_types";
import { getSolution } from "@/app/_http/API/tasksApi";
import { useRouter } from "next/navigation";
import CustomOval from "../../ui/CustomOval/CustomOval";
import { solutionStatuses } from "@/app/_utils/constants";
import DownloadItem from "../../ui/DownloadItem/DownloadItem";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import Button from "../../ui/Button/Button";
import Link from "next/link";

type SolutionLogicProps = {
    solutionId: string;
};

const SolutionLogic: FC<SolutionLogicProps> = ({ solutionId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [solution, setSolution] = useState<ISolution | null>(null);
    const { user } = useTypesSelector((state) => state.userReducer);

    const dispatch = useTypesDispatch();

    const router = useRouter();

    useEffect(() => {
        console.log(solutionId);

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
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
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
                <Link href={`/profile/student/${solution.user}`} className={styles.avatar}>
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
            {user.role === "company" && (
                <div className={styles.controls}>
                    <Button type="primary">ыфв</Button>
                    <Button type="secondary">ыфв</Button>
                </div>
            )}
        </div>
    );
};

export default SolutionLogic;
