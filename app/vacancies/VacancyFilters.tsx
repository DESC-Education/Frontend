import React from "react";
import styles from "./VacancyFilters.module.scss";

const directions = [
    { label: "Дизайн", value: "design" },
    { label: "Верстка", value: "layout" },
    { label: "Программирование", value: "programming" },
    { label: "Базы данных", value: "databases" },
    { label: "Исследователь", value: "research" },
];

const levels = [
    { label: "Стажер", value: "intern" },
    { label: "Junior", value: "junior" },
    { label: "Middle", value: "middle" },
    { label: "Senior", value: "senior" },
    { label: "Team Lead", value: "lead" },
];

const employments = [
    { label: "Полная занятость", value: "full" },
    { label: "Частичная занятость", value: "part" },
    { label: "Проектная работа", value: "project" },
];

const schedules = [
    { label: "Полный день", value: "day" },
    { label: "Удаленная работа", value: "remote" },
    { label: "Сменный график", value: "shift" },
    { label: "Гибкий график", value: "flexible" },
];

type Props = {
    values: {
        directions: string[];
        levels: string[];
        employments: string[];
        schedules: string[];
    };
    onChange: (section: keyof Props["values"], value: string, checked: boolean) => void;
    onClear: () => void;
};

const VacancyFilters: React.FC<Props> = ({ values, onChange, onClear }) => {
    return (
        <div className={styles.filtersBox}>
            <h3 className={styles.title}>Фильтры</h3>
            <div className={styles.group}>
                <div className={styles.groupTitle}>Направление</div>
                {directions.map((item) => (
                    <React.Fragment key={item.value}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={values.directions.includes(item.value)}
                                onChange={e => onChange("directions", item.value, e.target.checked)}
                            />
                            {item.label}
                        </label>
                        {/* Вложенные уровни для выбранного направления */}
                        {item.value === "programming" && values.directions.includes(item.value) && (
                            <div className={styles.levelsNested}>
                                {levels.map((level) => (
                                    <label key={level.value} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={values.levels.includes(level.value)}
                                            onChange={e => onChange("levels", level.value, e.target.checked)}
                                        />
                                        {level.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className={styles.group}>
                <div className={styles.groupTitle}>Занятость</div>
                {employments.map((item) => (
                    <label key={item.value} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={values.employments.includes(item.value)}
                            onChange={e => onChange("employments", item.value, e.target.checked)}
                        />
                        {item.label}
                    </label>
                ))}
            </div>
            <div className={styles.group}>
                <div className={styles.groupTitle}>График</div>
                {schedules.map((item) => (
                    <label key={item.value} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={values.schedules.includes(item.value)}
                            onChange={e => onChange("schedules", item.value, e.target.checked)}
                        />
                        {item.label}
                    </label>
                ))}
            </div>
            <button className={styles.clearBtn} onClick={onClear}>Очистить</button>
        </div>
    );
};

export default VacancyFilters; 