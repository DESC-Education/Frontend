import styles from "./TaskCard.module.scss";
import Image from "next/image";
import classNames from "classnames";
import Button from "../ui/Button/Button";
import { ITask } from "@/app/_types";
import { getRemainingTime } from "@/app/_utils/time";
import Moment from "react-moment";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "moment/locale/ru";

type TaskCardProps = {
    task: ITask;
    viewer?:
        | "student"
        | "company"
        | "moderator"
        | "institute_moderator"
        | "admin";
};

const TaskCard: React.FC<TaskCardProps> = ({ task, viewer = "student" }) => {
    const [dayTitle, setDayTitle] = useState<string>("");

    const getDayTitle = (day: number): "дней" | "день" | "дня" | "дней" => {
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
        <div className={styles.taskCard}>
            {/* <button
                onClick={() =>
                    console.log(
                        new Date(task.deadline),
                        new Date(task.createdAt),
                    )
                }
            >
                test
            </button> */}
            {/* <div
                className={classNames(
                    "text gray fz20",
                    styles.isViewed,
                    isViewed && styles.viewed,
                )}
            >
                Просмотрено
            </div> */}
            <div className={styles.wrapper}>
                <div className={styles.taskContent}>
                    <div className={styles.companyInfo}>
                        <div className={styles.companyLogo}>
                            <Image
                                src={
                                    task.profile?.logoImg
                                        ? process.env.PUBLIC_URL +
                                          task.profile?.logoImg
                                        : "/images/avatar.png"
                                }
                                alt={task.profile?.companyName}
                                width={60}
                                height={60}
                            />
                        </div>
                        <h4
                            className={classNames(
                                styles.taskTitle,
                                "title fz28 fw500",
                            )}
                        >
                            {task.profile?.companyName}
                        </h4>
                    </div>
                    <div className={styles.taskDescription}>
                        <div
                            className={classNames(
                                styles.taskName,
                                "title fz28",
                            )}
                        >
                            {task.title}
                        </div>
                        <div className="text">
                            <p className={styles.description}>
                                {task.description}
                            </p>
                            <Link
                                href={`/tasks/${task.id}`}
                                className={classNames(
                                    styles.showMore,
                                    "text green fz24 under pointer",
                                )}
                            >
                                Показать полностью
                            </Link>
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
                    <Link
                        href={`/tasks/${task.id}`}
                        className={classNames(
                            styles.showMore,
                            styles.proposeButton,
                            "text green fz24 under pointer",
                        )}
                    >
                        <Button type="secondary">
                            {viewer === "student"
                                ? "Предложить решение"
                                : "Просмотреть решения"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
