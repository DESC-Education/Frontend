"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import SelectSearch from "react-select-search";
import { createTask, getCategory } from "@/app/_http/API/tasksApi";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import { use, useEffect, useState } from "react";
import { ICategory, IFilter, IFilterCategory } from "@/app/_types";
import { on } from "events";

const maxLength = 2000;
const minLength = 5;

export default function CreateTaskPage() {
    const templates = [
        "Веб-разработка",
        "Мобильная разработка",
        "Искусственный интеллект",
        "Базы данных",
        "Безопасность информации",
    ];

    const { task } = useTypesSelector((state) => state.taskReducer);
    const { updateTask } = taskSlice.actions;

    const dispatch = useTypesDispatch();

    const [textLength, setTextLength] = useState(task.description.length || 0);

    const handleTextChange = (e: string) => {
        if (e.length < maxLength) {
            setTextLength(e.length);
            dispatch(
                updateTask({
                    task: {
                        ...task,
                        description: e,
                    },
                }),
            );
        }
    };

    const [categories, setCategories] = useState<ICategory[]>([]);
    console.log("categories", categories);

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
                console.log("rez", res);
            }
        };

        asyncFunc();
    }, []);

    const [filtersCategory, setFiltersCategory] = useState<IFilterCategory>();

    const validateFormTask = async () => {
        const formData = new FormData();

        formData.append("title", task.name);
        formData.append("description", task.description);
        formData.append("deadline", task.deadline);
        formData.append("categoryId", task.category.id);
        formData.append("filtersId", "3fa85f64-5717-4562-b3fc-2c963f66afa6");

        const res = await createTask(formData);
    };

    console.log("taskcat", task.category.filterCategories);
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
                            value={task.name}
                            onChange={(e) =>
                                dispatch(
                                    updateTask({
                                        task: {
                                            ...task,
                                            name: e,
                                        },
                                    }),
                                )
                            }
                        />
                        <p className="text">О задании</p>
                        <Input
                            type="textarea"
                            placeholder="Опишите что именно вам нужно. Включите в описание важные аспекты."
                            containerClassName={styles.textarea}
                            value={task.description}
                            onChange={handleTextChange}
                            max={maxLength}
                        />
                        <div className={styles.underdescription}>
                            <p className="text gray fz20">Файл</p>
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
                            <div className={styles.select}>
                                <p className="text fw500">Категории</p>
                                <SelectSearch
                                    options={categories}
                                    placeholder="Выберите категорию"
                                    onChange={(e) => {
                                        dispatch(
                                            updateTask({
                                                task: {
                                                    ...task,
                                                    category: categories.find(
                                                        (item) => item.id === e,
                                                    )!,
                                                },
                                            }),
                                        );
                                        // setFiltersCategory(
                                        //     categories.find(
                                        //         (item) => item.id === e,
                                        //     )!.filtersCategories
                                        // );
                                    }}
                                />
                            </div>
                            <div className={styles.select}>
                                <p className="text fw500">Фильтры</p>
                            </div>
                            <div className={styles.select}>
                                <p className="text fw500">Сроки</p>
                                <input
                                    type="date"
                                    className={styles.time}
                                    onChange={(e) => {
                                        dispatch(
                                            updateTask({
                                                task: {
                                                    ...task,
                                                    deadline: e.target.value,
                                                },
                                            }),
                                        );
                                    }}
                                />
                                {/* <SelectSearch
                                    options={[
                                        { value: "1", name: "1 неделя" },
                                        { value: "2", name: "2 недели" },
                                        { value: "3", name: "3 недели" },
                                        { value: "4", name: "4 недели" },
                                        { value: "5", name: "5 недель" },
                                    ]}
                                    placeholder="Выберите сроки"
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
