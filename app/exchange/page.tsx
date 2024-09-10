"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Button from "../_components/ui/Button/Button";
import Input from "../_components/ui/Input/Input";
import SelectSearch from "react-select-search";
import OrderCard from "../_components/TaskCard/TaskCard";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import classNames from "classnames";
import Header from "../_components/Header/Header";
import { ICategory, ICompanyProfile, ITask } from "../_types";
import TaskCard from "../_components/TaskCard/TaskCard";
import CustomOval from "../_components/ui/CustomOval/CustomOval";
import { getTasks } from "../_http/API/tasksApi";

export default function ExchangePage() {
    const { tasks, categories } = useTypesSelector(
        (state) => state.taskReducer,
    );

    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
        null,
    );
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string[];
    }>({});
    // const selectedCategory = null

    // const tasks: ITask[] = [
    //     {
    //         name: "Заказ1",
    //         deadline: "10.03.2024",
    //         description: "asdasd",
    //         id: "1",
    //         company: {
    //             id: "1",
    //             logoImg: "/images/userImage2.png",
    //             linkToCompany: "",
    //             description: "",
    //             phone: "",
    //             emailVisibility: false,
    //             phoneVisibility: false,
    //             timezone: 0,
    //             city: {
    //                 id: "1",
    //                 name: "Moscow",
    //                 region: "Россия",
    //             },
    //             skills: [],
    //             companyName: "",
    //             firstName: "",
    //             lastName: "",
    //             verification: { status: "verified" },
    //             leadTaskCategories: [],
    //             telegramLink: "",
    //             vkLink: "",
    //         },
    //         category: {
    //             id: "1",
    //             name: "Категория1",
    //             value: "sadads",
    //             filterCategories: [
    //                 {
    //                     id: "1",
    //                     name: "Категория1",
    //                     filters: [
    //                         { id: "1", name: "Фильтр1" },
    //                         { id: "1", name: "Фильтр2" },
    //                     ],
    //                 },
    //             ],
    //         },
    //         filtersId: [],
    //         isVisible: true,
    //         createdAt: "10.03.2024",
    //         files: [],
    //         isSuspicious: false,
    //         isVerified: true,
    //     },
    // ];

    const handleSelectFilter = (filterCategoryId: string, filterId: string, checked: boolean) => {
        if (checked) {
            setSelectedFilters((prev) => ({
                ...prev,
                [filterCategoryId]: [...(prev[filterCategoryId] || []), filterId],
            }));
        } else {
            setSelectedFilters((prev) => ({
                ...prev,
                [filterCategoryId]: (prev[filterCategoryId] || []).filter(
                    (item) => item !== filterId,
                ),
            }));
        }
    };

    const getTasksByFiltersAndSort = async () => {
        // console.log(Object.keys(selectedFilters).map((key) => selectedFilters[key]).flat());
        
        // const tasks = tasks.filter((task) => {
        const tasks = await getTasks(1, 10, selectedCategory?.id, Object.keys(selectedFilters).map((key) => selectedFilters[key]).flat(), "createdAt"); 
        console.log("tasks", tasks);
        // return tasks;
    }

    if (!tasks || !categories)
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div className="container">
            <h2 className={classNames(styles.exchangeTitle, "title fz48")}>
                Биржа заданий
            </h2>
            <button
                onClick={() => console.log(selectedCategory, selectedFilters)}
            >
                test
            </button>
            <div className={styles.mainContainer}>
                <aside className={styles.sidebar}>
                    <div className={styles.filters}>
                        <h3 className="title">Фильтры</h3>
                        <div className={styles.filterGroup}>
                            <p
                                className={classNames(
                                    "text gray fz20",
                                    styles.filterTitle,
                                )}
                            >
                                Категории
                            </p>
                            {categories?.map((category, index) => (
                                <label
                                    key={index}
                                    className={styles.filterLabel}
                                >
                                    <Input
                                        type="checkbox"
                                        checked={
                                            selectedCategory?.id === category.id
                                        }
                                        onCheck={(e) =>
                                            setSelectedCategory(
                                                categories.find(
                                                    (item) =>
                                                        item.id === category.id,
                                                )!,
                                            )
                                        }
                                    />
                                    <p className="text fw500 fz20">
                                        {category.name}
                                    </p>
                                </label>
                            ))}
                        </div>
                        {selectedCategory ? (
                            selectedCategory.filterCategories.map(
                                (filterCategory, catIndex) => (
                                    <div
                                        key={catIndex}
                                        className={styles.filterGroup}
                                    >
                                        <h4 className="text gray fz20">
                                            {filterCategory.name}
                                        </h4>
                                        {filterCategory.filters.map(
                                            (filter, filIndex) => (
                                                <label
                                                    key={filIndex}
                                                    className={
                                                        styles.filterLabel
                                                    }
                                                >
                                                    <Input
                                                        type="checkbox"
                                                        onCheck={(e) => handleSelectFilter(filterCategory.id, filter.id, e)}
                                                        checked={selectedFilters[
                                                            filterCategory.id
                                                        ]?.includes(filter.id)}
                                                    />
                                                    <p className="text fw500 fz20">
                                                        {filter.name}
                                                    </p>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                ),
                            )
                        ) : (
                            <p
                                className={classNames(
                                    "text center fz20",
                                    styles.selectText,
                                )}
                            >
                                Выберите категорию
                            </p>
                        )}
                        <div className={styles.buttons}>
                            <Button
                                type="secondary"
                                onClick={() => getTasksByFiltersAndSort()}
                                className={styles.applyButton}
                            >
                                Применить
                            </Button>
                            <Button
                                type="primary"
                                className={styles.clearButton}
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedFilters({});
                                }}
                            >
                                Очистить
                            </Button>
                        </div>
                    </div>
                </aside>
                {/* <main className={styles.mainContent}>
                    <div className={styles.topPanel}>
                        <div className={styles.sorting}>
                            <span className="title">Сортировка:</span>
                            <SelectSearch
                                options={[
                                    {
                                        value: "Рекомендации",
                                        name: "Рекомендации",
                                    },
                                    {
                                        value: "Популярность",
                                        name: "Популярность",
                                    },
                                    {
                                        value: "Дата подачи",
                                        name: "Дата подачи",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className={styles.taskList}>
                        {tasks.map((task, index) => (
                            <TaskCard key={index} task={task} />
                        ))}
                    </div>
                </main> */}
            </div>
        </div>
    );
}
