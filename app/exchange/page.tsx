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
import { ICompanyProfile, ITask } from "../_types";
import TaskCard from "../_components/TaskCard/TaskCard";

export default function ExchangePage() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([
        "Веб-разработка",
        "Мобильная разработка",
        "Искусственный интеллект",
        "Базы данных",
        "Безопасность информации",
    ]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
        "JavaScript",
        "Python",
        "Java",
        "C++",
        "C#",
    ]);
    const tasks: ITask[] = [
        {
            name: "Заказ1",
            deadline: "10.03.2024",
            description: "asdasd",
            id: "1",
            company: {
                id: "1",
                logoImg: {
                    id: "2",
                    name: "logo1",
                    path: "/images/userImage2.png",
                    type: "png",
                },
                linkToCompany: "",
                description: "",
                phone: "",
                emailVisibility: false,
                phoneVisibility: false,
                timezone: 0,
                city: {
                    id: "1",
                    name: "Moscow",
                    region: "Россия",
                },
                skills: [],
                companyName: "",
                firstName: "",
                lastName: "",
                verification: "verified",
            },
            isVisible: true,
            createdAt: "10.03.2024",
            files: [],
            isSuspicious: false,
            isVerified: true,
        },
    ];

    return (
        <div className="container">
            <h2 className={classNames(styles.exchangeTitle, "title fz48")}>
                Биржа заданий
            </h2>
            <div className={styles.mainContainer}>
                <aside className={styles.sidebar}>
                    <div className={styles.filters}>
                        <h3 className="title">Фильтры</h3>
                        <div className={styles.filterGroup}>
                            <h4 className="text gray fz20">Технологии</h4>
                            {selectedFilters.map((filter, index) => (
                                <label
                                    key={index}
                                    className={styles.filterLabel}
                                >
                                    <Input type="checkbox" />
                                    <p className="text fw500 fz20">{filter}</p>
                                </label>
                            ))}
                        </div>
                        <div className={styles.filterGroup}>
                            <h4 className="text gray fz20">
                                Языки программирования
                            </h4>
                            {selectedLanguages.map((language, index) => (
                                <label
                                    key={index}
                                    className={styles.filterLabel}
                                >
                                    <Input type="checkbox" />
                                    <p className="text fw500 fz20">
                                        {language}
                                    </p>
                                </label>
                            ))}
                        </div>
                        <div className={styles.buttons}>
                            <Button
                                type="secondary"
                                className={styles.applyButton}
                            >
                                Применить
                            </Button>
                            <Button
                                type="primary"
                                className={styles.clearButton}
                            >
                                Очистить
                            </Button>
                        </div>
                    </div>
                </aside>
                <main className={styles.mainContent}>
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
                </main>
            </div>
        </div>
    );
}
