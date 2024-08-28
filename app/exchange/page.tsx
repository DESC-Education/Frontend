"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Button from "../_components/ui/Button/Button";
import Input from "../_components/ui/Input/Input";
import Select from "../_components/ui/Select/Select";
import SelectSearch from "react-select-search";
import OrderCard from "../_components/OrderCard/OrderCard";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import classNames from "classnames";
import Header from "../_components/Header/Header";
import { ICompanyProfile } from "../_types";

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
    const orders = [
        {
            title: "Заказ1",
            description:
                "Описание заказа на Flutter и Firebase но с примерами в обоих языках и еще технических документах",
            deadline: "10.03.2024",
            reminingTime: "2 дня",
            company: {
                isVerified: true,
                name: "Компания1",
                logoImg: {
                    id: "1",
                    name: "logo1",
                    path: "/images/userImage1.png",
                    type: "image/png",
                },
            } as ICompanyProfile,
            isViewed: false,
        },
        {
            title: "Заказ2",
            description: "Описание заказа",
            deadline: "10.03.2024",
            reminingTime: "2 дня",
            company: {
                isVerified: true,
                name: "Компания2",
                logoImg: {
                    id: "2",
                    name: "logo2",
                    path: "/images/userImage2.png",
                    type: "image/png",
                },
            } as ICompanyProfile,
            isViewed: true,
        },
        {
            title: "Заказ3",
            description: "Описание заказа",
            deadline: "10.03.2024",
            reminingTime: "2 дня",
            company: {
                isVerified: true,
                name: "Компания3",
                logoImg: {
                    id: "3",
                    name: "logo3",
                    path: "/images/userImage3.png",
                    type: "image/png",
                },
            } as ICompanyProfile,
            isViewed: false,
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
                                <label key={index} className={styles.filterLabel}>
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
                                <label key={index} className={styles.filterLabel}>
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
                        {orders.map((order, index) => (
                            <OrderCard
                                key={index}
                                title={order.title}
                                description={order.description}
                                deadline={order.deadline}
                                reminingTime={order.reminingTime}
                                company={order.company}
                                isViewed={order.isViewed}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
