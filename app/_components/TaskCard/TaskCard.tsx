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
import DownloadItem from "../ui/DownloadItem/DownloadItem";
import Input from "../ui/Input/Input";

type TaskCardProps = {
    task: ITask;
    viewer?:
    | "student"
    | "company"
    | "moderator"
    | "institute_moderator"
    | "admin";

    extended?: boolean;
    solution?: boolean;
};
const maxLength = 2000;
const minLength = 5;

const TaskCard: React.FC<TaskCardProps> = ({ task, viewer = "student", extended = false, solution = false }) => {
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
        <div className={classNames(styles.taskCard, { [styles.extended]: extended }, { [styles.solution]: solution })}>
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
                            {extended || solution ? (
                                <div className={styles.downloadItem}>
                                    <DownloadItem extension="pdf" name="Техническое задание" url="#" />
                                </div>
                            ) : (
                                <></>
                            )}
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
                    {
                        extended ?
                            (
                                <Link
                                    href={`/tasks/${task.id}/solution`}
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
                            )
                            :
                            (
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
                            )
                    }
                </div>
            </div>
            {solution ?
                (
                    <div className={styles.solutionContent}>
                        <div className={classNames(styles.solutionTitle, "title fz28")}>Предложить решение</div>
                        <div className={styles.solutionDescription}>
                            <p className="text fz20">
                                1. Укажите, как именно вы собираетесь выполнять это задание. Опишите ключевые моменты.
                            </p>
                            <p className="text fz20">
                                2. Составляйте уникальные отклики, которые покажут вашу компетентность и заинтересованность в проекте
                            </p>
                            <p className="text fz20">
                                3. Портфолио автоматически будет подгружено к отклику.
                            </p>
                            <p className="text fz20">
                                Пройдите урок по работе на Бирже, научитесь писать продающие отклики и увеличьте свои шансы на получение заказа!
                            </p>
                        </div>
                        <div className={styles.solution}>
                            <p className="title fz28">Решение задачи</p>
                            <Input
                                type="textarea"
                                placeholder="Опишите что именно вам нужно. Включите в описание важные аспекты."
                                containerClassName={styles.textarea}
                                value=""
                                onChange={() => { }}
                                max={maxLength}
                            />
                            <div className={styles.underdescription}>
                                <p
                                    className={classNames(
                                        "text gray fz20",
                                        styles.length,
                                    )}
                                >
                                    {0} из {maxLength} символов (минимум{" "}
                                    {minLength})
                                </p>
                            </div>
                            <Input type="file" />
                        </div>
                        <Button type="secondary" className={styles.applyButton}>
                            Предложить решение
                        </Button>
                    </div>
                )
                :
                (
                    <></>
                )
            }
        </div>
    );
};

export default TaskCard;
