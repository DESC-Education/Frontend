import styles from "./SolvingLogic.module.scss";
import classNames from "classnames";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { FC, useContext, useEffect, useState } from "react";
import { IFile } from "@/app/_types";
import { createSolvingTask } from "@/app/_http/API/tasksApi";
import { AlertContext } from "@/app/_context/AlertContext";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";

const MAX_LENGTH = 2000;
const MIN_LENGTH = 50;

type SolvingLogicProps = {
    taskId: string;
};

const SolvingLogic: FC<SolvingLogicProps> = ({ taskId }) => {
    const [solutionFiles, setSolutionFiles] = useState<IFile[]>([]);
    const [solutionText, setSolutionText] = useState<string>("");
    const [textLength, setTextLength] = useState(solutionText.length || 0);

    const { replyCount } = useTypesSelector((state) => state.contentReducer);

    const { updateReplyCount } = contentSlice.actions;

    const { addCurrentTaskSolution } = taskSlice.actions;
    const dispatch = useTypesDispatch();

    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        setTextLength(solutionText.length);
    }, [solutionText]);

    const handleCreateSolution = async () => {
        const formdata = new FormData();

        solutionFiles.forEach((el: any, i) => {
            formdata.append(`files_list`, el, el.name);
        });
        formdata.append("description", solutionText);
        formdata.append("taskId", taskId);

        const res = await createSolvingTask(formdata);

        if (res.status === 200) {
            showAlert("Решение успешно загружено!", "success");
            dispatch(updateReplyCount(replyCount - 1));
            setSolutionText("");
            dispatch(addCurrentTaskSolution(res.solution!));
            setSolutionFiles([]);
        } else {
            showAlert(res.message);
        }
    };

    return (
        <div className={styles.solutionContent}>
            <div className={classNames(styles.solutionTitle, "title fz28")}>
                Предложить решение
            </div>
            <div className={styles.solutionDescription}>
                <p className="text fz20">
                    1. Укажите, как именно вы собираетесь выполнять это задание.
                    Опишите ключевые моменты.
                </p>
                <p className="text fz20">
                    2. Составляйте уникальные отклики, которые покажут вашу
                    компетентность и заинтересованность в проекте
                </p>
                <p className="text fz20">
                    3. Портфолио автоматически будет подгружено к отклику.
                </p>
                <p className="text fz20">
                    Пройдите урок по работе на Бирже, научитесь писать продающие
                    отклики и увеличьте свои шансы на получение заказа!
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
                    <p className={classNames("text gray fz20", styles.length)}>
                        {textLength} из {MAX_LENGTH} символов (минимум{" "}
                        {MIN_LENGTH})
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
                disabled={solutionText.length < MIN_LENGTH}
                type="secondary"
                className={styles.applyButton}
            >
                Предложить решение
            </Button>
        </div>
    );
};

export default SolvingLogic;
