"use client";

import styles from "./TaskCard.module.scss";
import Image from "next/image";
import classNames from "classnames";
import Button from "../ui/Button/Button";
import { IFile, ISolution, ITask } from "@/app/_types";
import { getRemainingTime } from "@/app/_utils/time";
import Moment from "react-moment";
import { use, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "moment/locale/ru";
import DownloadItem from "../ui/DownloadItem/DownloadItem";
import Input from "../ui/Input/Input";
import { createSolvingTask } from "@/app/_http/API/tasksApi";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { solutionStatuses } from "@/app/_utils/constants";
import CustomSearch from "../ui/CustomSearch/CustomSearch";
import SolutionsLogic from "./SolutionsLogic/SolutionsLogic";
import SolvingLogic from "./SolvingLogic/SolvingLogic";
import SolutionLogic from "./SolutionLogic/SolutionLogic";
import { createChat } from "@/app/_http/API/chatsApi";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { chatSlice } from "@/app/_store/reducers/chatSlice";
import { useRouter } from "next/navigation";
import CustomOval from "../ui/CustomOval/CustomOval";
import ConfirmModal from "../modals/ConfirmModal/ConfirmModal";
import { ModalContext } from "@/app/_context/ModalContext";

type TaskCardProps = {
    task: ITask;
    solutionId?: string;
    isTaskPage?: boolean;
    isSolvingPage?: boolean;
    isSolutionsPage?: boolean;
    isSolutionPage?: boolean;
    isMyTask?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    solutionId = "",
    isTaskPage = false,
    isSolvingPage = false,
    isSolutionsPage = false,
    isSolutionPage = false,
    isMyTask = false,
}) => {
    const [dayTitle, setDayTitle] = useState<string>("");
    const { user, companyProfile } = useTypesSelector(
        (state) => state.userReducer,
    );

    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

    const dispatch = useTypesDispatch();
    const { updateCurrentChat } = chatSlice.actions;

    const { showModal, closeModal } = useContext(ModalContext);

    const router = useRouter();

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

    const handlerStartChat = async () => {
        closeModal();
        setIsChatLoading(true);

        const res = await createChat({
            companionId: task.user,
            taskId: task.id,
        });

        if (res.status === 200) {
            dispatch(updateCurrentChat({ ...res.chat!, messages: [] }));
            router.push(`/chat/${res.chat!.id}`);
        }

        setIsChatLoading(false);
    };

    useEffect(() => {
        if (!daysRef.current) return;

        setDayTitle(getDayTitle(daysRef.current.state.content));
    }, [daysRef.current, task.title]);

    const isTaksHasSolutions =
        task.solutions &&
        task.solutions.length > 0 &&
        task.solutions.filter((i) => i.status === "pending").length > 0;

    return (
        <div
            className={classNames(
                styles.taskCard,
                { [styles.extended]: isTaskPage },
                { [styles.solution]: isSolvingPage },
                { [styles.myTask]: isMyTask },
            )}
        >
            <div className={styles.wrapper}>
                <div className={styles.taskBody}>
                    <div className={styles.taskContent}>
                        {!isMyTask && (
                            <Link
                                href={`/profile/company/${task.user}`}
                                className={styles.companyInfo}
                            >
                                {user.id === task.user ? (
                                    <div className={styles.companyLogo}>
                                        <img
                                            src={
                                                companyProfile?.logoImg
                                                    ? process.env
                                                          .NEXT_PUBLIC_SERVER_PATH +
                                                      companyProfile?.logoImg
                                                    : "/images/avatar.png"
                                            }
                                            alt={task.profile?.companyName}
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                ) : (
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
                                )}

                                <p
                                    className={classNames(
                                        styles.taskTitle,
                                        "title fz28 fw500",
                                    )}
                                >
                                    {task.profile?.companyName}
                                </p>
                            </Link>
                        )}

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
                                {isTaskPage &&
                                    !!task.files.length &&
                                    task.files.map((file, index) => (
                                        <div
                                            key={index}
                                            className={styles.downloadItem}
                                        >
                                            <DownloadItem
                                                extension={file.extension}
                                                name={`${file.name}.${file.extension}`}
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
                        <div className={styles.taskButtons}>
                            {user.role === "student" &&
                                isTaskPage &&
                                (isChatLoading ? (
                                    <Button
                                        type="secondary"
                                        loadingWidth={360}
                                        loading
                                    >
                                        <CustomOval
                                            width={30}
                                            height={30}
                                            color="rgba(var(--white), 1)"
                                            secondaryColor="rgba(var(--gray1), .6)"
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        className={styles.startChat}
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <ConfirmModal
                                                        text={
                                                            <p className="text fz24">
                                                                Вы уверены, что
                                                                хотите начать
                                                                чат по данному
                                                                заданию?
                                                            </p>
                                                        }
                                                        onConfirm={() =>
                                                            handlerStartChat()
                                                        }
                                                        buttonText="Начать чат"
                                                    />
                                                ),
                                            })
                                        }
                                        type="secondary"
                                    >
                                        Задать вопрос по заданию
                                    </Button>
                                ))}
                            {!isTaskPage && (
                                <Link
                                    className={classNames(
                                        styles.showMore,
                                        styles.proposeButton,
                                        "text green fz24 under pointer",
                                    )}
                                    href={`/tasks/${task.id}`}
                                >
                                    <Button type="primary">
                                        Перейти к заданию
                                    </Button>
                                </Link>
                            )}
                            {isTaskPage &&
                                !isSolvingPage &&
                                !isSolutionPage &&
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
                                        <Button type="primary">
                                            {isTaksHasSolutions
                                                ? "Мои решения"
                                                : "Предложить решение"}
                                        </Button>
                                    </Link>
                                ) : (
                                    task.user === user.id &&
                                    task.solutionsCount > 0 && (
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
                                    )
                                ))}
                        </div>
                    </div>
                </div>
                {isSolvingPage && <SolvingLogic taskId={task.id} />}
                {isSolutionsPage && (
                    <SolutionsLogic
                        role={user.role as "student" | "company"}
                        taskId={task.id}
                        studnetSolutions={task.solutions}
                    />
                )}
                {isSolutionPage && <SolutionLogic solutionId={solutionId} />}
            </div>
        </div>
    );
};

export default TaskCard;
