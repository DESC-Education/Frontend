import styles from "./TaskCard.module.scss";
import Image from "next/image";
import classNames from "classnames";
import Button from "../ui/Button/Button";
import { ITask } from "@/app/_types";
import { getRemainingTime } from "@/app/_utils/time";

type TaskCardProps = {
    task: ITask;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <div className={styles.taskCard}>
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
                                src={task.company.logoImg.path}
                                alt={task.company.companyName}
                                width={60}
                                height={60}
                            />
                        </div>
                        <h4 className={classNames(styles.taskTitle, "title")}>
                            {task.company.companyName}
                        </h4>
                    </div>
                    <div className={styles.taskDescription}>
                        <div className={classNames(styles.taskName, "title")}>
                            {task.name}
                        </div>
                        <div className="text">
                            <p className={styles.description}>
                                {task.description}
                            </p>
                            <span
                                className={classNames(
                                    styles.showMore,
                                    "text gray fz24 under pointer",
                                )}
                            >
                                Показать полностью
                            </span>
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
                            Срок выполнения: {task.deadline}
                        </span>
                        <span
                            className={classNames(
                                styles.timeLeft,
                                "text fw500 fz20",
                            )}
                        >
                            осталось {getRemainingTime(task.deadline)}
                        </span>
                    </div>
                    <Button type="secondary" className={styles.proposeButton}>
                        Предложить решение
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
