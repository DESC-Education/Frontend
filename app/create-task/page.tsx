"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import SelectSearch, { SelectedOptionValue } from "react-select-search";
import { createTask, getCategories } from "@/app/_http/API/tasksApi";
import { use, useContext, useEffect, useReducer, useState } from "react";
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

const maxLength = 2000;
const minLength = 5;

function addDaysAndFormat(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, "0");
    const day = String(result.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

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

    const reduser = (state: TaskState, action: TaskAction): TaskState => {
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

    const [state, taskDispatch] = useReducer(reduser, initState);

    const [textLength, setTextLength] = useState(state.description.length || 0);

    const handleTextChange = (e: string) => {
        if (e.length < maxLength) {
            setTextLength(e.length);
            taskDispatch({
                type: "change_description",
                description: e,
            });
        }
    };

    const [patterns, setPatterns] = useState<TaskState[]>([]);

    const [categories, setCategories] = useState<ICategory[]>([]);

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
        
        if (state.description.length < minLength) {
            errorsTemp.description = "Введите описание задания (" + minLength + " символов или больше)";
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
                setFiles([]);
            } else {
                showAlert(res.message);
            }
        }
    };

    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.taskHeader}>
                <BackButton title="Назад" />
                <p className="title">Создать задание</p>
            </div>
            <div className={styles.taskContent}>
                <div className={styles.templates}>
                    <p className="text fw500">Шаблоны технических заданий</p>
                    {templates.map((template, index) => (
                        <Button
                            key={index}
                            type="primary"
                            className={styles.templateButton}
                        >
                            {template}
                        </Button>
                    ))}
                </div>
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
                            max={maxLength}
                        />
                        <div className={styles.underdescription}>
                            <p
                                className={classNames(
                                    "text gray fz20",
                                    styles.length,
                                )}
                            >
                                {textLength} из {maxLength} символов (минимум{" "}
                                {minLength})
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
                                <p className="text fw500">Категории</p>
                                <SelectSearch
                                    options={categories}
                                    onChange={(e) => {
                                        taskDispatch({
                                            type: "change_categoryId",
                                            categoryId: categories.find(
                                                (item) => item.id === e,
                                            )?.id!,
                                        });
                                    }}
                                    value={state.categoryId}
                                    placeholder="Выберите категорию"
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
                                <p className={"text fw500"}>Фильтры</p>
                                {categories?.find(
                                    (item) => item.id === state.categoryId,
                                )?.filterCategories ? (
                                    categories
                                        .find(
                                            (item) =>
                                                item.id === state.categoryId,
                                        )
                                        ?.filterCategories.map(
                                            (filter, index) => (
                                                <div
                                                    className={styles.filters}
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
                                                    <SelectSearch
                                                        key={index}
                                                        options={filter.filters.map(
                                                            (i) => ({
                                                                ...i,
                                                                value: i.id,
                                                            }),
                                                        )}
                                                        placeholder="Выберите фильтр"
                                                        value={
                                                            state.filters[
                                                                filter.id
                                                            ]!
                                                        }
                                                        onChange={(e: any) => {
                                                            taskDispatch({
                                                                type:
                                                                    "change_filters",
                                                                filterCategoryId:
                                                                    filter.id,
                                                                filterId: e,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        )
                                ) : (
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
                                <p className="text fw500">Сроки</p>
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
                                {/* <input
                                    type="date"
                                    className={styles.time}
                                    onChange={(e) => {
                                        taskDispatch({
                                            type: "change_deadline",
                                            deadline: e.target.value,
                                        });
                                    }}
                                /> */}
                            </div>
                        </div>
                        <div className={styles.submitButtons}>
                            <Button
                                type="secondary"
                                className={styles.submitButton}
                            >
                                Демо
                            </Button>
                            <Button
                                type="primary"
                                className={styles.submitButton}
                                disabled={true}
                            >
                                Сохранить как PDF
                            </Button>
                            <Button
                                type="primary"
                                className={styles.submitButton}
                                onClick={() => validateFormTask()}
                                disabled={textLength < minLength}
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
