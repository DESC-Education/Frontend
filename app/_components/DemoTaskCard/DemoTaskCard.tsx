import styles from "./DemoTaskCard.module.scss";
import classNames from "classnames";
import Moment from "react-moment";
import DownloadItem from "../ui/DownloadItem/DownloadItem";
import Link from "next/link";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { IFile, ITask } from "@/app/_types";
import { ModalContext } from "@/app/_context/ModalContext";
import "moment/locale/ru";

type DemoTaskCardProps = {
    task: Partial<ITask>;
    files: IFile[];
};

const DemoTaskCard: FC<DemoTaskCardProps> = ({ task, files }) => {
    const [dayTitle, setDayTitle] = useState<string>("");

    const { closeModal } = useContext(ModalContext);

    const getDayTitle = (day: number): "дней" | "день" | "дня" => {
        const number = day;

        if (number > 10 && [11, 12, 13, 14].includes(number % 100))
            return "дней";
        const last_num = number % 10;
        if (last_num == 1) return "день";
        if ([2, 3, 4].includes(last_num)) return "дня";
        if ([5, 6, 7, 8, 9, 0].includes(last_num)) return "дней";
        return "дней";
    };

    const daysRef = useRef<any>(null);

    useEffect(() => {
        if (!daysRef.current) return;

        setDayTitle(getDayTitle(daysRef.current.state.content));
    }, [daysRef.current, task.title]);

    return (
        <div className={classNames(styles.taskCard)}>
            <div className={styles.wrapper}>
                <div className={styles.taskBody}>
                    <div className={styles.taskContent}>
                        <Link
                            onClick={() => closeModal()}
                            href={`/profile/company/${task.profile?.id}`}
                            className={styles.companyInfo}
                        >
                            <div className={styles.companyLogo}>
                                <img
                                    src={
                                        task.profile?.logoImg
                                            ? process.env
                                                  .NEXT_PUBLIC_SERVER_PATH +
                                              task.profile?.logoImg
                                            : "/images/avatar.png"
                                    }
                                    alt={task.profile?.companyName}
                                    width={50}
                                    height={50}
                                />
                            </div>

                            <p
                                className={classNames(
                                    styles.taskTitle,
                                    "title fz28 fw500",
                                )}
                            >
                                {task.profile?.companyName}
                            </p>
                        </Link>

                        <div className={styles.taskDescription}>
                            <div
                                className={classNames(
                                    styles.taskName,
                                    "title fz28 fw500",
                                )}
                            >
                                {task.title}
                            </div>
                            <div
                                className={classNames(
                                    "text",
                                    styles.descriptionBlock,
                                )}
                            >
                                <p
                                    className={classNames(
                                        "text fz20",
                                        styles.description,
                                    )}
                                >
                                    {task.description}
                                </p>
                                {!!files.length &&
                                    files.map((file, index) => (
                                        <div
                                            key={index}
                                            className={styles.downloadItem}
                                        >
                                            <DownloadItem
                                                showcase
                                                extension={file.extension}
                                                name={`${file.name}`}
                                                url={
                                                    process.env
                                                        .NEXT_PUBLIC_SERVER_PATH! +
                                                    file.path
                                                }
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.taskFooter}>
                        <div className={styles.deadlineAndTime}>
                            <span
                                className={classNames(
                                    styles.deadline,
                                    "text fw500",
                                )}
                            >
                                Срок выполнения:{" "}
                                <Moment
                                    ref={daysRef}
                                    diff={task.createdAt}
                                    unit="days"
                                    locale="ru"
                                >
                                    {task.deadline}
                                </Moment>{" "}
                                {dayTitle}
                            </span>
                            <span
                                className={classNames(
                                    styles.timeLeft,
                                    "text fw500 fz20",
                                )}
                            >
                                осталось:{" "}
                                <Moment locale="ru" toNow ago>
                                    {task.deadline}
                                </Moment>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoTaskCard;
