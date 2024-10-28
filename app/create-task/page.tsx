"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import "./page.scss";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import SelectSearch, { SelectedOptionValue } from "react-select-search";
import { createTask, getCategories } from "@/app/_http/API/tasksApi";
import {
    createRef,
    use,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";
import {
    ICategory,
    IFile,
    IFilter,
    IFilterCategory,
    ITask,
} from "@/app/_types";
import { set } from "zod";
import CustomSearch from "@/app/_components/ui/CustomSearch/CustomSearch";
import { AlertContext } from "@/app/_context/AlertContext";
import BackButton from "../_components/ui/BackButton/BackButton";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { contentSlice } from "../_store/reducers/contentSlice";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ModalContext } from "../_context/ModalContext";
import TaskCard from "../_components/TaskCard/TaskCard";
import DemoTaskCard from "../_components/DemoTaskCard/DemoTaskCard";
import { addDaysAndFormat } from "../_utils/time";
import { MAX_LENGTH, MIN_LENGTH } from "../_utils/constants";

type TaskState = {
    title: string;
    description: string;
    deadline: number;
    file: IFile[];
    categoryId: string;
    filters: {
        [key: string]: string | null;
    };
};

type TaskAction =
    | { type: "change_title"; title: string }
    | { type: "change_description"; description: string }
    | { type: "change_deadline"; deadline: number }
    | { type: "change_file"; file: IFile[] }
    | { type: "change_categoryId"; categoryId: string }
    | { type: "change_filters"; filterCategoryId: string; filterId: string }
    | { type: "clear" };

const initState: TaskState = {
    title: "",
    description: "",
    deadline: 0,
    file: [],
    categoryId: "",
    filters: {} as any,
};

export default function CreateTaskPage() {
    const { showAlert } = useContext(AlertContext);
    const { showModal } = useContext(ModalContext);

    const { companyProfile, user } = useTypesSelector(
        (state) => state.userReducer,
    );

    const { myTasks } = useTypesSelector((state) => state.contentReducer);
    const { updateMyTasks } = contentSlice.actions;

    const dispatch = useTypesDispatch();

    const templates = [
        "Веб-разработка",
        "Мобильная разработка",
        "Искусственный интеллект",
        "Базы данных",
        "Безопасность информации",
    ];

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

    const reducer = (state: TaskState, action: TaskAction): TaskState => {
        switch (action.type) {
            case "change_title": {
                return {
                    ...state,
                    title: action.title,
                };
            }
            case "change_description": {
                return {
                    ...state,
                    description: action.description,
                };
            }
            case "change_deadline": {
                return {
                    ...state,
                    deadline: action.deadline,
                };
            }
            case "change_file": {
                return {
                    ...state,
                    file: action.file,
                };
            }
            case "change_categoryId": {
                return {
                    ...state,
                    categoryId: action.categoryId,
                };
            }
            case "change_filters": {
                return {
                    ...state,
                    filters: {
                        ...state.filters,
                        [action.filterCategoryId]: action.filterId,
                    },
                };
            }

            case "clear": {
                return {
                    ...initState,
                };
            }
        }
    };

    const [state, taskDispatch] = useReducer(reducer, initState);

    const handleTextChange = (e: string) => {
        if (e.length < MAX_LENGTH) {
            taskDispatch({
                type: "change_description",
                description: e,
            });
        }
    };

    const [patterns, setPatterns] = useState<TaskState[]>([]);

    const [categories, setCategories] = useState<ICategory[]>([]);

    const [currActiveCategoryId, setCurrActiveCategoryId] = useState("");

    useEffect(() => {
        const asyncFunc = async () => {
            const res = await getCategories("");
            if (res.status === 200) {
                setCategories(
                    res.categories!.map((item) => ({
                        ...item,
                        value: item.id,
                        name: item.name,
                    })),
                );
            }
        };

        asyncFunc();
    }, []);

    const [files, setFiles] = useState<IFile[]>([]);

    const [errors, setErrors] = useState<any>({});
    const [errorsExist, setErrorsExist] = useState<boolean>(false);

    useEffect(() => {
        setErrors({});
        setErrorsExist(false);
    }, [state]);

    const validateFormTask = async () => {
        const errorsTemp: any = {};
        if (state.title.length < 2) {
            errorsTemp.title = "Введите название задания";
        }

        if (state.description.length < MIN_LENGTH) {
            errorsTemp.description =
                "Введите описание задания (" +
                MIN_LENGTH +
                " символов или больше)";
        }

        if (state.categoryId === "") {
            errorsTemp.categoryId = "Выберите категорию";
        }

        if (state.deadline <= 0 || state.deadline > 100) {
            errorsTemp.deadline = "Введите действительное число между 1 и 100";
        }

        if (
            Object.keys(state.filters).length <
            categories.find((item) => item.id === state.categoryId)
                ?.filterCategories?.length!
        ) {
            errorsTemp.filters = "Не все фильтры выбраны";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const formData = new FormData();

            const dedlineAsDate = addDaysAndFormat(new Date(), state.deadline);
            formData.append("title", state.title);
            formData.append("description", state.description);
            formData.append("deadline", `${dedlineAsDate}`);
            formData.append("categoryId", state.categoryId);
            Object.values(state.filters).forEach((el, i) => {
                formData.append(`filtersId`, el!);
            });

            files!.forEach((el: any, i) => {
                // ???????
                formData.append(`files_list`, el, el.name);
            });

            const res = await createTask(formData);

            if (res.status === 200) {
                showAlert("Задание успешно создано!", "success");
                taskDispatch({
                    type: "clear",
                });
                dispatch(
                    updateMyTasks(
                        myTasks ? [...myTasks, res.task!] : [res.task!],
                    ),
                );
                setFiles([]);
            } else {
                showAlert(res.message);
            }
        }
    };

    const currentFilterCategories = useMemo(() => {
        if (!state.categoryId) return [];
        return categories?.find((item) => item.id === state.categoryId)!
            .filterCategories;
    }, [state.categoryId]);

    // const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.taskHeader}>
                <BackButton title="Назад" />
                <p className="title fz36 fw500">Создать задание</p>
            </div>
            <div className={styles.taskContent}>
                {/* <div className={styles.templates}>
                    <p className="text fw500">Шаблоны технических заданий</p>
                    {templates.map((template, index) => (
                        <Button
                            key={index}
                            type="primary"
                            className={classNames(
                                styles.templateButton,
                                "text fz20",
                            )}
                        >
                            {template}
                        </Button>
                    ))}
                </div> */}
                <div className={styles.createTask}>
                    <p className="text fw500">Опишите, что нужно сделать</p>
                    <p className="text gray fz20">
                        Разместите свою задачу на платформе. Ваша задача станет
                        видимой для тысячи студентов, и некоторые
                        из них откликнуться на ваше задание уже с готовым
                        решением. Изучите их решения и выберите лучших из них.
                        Подтвердите заказ, когда будете удовлетворены
                        результатом на 100% и оставьте рецензию на их решение.
                    </p>
                    <div className={styles.taskForm}>
                        <p className="text">Название задания</p>
                        <Input
                            type="text"
                            placeholder="Название должно привлечь внимание и отразить суть задачи."
                            containerClassName={styles.textName}
                            value={state.title}
                            onChange={(e) =>
                                taskDispatch({
                                    type: "change_title",
                                    title: e,
                                })
                            }
                            errorText={errors.title}
                        />
                        <p className="text">О задании</p>
                        <Input
                            type="textarea"
                            placeholder="Опишите что именно вам нужно. Включите в описание важные аспекты."
                            containerClassName={styles.textarea}
                            value={state.description}
                            errorText={errors.description}
                            onChange={handleTextChange}
                            max={MAX_LENGTH}
                        />
                        <div className={styles.underdescription}>
                            <p
                                className={classNames(
                                    "text gray fz20",
                                    styles.length,
                                )}
                            >
                                {state.description.length} из {MAX_LENGTH}{" "}
                                символов (минимум {MIN_LENGTH})
                            </p>
                        </div>
                        <div className={styles.selects}>
                            <Input
                                accept="application/pdf, application/msword, .docx, image/png, image/jpeg, image/jpg"
                                type="file_multiple"
                                maxFiles={5}
                                multiple
                                containerClassName={styles.file}
                                setFile={setFiles}
                                file={files}
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
                            />
                        </div>
                        <div className={styles.selects}>
                            <div className={styles.select}>
                                <p
                                    className={classNames(
                                        "text fw500 fz28",
                                        styles.catTitle,
                                    )}
                                >
                                    Категории
                                </p>
                                <CustomSearch
                                    className={styles.selectSearch}
                                    options={categories.map((i) => ({
                                        ...i,
                                        label: i.name,
                                        value: i.value,
                                    }))}
                                    onChange={(e) => {
                                        taskDispatch({
                                            type: "change_categoryId",
                                            categoryId: categories.find(
                                                (item) => item.id === e.value,
                                            )?.id!,
                                        });
                                    }}
                                    placeholder="Выберите категорию"
                                    search
                                />
                                <p
                                    className={classNames(
                                        "text red fz20",
                                        styles.errorText,
                                    )}
                                >
                                    {errors.categoryId}
                                </p>
                            </div>
                            <div
                                className={classNames(styles.select, {
                                    [styles.error]: errors.filters,
                                })}
                            >
                                <p
                                    className={classNames(
                                        "text fz28 fw500",
                                        styles.catTitle,
                                    )}
                                >
                                    Фильтры
                                </p>
                                <TransitionGroup>
                                    {currentFilterCategories.map(
                                        (filter, index) => (
                                            <CSSTransition
                                                key={filter.id}
                                                timeout={500}
                                                classNames="filterCategories"
                                            >
                                                <div
                                                    className={classNames(
                                                        styles.filterContainer,
                                                        {
                                                            [styles.active]:
                                                                currActiveCategoryId ===
                                                                filter.id,
                                                        },
                                                    )}
                                                    key={index}
                                                >
                                                    <p
                                                        className={classNames(
                                                            "text fw500",
                                                            styles.filterTitle,
                                                        )}
                                                    >
                                                        {filter.name}
                                                    </p>
                                                    <CustomSearch
                                                        className={classNames(
                                                            styles.filter,
                                                        )}
                                                        onFocus={() => {
                                                            setCurrActiveCategoryId(
                                                                filter.id,
                                                            );
                                                        }}
                                                        options={filter.filters.map(
                                                            (i) => ({
                                                                ...i,
                                                                label: i.name,
                                                                value: i.id,
                                                            }),
                                                        )}
                                                        onChange={(e: any) => {
                                                            taskDispatch({
                                                                type:
                                                                    "change_filters",
                                                                filterCategoryId:
                                                                    filter.id,
                                                                filterId: e.id,
                                                            });
                                                        }}
                                                        placeholder="Выберите фильтр"
                                                        search
                                                    />
                                                </div>
                                            </CSSTransition>
                                        ),
                                    )}
                                </TransitionGroup>
                                {!currentFilterCategories.length && (
                                    <div
                                        className={classNames(
                                            "text gray",
                                            styles.filterTitle,
                                        )}
                                    >
                                        Сначала выберите категорию
                                    </div>
                                )}
                                <p
                                    className={classNames(
                                        "text red fz20",
                                        styles.errorText,
                                    )}
                                >
                                    {errors.filters}
                                </p>
                            </div>
                            <div className={styles.select}>
                                <p
                                    className={classNames(
                                        "text fw500 fz28",
                                        styles.deadlineTitle,
                                    )}
                                >
                                    Сроки
                                </p>
                                <div className={styles.deadline}>
                                    <Input
                                        containerClassName={
                                            styles.deadlineInput
                                        }
                                        type="number"
                                        placeholder="Количество дней"
                                        value={String(state.deadline)}
                                        onChange={(e) =>
                                            taskDispatch({
                                                type: "change_deadline",
                                                deadline: Number(e),
                                            })
                                        }
                                        errorText={errors.deadline}
                                    />
                                    <p className="text">
                                        {getDayTitle(state.deadline)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.submitButtons}>
                            <Button
                                onClick={() =>
                                    showModal({
                                        content: (
                                            <DemoTaskCard
                                                task={{
                                                    companyProfile: {
                                                        ...companyProfile,
                                                        id: user.id,
                                                    },
                                                    title: state.title,
                                                    createdAt: new Date().toISOString(),
                                                    description:
                                                        state.description,
                                                    deadline: addDaysAndFormat(
                                                        new Date(),
                                                        state.deadline,
                                                    ),
                                                }}
                                                files={files.map((i) => ({
                                                    ...i,
                                                    name: i.name,
                                                    extension: `${i.name
                                                        .split(".")
                                                        .at(-1)}`,
                                                }))}
                                            />
                                        ),
                                    })
                                }
                                type="secondary"
                                className={styles.submitButton}
                                disabled={
                                    state.title.length < 2 ||
                                    state.description.length < MIN_LENGTH ||
                                    state.deadline < 2
                                }
                            >
                                Демо
                            </Button>
                            {/* <Button
                                type="primary"
                                className={styles.submitButton}
                                disabled={true}
                            >
                                Сохранить как PDF
                            </Button> */}
                            <Button
                                type="primary"
                                className={styles.submitButton}
                                onClick={() => validateFormTask()}
                                disabled={
                                    state.title.length < 2 ||
                                    state.description.length < MIN_LENGTH ||
                                    state.deadline < 2
                                }
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
