"use client";

import { useEffect, useState } from "react";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { fetchVacancies } from "@/app/_store/reducers/vacancySlice";
import VacancyCard from "@/app/_components/VacancyCard/VacancyCard";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import classNames from "classnames";
import styles from "./page.module.scss";
import Button from "@/app/_components/ui/Button/Button";

const categories = [
    { value: "web", label: "Веб-разработка" },
    { value: "mobile", label: "Мобильная разработка" },
    { value: "design", label: "Дизайн" },
    { value: "marketing", label: "Маркетинг" },
    { value: "analytics", label: "Аналитика" },
    { value: "pm", label: "Project Management" },
];
const cities = [
    { value: "krasnoyarsk", label: "Красноярск" },
    { value: "moscow", label: "Москва" },
    { value: "spb", label: "Санкт-Петербург" },
];
const experienceLevels = [
    { value: "intern", label: "Стажер" },
    { value: "junior", label: "Junior" },
    { value: "middle", label: "Middle" },
    { value: "senior", label: "Senior" },
];
const employmentTypes = [
    { value: "full_time", label: "Полная занятость" },
    { value: "part_time", label: "Частичная занятость" },
    { value: "remote", label: "Удаленная работа" },
    { value: "hybrid", label: "Гибрид" },
];
const skills = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "react", label: "React" },
    { value: "node", label: "Node.js" },
    { value: "figma", label: "Figma" },
    { value: "python", label: "Python" },
];

const sortOptions = [
    { value: "recommend", label: "Рекомендации" },
    { value: "new", label: "Сначала новые" },
    { value: "salary", label: "По зарплате" },
];

const VacanciesPage = () => {
    const dispatch = useTypesDispatch();
    const { vacancies, isLoading, total, page, limit } = useTypesSelector(
        (state) => state.vacancyReducer
    );

    const [filters, setFilters] = useState({
        category: "",
        location: "",
        experienceLevel: "",
        employmentType: "",
        skills: [] as string[],
    });
    const [sort, setSort] = useState("recommend");

    useEffect(() => {
        dispatch(fetchVacancies({ page: 1, limit: 12, ...filters, sort }));
    }, [dispatch, filters, sort]);

    const handleCheckbox = (key: string, value: string) => {
        if (key === "skills") {
            setFilters((prev) => ({
                ...prev,
                skills: prev.skills.includes(value)
                    ? prev.skills.filter((s) => s !== value)
                    : [...prev.skills, value],
            }));
        } else {
            setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
        }
    };

    return (
        <div className={styles.vacancyPageWrap}>
            <div className={styles.leftCol}>
                <div className={styles.filtersBox}>
                    <div className={styles.filtersTitle}>Фильтры</div>
                    <div className={styles.filterSection}>
                        <div className={styles.filterLabel}>Категория</div>
                        {categories.map((cat) => (
                            <label key={cat.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.category === cat.value}
                                    onChange={() => handleCheckbox("category", cat.value)}
                                />
                                {cat.label}
                            </label>
                        ))}
                    </div>
                    <div className={styles.filterSection}>
                        <div className={styles.filterLabel}>Город</div>
                        {cities.map((city) => (
                            <label key={city.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.location === city.value}
                                    onChange={() => handleCheckbox("location", city.value)}
                                />
                                {city.label}
                            </label>
                        ))}
                    </div>
                    <div className={styles.filterSection}>
                        <div className={styles.filterLabel}>Опыт</div>
                        {experienceLevels.map((exp) => (
                            <label key={exp.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.experienceLevel === exp.value}
                                    onChange={() => handleCheckbox("experienceLevel", exp.value)}
                                />
                                {exp.label}
                            </label>
                        ))}
                    </div>
                    <div className={styles.filterSection}>
                        <div className={styles.filterLabel}>Тип занятости</div>
                        {employmentTypes.map((emp) => (
                            <label key={emp.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.employmentType === emp.value}
                                    onChange={() => handleCheckbox("employmentType", emp.value)}
                                />
                                {emp.label}
                            </label>
                        ))}
                    </div>
                    <div className={styles.filterSection}>
                        <div className={styles.filterLabel}>Навыки</div>
                        {skills.map((skill) => (
                            <label key={skill.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.skills.includes(skill.value)}
                                    onChange={() => handleCheckbox("skills", skill.value)}
                                />
                                {skill.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.rightCol}>
                <div className={styles.topBar}>
                    <div className={styles.vacancyCount}>Вакансии <span className={styles.count}>{total}</span></div>
                    <div className={styles.sortBox}>
                        Сортировка:
                        <select
                            className={styles.sortSelect}
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {isLoading && (
                    <div className={styles.loaderWrap}><CustomOval /></div>
                )}
                <div className={styles.grid}>
                    {vacancies.map((vacancy) => (
                        <VacancyCard key={vacancy.id} vacancy={vacancy} />
                    ))}
                </div>
                {vacancies.length === 0 && !isLoading && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💼</div>
                        <h3 className="title fz24">Вакансии не найдены</h3>
                        <p className="text fz16 gray">Попробуйте изменить фильтры или загляните позже</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VacanciesPage; 