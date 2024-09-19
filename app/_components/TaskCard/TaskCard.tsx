"use client";

import styles from "./TaskCard.module.scss";
import Image from "next/image";
import classNames from "classnames";
import Button from "../ui/Button/Button";
<<<<<<< Updated upstream
import { ITask } from "@/app/_types";
=======
import { IFile, ISolution, ITask } from "@/app/_types";
>>>>>>> Stashed changes
import { getRemainingTime } from "@/app/_utils/time";
import Moment from "react-moment";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "moment/locale/ru";
<<<<<<< Updated upstream

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
=======
import DownloadItem from "../ui/DownloadItem/DownloadItem";
import Input from "../ui/Input/Input";
import { createSolvingTask } from "@/app/_http/API/tasksApi";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { solutionStatuses } from "@/app/_utils/constants";
import CustomSearch from "../ui/CustomSearch/CustomSearch";
import SolutionsLogic from "./SolutionsLogic/SolutionsLogic";

type TaskCardProps = {
    task: ITask;
    isTaskPage?: boolean;
    isSolvingPage?: boolean;
    isSolutionsPage?: boolean;
};

const MAX_LENGTH = 2000;
const MIN_LENGTH = 50;

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    isTaskPage = false,
    isSolvingPage = false,
    isSolutionsPage = false,
}) => {
>>>>>>> Stashed changes
    const [dayTitle, setDayTitle] = useState<string>("");
    const { user } = useTypesSelector((state) => state.userReducer);

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

<<<<<<< Updated upstream
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
=======
    const [solutionFiles, setSolutionFiles] = useState<IFile[]>([]);
    const [solutionText, setSolutionText] = useState<string>("");
    const [textLength, setTextLength] = useState(solutionText.length || 0);

    useEffect(() => {
        setTextLength(solutionText.length);
    }, [solutionText]);

    const handleCreateSolution = async () => {
        console.log("in handleCreateSolution");

        if (!solutionFiles.length) return;

        const formdata = new FormData();

        solutionFiles.forEach((el: any, i) => {
            formdata.append(`file`, el, el.name);
        });
        formdata.append("description", solutionText);
        formdata.append("taskId", task.id);

        const res = await createSolvingTask(formdata);

        console.log("createSolvingTask res", res);

        // if (res.status === 200) {
        // showAlert("Задание успешно создано!", "success");
        // dispatch(updateMyTasks({ tasks: [res.task!] }));
        // setSolutionFiles([]);
        // } else {
        // showAlert(res.message);
        // }
    };

    const isTaksHasSolutions =
        task.solutions &&
        task.solutions.length > 0 &&
        task.solutions.filter((i) => i.status === "pending").length > 0;

    // console.log(
    //     "task",
    //     task,
    //     isTaskPage,
    //     isSolvingPage,
    //     isSolutionsPage,
    //     isTaksHasSolutions,
    //     !isSolvingPage &&
    //         !isSolutionsPage &&
    //         (user.role === "student" ? "helo" : "bobus"),
    // );

    return (
        <div
            className={classNames(
                styles.taskCard,
                { [styles.extended]: isTaskPage },
                { [styles.solution]: isSolvingPage },
            )}
        >
            <div className={styles.wrapper}>
                <div className={styles.taskBody}>
                    <div className={styles.taskContent}>
                        <div className={styles.companyInfo}>
                            <div className={styles.companyLogo}>
                                <img
                                    src={
                                        task.profile?.logoImg
                                            ? process.env
                                                  .NEXT_PUBLIC_ASSETS_PATH +
                                              task.profile?.logoImg
                                            : "/images/avatar.png"
                                    }
                                    alt={task.profile?.companyName}
                                    width={50}
                                    height={50}
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
                            <div
                                className={classNames(
                                    "text",
                                    styles.descriptionBlock,
                                )}
                            >
                                <p className={styles.description}>
                                    {task.description}
                                </p>
                                {isTaskPage && task.file && (
                                    <div className={styles.downloadItem}>
                                        <DownloadItem
                                            extension="pdf"
                                            name="Техническое задание"
                                            url={
                                                process.env
                                                    .NEXT_PUBLIC_ASSETS_PATH +
                                                task.file
                                            }
                                        />
                                    </div>
                                )}
                            </div>
>>>>>>> Stashed changes
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
                        {!isTaskPage && (
                            <Link
                                className={classNames(
                                    styles.showMore,
                                    styles.proposeButton,
                                    "text green fz24 under pointer",
                                )}
                                href={`/tasks/${task.id}`}
                            >
                                <Button type="secondary">
                                    Перейти к заданию
                                </Button>
                            </Link>
                        )}
                        {isTaskPage &&
                            !isSolvingPage &&
                            !isSolutionsPage &&
                            (user.role === "student" ? (
                                <Link
                                    className={classNames(
                                        styles.showMore,
                                        styles.proposeButton,
                                        "text green fz24 under pointer",
                                    )}
                                    href={
                                        isTaksHasSolutions
                                            ? `/tasks/${task.id}/solutions`
                                            : `/tasks/${task.id}/solving`
                                    }
                                >
                                    <Button type="secondary">
                                        {isTaksHasSolutions
                                            ? "Мои решения"
                                            : "Предложить решение"}
                                    </Button>
                                </Link>
                            ) : (
                                <Link
                                    className={classNames(
                                        styles.showMore,
                                        styles.proposeButton,
                                        "text green fz24 under pointer",
                                    )}
                                    href={`/tasks/${task.id}/solutions`}
                                >
                                    <Button type="secondary">
                                        Просмотреть решения
                                    </Button>
                                </Link>
                            ))}
                    </div>
                </div>
                {isSolvingPage && (
                    <div className={styles.solutionContent}>
                        <div
                            className={classNames(
                                styles.solutionTitle,
                                "title fz28",
                            )}
                        >
                            Предложить решение
                        </div>
                        <div className={styles.solutionDescription}>
                            <p className="text fz20">
                                1. Укажите, как именно вы собираетесь выполнять
                                это задание. Опишите ключевые моменты.
                            </p>
<<<<<<< Updated upstream
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
=======
                            <p className="text fz20">
                                2. Составляйте уникальные отклики, которые
                                покажут вашу компетентность и заинтересованность
                                в проекте
                            </p>
                            <p className="text fz20">
                                3. Портфолио автоматически будет подгружено
                                к отклику.
                            </p>
                            <p className="text fz20">
                                Пройдите урок по работе на Бирже, научитесь
                                писать продающие отклики и увеличьте свои шансы
                                на получение заказа!
                            </p>
                        </div>
                        <div className={styles.solution}>
                            <p className="title fz28">Решение задачи</p>
                            <Input
                                type="textarea"
                                placeholder="Опишите что именно вам нужно. Включите в описание важные аспекты."
                                containerClassName={styles.textarea}
                                value={solutionText}
                                onChange={(val) => {
                                    setSolutionText(val);
                                }}
                                max={MAX_LENGTH}
                            />
                            <div className={styles.underdescription}>
                                <p
                                    className={classNames(
                                        "text gray fz20",
                                        styles.length,
                                    )}
                                >
                                    {textLength} из {MAX_LENGTH} символов
                                    (минимум {MIN_LENGTH})
                                </p>
                            </div>
                            <p className="title fz28">Прикрепите файлы</p>
                            <Input
                                file={solutionFiles}
                                setFile={setSolutionFiles}
                                multiple
                                maxFiles={5}
                                fileTipContent={
                                    <div>
                                        <p className="text fz16 gray">
                                            Форматы: PDF, DOCX, PNG, JPG, JPEG
                                        </p>
                                        <p className="text fz16 gray">
                                            Максимальный вес: 5МБ
                                        </p>
                                        <p className="text fz16 gray">
                                            Максимальное количество файлов: 5
                                        </p>
                                    </div>
                                }
                                type="file_multiple"
                            />
                        </div>
                        <Button
                            onClick={() => handleCreateSolution()}
                            disabled={
                                !solutionFiles.length ||
                                solutionText.length < MIN_LENGTH
                            }
                            type="secondary"
                            className={styles.applyButton}
                        >
                            Предложить решение
                        </Button>
                    </div>
                )}
                {isSolutionsPage && (
                    <SolutionsLogic
                        role={user.role as "student" | "company"}
                        taskId={task.id}
                        studnetSolutions={task.solutions}
                    />
                    // <div className={styles.solutions}>
                    //     {user.role === "student" ? (
                    //         <>
                    //             <div className={styles.header}>
                    //                 <div>
                    //                     <p className="title fz24 gray fw500">
                    //                         Описание
                    //                     </p>
                    //                 </div>
                    //                 <div>
                    //                     <p className="title fz24 gray fw500">
                    //                         Статус
                    //                     </p>
                    //                 </div>
                    //             </div>
                    //             <div className={styles.solutionsList}>
                    //                 {task.solutions.map((solution, index) => (
                    //                     <div
                    //                         className={styles.solutionItem}
                    //                         key={index}
                    //                     >
                    //                         <div
                    //                             className={
                    //                                 styles.solutionDescription
                    //                             }
                    //                         >
                    //                             <p className="text fz20">
                    //                                 {solution.description}
                    //                                 {solution.description}
                    //                                 Lorem ipsum dolor sit amet
                    //                                 consectetur adipisicing
                    //                                 elit. Nihil officiis unde
                    //                                 quibusdam ratione numquam
                    //                                 praesentium laboriosam quos.
                    //                                 Explicabo, doloremque
                    //                                 consequuntur. Ducimus,
                    //                                 deleniti molestiae minus
                    //                                 quidem deserunt perferendis
                    //                                 in blanditiis ipsa amet modi
                    //                                 dicta officia similique?
                    //                                 Corporis commodi natus rerum
                    //                                 sunt. Lorem ipsum dolor sit
                    //                                 amet consectetur,
                    //                                 adipisicing elit. Natus
                    //                                 alias aperiam fugiat
                    //                                 corporis eius nam id veniam
                    //                                 ex repellendus fuga.
                    //                             </p>
                    //                         </div>
                    //                         <p
                    //                             className={classNames(
                    //                                 "text fz28 fw500",
                    //                                 styles.status,
                    //                                 styles[solution.status],
                    //                             )}
                    //                         >
                    //                             {
                    //                                 solutionStatuses.find(
                    //                                     (i) =>
                    //                                         i.value ===
                    //                                         solution.status,
                    //                                 )?.name
                    //                             }
                    //                         </p>
                    //                         <Link
                    //                             href={`/tasks/${task.id}/solutions/${solution.id}`}
                    //                             className={styles.button}
                    //                         >
                    //                             <Button
                    //                                 type="secondary"
                    //                                 className={
                    //                                     styles.solutionTitle
                    //                                 }
                    //                             >
                    //                                 Перейти к решению
                    //                             </Button>
                    //                         </Link>
                    //                     </div>
                    //                 ))}
                    //             </div>
                    //         </>
                    //     ) : (
                    //         <>
                    //             <div className={styles.solutionsFilters}>
                    //                 <CustomSearch
                    //                     search
                    //                     options={[
                    //                         {
                    //                             name: "Сначала новые",
                    //                             value: "createdAt",
                    //                         },
                    //                         {
                    //                             name: "Сначала старые",
                    //                             value: "-createdAt",
                    //                         },
                    //                     ]}
                    //                     value={"createdAt"}
                    //                     onChange={(e) => {
                    //                         console.log(e);
                    //                     }}
                    //                 />
                    //             </div>
                    //             <div
                    //                 className={classNames(
                    //                     styles.header,
                    //                     styles.company,
                    //                 )}
                    //             >
                    //                 <div>
                    //                     <p className="title fz24 gray fw500">
                    //                         Студент
                    //                     </p>
                    //                 </div>
                    //                 <div>
                    //                     <p className="title fz24 gray fw500">
                    //                         Описание
                    //                     </p>
                    //                 </div>
                    //                 <div>
                    //                     <p className="title fz24 gray fw500">
                    //                         Статус
                    //                     </p>
                    //                 </div>
                    //             </div>
                    //             <div
                    //                 className={classNames(
                    //                     styles.solutionsList,
                    //                     styles.company,
                    //                 )}
                    //             >
                    //                 {companySolutions!.map(
                    //                     (solution, index) => (
                    //                         <div
                    //                             className={classNames(
                    //                                 styles.solutionItem,
                    //                                 styles.company,
                    //                             )}
                    //                             key={index}
                    //                         >
                    //                             <div
                    //                                 className={
                    //                                     styles.solutionUser
                    //                                 }
                    //                             >
                    //                                 <img
                    //                                     src={
                    //                                         solution.userProfile
                    //                                             .logoImg
                    //                                             ? process.env
                    //                                                   .NEXT_PUBLIC_ASSETS_PATH +
                    //                                               solution
                    //                                                   .userProfile
                    //                                                   .logoImg
                    //                                             : "/images/avatar.png"
                    //                                     }
                    //                                     alt="logo"
                    //                                     width={40}
                    //                                     height={40}
                    //                                 />
                    //                                 <p className="text fz24">
                    //                                     {solution.userProfile
                    //                                         .firstName +
                    //                                         " " +
                    //                                         solution.userProfile
                    //                                             .lastName}
                    //                                     {solution.userProfile
                    //                                         .firstName +
                    //                                         " " +
                    //                                         solution.userProfile
                    //                                             .lastName}
                    //                                 </p>
                    //                             </div>
                    //                             <div
                    //                                 className={
                    //                                     styles.solutionDescription
                    //                                 }
                    //                             >
                    //                                 <p className="text fz20">
                    //                                     {solution.description}
                    //                                 </p>
                    //                             </div>
                    //                             <p
                    //                                 className={classNames(
                    //                                     "text fz28 fw500",
                    //                                     styles.status,
                    //                                     styles[solution.status],
                    //                                 )}
                    //                             >
                    //                                 {
                    //                                     solutionStatuses.find(
                    //                                         (i) =>
                    //                                             i.value ===
                    //                                             solution.status,
                    //                                     )?.name
                    //                                 }
                    //                             </p>
                    //                             <Link
                    //                                 href={`/tasks/${task.id}/solutions/${solution.id}`}
                    //                                 className={styles.button}
                    //                             >
                    //                                 <Button
                    //                                     type="secondary"
                    //                                     className={
                    //                                         styles.solutionTitle
                    //                                     }
                    //                                 >
                    //                                     Перейти к решению
                    //                                 </Button>
                    //                             </Link>
                    //                         </div>
                    //                     ),
                    //                 )}
                    //             </div>
                    //         </>
                    //     )}
                    // </div>
                )}
>>>>>>> Stashed changes
            </div>
        </div>
    );
};

export default TaskCard;
