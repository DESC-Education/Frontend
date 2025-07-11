import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Input from "../_components/ui/Input/Input";
import Button from "../_components/ui/Button/Button";
import classNames from "classnames";

type FilterState = {
    categories: string[];
    directions: string[];
    levels: string[];
    employments: string[];
    schedules: string[];
};

const categories = [
    { label: "Искусственный интеллект", value: "ai" },
    { label: "Мобильная разработка", value: "mobile" },
    { label: "Серверная разработка", value: "server" },
    { label: "Анимация", value: "animation" },
    { label: "Дизайн", value: "design" },
    { label: "Веб-разработка", value: "web" },
];

type Props = {
    values: {
        categories: string[];
    };
    onChange: (section: keyof FilterState, value: string, checked: boolean) => void;
    onClear: () => void;
};

const VacancyFilters: React.FC<Props> = ({ values = { categories: [] }, onChange, onClear }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={isMobile ? styles.filtersMenu : styles.sidebar}>
            <div className={styles.filters}>
                <div className={styles.filtersHeader}>
                    <h3 className="title fz28 fw500">Фильтры</h3>
                    {isMobile && (
                        <div
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                        ></div>
                    )}
                </div>
                <div className={styles.filterGroup}>
                    <p className={classNames("text gray fz20", styles.filterTitle)}>
                        Категории
                    </p>
                    {categories.map((item, index) => (
                        <label key={index} className={styles.filterLabel}>
                            <Input
                                type="checkbox"
                                checked={values.categories.includes(item.value)}
                                onCheck={(e) => onChange("categories", item.value, e)}
                            />
                            <p className="text fw500 fz20">{item.label}</p>
                        </label>
                    ))}
                </div>
                <p className={classNames("text center fz20", styles.selectText)}>
                    Выберите категорию
                </p>
                <div className={styles.buttons}>
                    <Button
                        type="secondary"
                        onClick={() => {}}
                        className={styles.applyButton}
                    >
                        Применить
                    </Button>
                    <Button
                        type="primary"
                        className={styles.clearButton}
                        onClick={onClear}
                    >
                        Очистить
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VacancyFilters;