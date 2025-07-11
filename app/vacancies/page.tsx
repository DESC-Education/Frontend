"use client";

<<<<<<< HEAD
import { useState } from "react";
import styles from "./page.module.scss";
import classNames from "classnames";
import Button from "../_components/ui/Button/Button";
import CustomSearch from "../_components/ui/CustomSearch/CustomSearch";
import VacancyFilters from "./VacancyFilters";
import VacancySort from "./VacancySort";
import React from "react";
import { useRouter } from "next/navigation";

// Моковые данные вакансий
const mockVacancies = [
    {
        id: "1",
        title: "Верстальщик сайтов",
        company: "IT компания",
        location: "Москва",
        salary: "20 000 - 50 000 руб.",
        postedDate: "2 мая 2024",
        tags: [
            "Полная занятость",
            "Джуниор",
            "Без опыта",
            "Удалённо"
        ]
    },
    {
        id: "2",
        title: "Backend Developer (Python)",
        company: "DataSoft",
        location: "Санкт-Петербург",
        salary: "150,000 - 220,000 ₽",
        postedDate: "1 день назад",
        tags: [
            "Полная занятость",
            "Джуниор",
            "Без опыта",
            "Удалённо"
        ]
    }
];

// Моковые данные для детальной страницы вакансии
export const mockVacancyDetails = {
    id: "1",
    title: "Верстальщик сайтов",
    company: "IT компания",
    location: "Москва, ул. Мира, 17",
    salary: "20 000 - 50 000 руб.",
    postedDate: "2 мая 2024",
    description: `Redis — это key-value хранилище. Если провести аналогию с привычными типами — словарь, который отлично подходит для хранения кэша. Удобно использовать для межкомпонентного взаимодействия.`,
    requirements: [
        "Key-value хранилище. Если провести аналогию с привычными типами — словарь, который отлично подходит для хранения кэша. Удобно использовать для межкомпонентного взаимодействия.",
        "Хранение JSON-документов, то такой же аналог — и можно больше. Отлично подходит, если где-то генерируется большое количество данных, которые не хочется терять."
    ],
    conditions: [
        "Key-value хранилище.",
        "Хранение JSON-документов."
    ],
    skills: ["Figma", "Adobe Illustrator", "Photoshop", "Анимация"],
    tags: ["Полная занятость", "Джуниор", "Без опыта", "Удалённо"],
};

const initialFilterState = {
    directions: [],
    levels: [],
    employments: [],
    schedules: [],
};

const sortOptions = [
    { label: "Рекомендации", value: "recommend" },
    { label: "Сначала новые", value: "new" },
    { label: "Сначала старые", value: "old" },
    { label: "По зарплате (убыв.)", value: "salary_desc" },
    { label: "По зарплате (возр.)", value: "salary_asc" },
];

export default function VacanciesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState(initialFilterState);
    const [sort, setSort] = useState("recommend");
    const [filteredVacancies, setFilteredVacancies] = useState(mockVacancies);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (
        section: keyof typeof initialFilterState,
        value: string,
        checked: boolean
    ) => {
        setFilters((prev) => {
            const arr = prev[section];
            return {
                ...prev,
                [section]: checked
                    ? [...arr, value]
                    : arr.filter((v: string) => v !== value),
            };
        });
    };

    const handleClearFilters = () => {
        setFilters(initialFilterState);
    };

    // Фильтрация и сортировка по моковым данным
    React.useEffect(() => {
        let filtered = mockVacancies.filter((vacancy) => {
            // Поиск
            const matchesSearch =
                !searchQuery ||
                vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vacancy.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vacancy.tags?.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                );
            // Фильтры
            const matchesDirection =
                filters.directions.length === 0 ||
                filters.directions.some((dir) => {
                    // Примитивное сопоставление по ключевым словам
                    if (dir === "design") return vacancy.title.toLowerCase().includes("design") || vacancy.tags?.some(t => t.toLowerCase().includes("figma"));
                    if (dir === "layout") return vacancy.title.toLowerCase().includes("верстк") || vacancy.tags?.some(t => t.toLowerCase().includes("html"));
                    if (dir === "programming") return vacancy.tags?.some(t => ["react","python","django","typescript","redux","docker"].includes(t.toLowerCase()));
                    if (dir === "databases") return vacancy.tags?.some(t => ["postgresql","mysql","mongodb"].includes(t.toLowerCase()));
                    if (dir === "research") return vacancy.title.toLowerCase().includes("research");
                    return false;
                });
            const matchesLevel =
                filters.levels.length === 0 ||
                filters.levels.some((level) =>
                    vacancy.title.toLowerCase().includes(level)
                );
            const matchesEmployment =
                filters.employments.length === 0 ||
                filters.employments.some((emp) =>
                    vacancy.tags?.some(t => t.toLowerCase().includes(emp))
                );
            const matchesSchedule =
                filters.schedules.length === 0 ||
                filters.schedules.some((sch) =>
                    sch === "remote"
                        ? vacancy.tags?.some(t => t.toLowerCase().includes("удален"))
                        : vacancy.tags?.some(t => t.toLowerCase().includes(sch))
                );
            return (
                matchesSearch &&
                matchesDirection &&
                matchesLevel &&
                matchesEmployment &&
                matchesSchedule
            );
        });
        // Сортировка
        if (sort === "new") {
            filtered = filtered.sort((a, b) => b.postedDate.localeCompare(a.postedDate));
        } else if (sort === "old") {
            filtered = filtered.sort((a, b) => a.postedDate.localeCompare(b.postedDate));
        } else if (sort === "salary_desc") {
            filtered = filtered.sort((a, b) => {
                const aSalary = parseInt(a.salary.replace(/\D/g, ""));
                const bSalary = parseInt(b.salary.replace(/\D/g, ""));
                return bSalary - aSalary;
            });
        } else if (sort === "salary_asc") {
            filtered = filtered.sort((a, b) => {
                const aSalary = parseInt(a.salary.replace(/\D/g, ""));
                const bSalary = parseInt(b.salary.replace(/\D/g, ""));
                return aSalary - bSalary;
            });
        }
        setFilteredVacancies(filtered);
    }, [searchQuery, filters, sort]);

    return (
        <div className={classNames("container", styles.container)}>
            <div style={{ display: "flex", gap: 32 }}>
                <div>
                    <VacancyFilters
                        values={filters}
                        onChange={handleFilterChange}
                        onClear={handleClearFilters}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <div className={styles.resultsHeader}>
                        <h2 className="title fz32">
                            Вакансии
                            <span className={styles.vacancyCountBadge}>{filteredVacancies.length}</span>
                        </h2>
                        <div className={styles.sortBar}>
                            <span className={styles.sortLink}>
                                <VacancySort value={sort} onChange={setSort} />
                            </span>
                        </div>
                    </div>
                    <div className={styles.vacanciesList}>
                        {filteredVacancies.map((vacancy) => (
                            <div
                                key={vacancy.id}
                                className={styles.vacancyCard}
                                onClick={() => router.push(`/vacancies/${vacancy.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className={styles.vacancyTopRow}>
                                    <span className={styles.vacancyDate}>{vacancy.postedDate}</span>
                                </div>
                                <div className={styles.vacancyCompanyRow}>
                                    <span className={styles.vacancyCompany}>{vacancy.company}, {vacancy.location}</span>
                                </div>
                                <div className={styles.vacancyTitleRow}>
                                    <span className={styles.vacancyTitle}>{vacancy.title}</span>
                                </div>
                                <div className={styles.vacancyTagsRow}>
                                    {vacancy.tags?.map((tag, idx) => (
                                        <span key={idx} className={styles.vacancyTag}>{tag}</span>
                                    ))}
                                </div>
                                <div className={styles.vacancySalaryRow}>{vacancy.salary}</div>
                                <Button type="primary" className={styles.applyButton}>
                                    Откликнуться
                                </Button>
                            </div>
                        ))}
                    </div>
                    {filteredVacancies.length === 0 && (
                        <div className={styles.noResults}>
                            <h3 className="title fz24">Вакансии не найдены</h3>
                            <p className="text gray">
                                Попробуйте изменить параметры поиска
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
=======
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
>>>>>>> f1558725db528ddfd2b4da551d4bf379a5fc844f
