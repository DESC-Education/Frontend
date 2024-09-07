"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import SelectSearch, { SelectedOptionValue } from "react-select-search";
import { createTask, getCategory } from "@/app/_http/API/tasksApi";
import { use, useEffect, useReducer, useState } from "react";
import { ICategory, IFile, IFilter, IFilterCategory } from "@/app/_types";
import { set } from "zod";
import CustomSearch from "@/app/_components/ui/CustomSearch/CustomSearch";

const maxLength = 2000;
const minLength = 5;

type TaskState = {
    title: string;
    description: string;
    deadline: string;
    file: IFile[];
    categoryId: string;
    filters: {
        [key: string]: string | null;
    };
};

type TaskAction =
    | { type: "change_title"; title: string }
    | { type: "change_description"; description: string }
    | { type: "change_deadline"; deadline: string }
    | { type: "change_file"; file: IFile[] }
    | { type: "change_categoryId"; categoryId: string }
    | { type: "change_filters"; filterCategoryId: string; filterId: string }
    | { type: "clear" };

const initState: TaskState = {
    title: "",
    description: "",
    deadline: "",
    file: [],
    categoryId: "",
    filters: {} as any,
};

export default function CreateTaskPage() {
    const templates = [
        "Веб-разработка",
        "Мобильная разработка",
        "Искусственный интеллект",
        "Базы данных",
        "Безопасность информации",
    ];

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

            // case "change_title_err": {
            //     return {
            //         ...state,
            //         titleErr: action.err,
            //     };
            // }
            // case "change_description_err": {
            //     return {
            //         ...state,
            //         descriptionErr: action.err,
            //     };
            // }
            // case "change_deadline_err": {
            //     return {
            //         ...state,
            //         deadlineErr: action.err,
            //     };
            // }
            // case "change_file_err": {
            //     return {
            //         ...state,
            //         fileErr: action.err,
            //     };
            // }
            // case "change_categoryId_err": {
            //     return {
            //         ...state,
            //         categoryIdErr: action.err,
            //     };
            // }
            // case "change_filters_err": {
            //     return {
            //         ...state,
            //         filtersErr: action.err,
            //     };
            // }

            // case "clear_errors": {
            //     return {
            //         ...state,
            //         titleErr: "",
            //         descriptionErr: "",
            //         deadlineErr: "",
            //         fileErr: "",
            //         categoryIdErr: "",
            //         filtersErr: "",
            //     };
            // }

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

    const [categories, setCategories] = useState<ICategory[]>([]);

    // const getCategories = async () => {
    //     const res = await getCategory("");
    //     if (res.status === 200) {
    //         setCategories(
    //             res.categories!.map((item) => ({
    //                 ...item,
    //                 value: item.id,
    //                 name: item.name,
    //             })),
    //         );
    //     }
    // };

    useEffect(() => {
        const asyncFunc = async () => {
            const res = await getCategory("");
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

        if (state.categoryId === "") {
            errorsTemp.categoryId = "Выберите категорию";
        }
        console.log(state.filters);
        if (Object.keys(state.filters).length < categories.find((item) => item.id === state.categoryId)?.filterCategories?.length!) {
            errorsTemp.filters = "Не все фильтры выбраны";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const formData = new FormData();

            formData.append("title", state.title);
            formData.append("description", state.description);
            formData.append("deadline", state.deadline);
            formData.append("categoryId", state.categoryId);
            Object.values(state.filters).forEach((el, i) => {
                formData.append(`filtersId`, el!);
            });

            files!.forEach((el, i) => {
                // ???????
                formData.append(`file`, el, el.name);
            });


            const res = await createTask(formData);
            console.log("createTask res", res);
        }


    };

    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.taskHeader}>
                <Link href={"/tasks"} className={styles.backButton}>
                    <Image
                        src="/icons/backIcon.svg"
                        width={15}
                        height={15}
                        alt="arrow-left"
                        className={styles.img}
                    />
                    <p className="text green fz20">Вернуться к списку</p>
                </Link>
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
                            />
                        </div>
                        <div className={styles.selects} >
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
                                <p className={classNames("text red fz20", styles.errorText)}>{errors.categoryId}</p>
                            </div>
                            <div className={classNames(styles.select, {[styles.error]: errors.filters})}>
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
                                                        value={state.filters[filter.id]!}
                                                        onChange={(e: any) => {
                                                            taskDispatch({
                                                                type:
                                                                    "change_filters",
                                                                filterCategoryId:
                                                                    filter.id,
                                                                filterId: e,
                                                            });
                                                            console.log(
                                                                "state.filtersId",
                                                                state.filters,
                                                            );
                                                            console.log("e", e);
                                                            console.log(
                                                                "filter.filters",
                                                                filter.filters,
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        )
                                ) : (
                                    <div
                                        className={classNames(
                                            "text fw500",
                                            styles.filterTitle,
                                        )}
                                    >
                                        Выберите категорию
                                    </div>
                                )}
                                <p className={classNames("text red fz20", styles.errorText)}>{errors.filters}</p>
                            </div>
                            <div className={styles.select}>
                                <p className="text fw500">Сроки</p>
                                <input
                                    type="date"
                                    className={styles.time}
                                    onChange={(e) => {
                                        taskDispatch({
                                            type: "change_deadline",
                                            deadline: e.target.value,
                                        });
                                    }}
                                />
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
