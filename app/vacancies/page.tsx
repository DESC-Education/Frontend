"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import classNames from "classnames";
import Button from "../_components/ui/Button/Button";
import CustomSearch from "../_components/ui/CustomSearch/CustomSearch";
import VacancyFilters from "./VacancyFilters";
import VacancySort from "./VacancySort";
import React from "react";
import { useRouter } from "next/navigation";
import mockVacancyDetails from "./mockVacancyDetails";

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


type FilterState = {
    categories: string[];
    directions: string[];
    levels: string[];
    employments: string[];
    schedules: string[];
};

const initialFilterState: FilterState = {
    categories: [],
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
    const [filters, setFilters] = useState<FilterState>(initialFilterState);
    const [sort, setSort] = useState("recommend");
    const [filteredVacancies, setFilteredVacancies] = useState(mockVacancies);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (
        section: keyof FilterState,
        value: string,
        checked: boolean
    ) => {
        setFilters((prev) => {
            const arr = prev[section];
            return {
                ...prev,
                [section]: checked
                    ? [...arr, value]
                    : arr.filter((v) => v !== value),
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
                <div className={styles.vacancyCount}>
                    Вакансии <span className={styles.count}>{filteredVacancies.length}</span>
                </div>
            <div className={styles.topPanel}>
                <div className={styles.sorting}>
                    <div className={styles.sort}>
                        <VacancySort value={sort} onChange={setSort} />
                    </div>
                </div>
            </div>
            <div className={styles.mainContainer}>
                <aside className={styles.sidebar1}>
                    <VacancyFilters values={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
                </aside>
                <main className={styles.mainContent}>
                    <div className={styles.grid}>
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
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📂</div>
                            <h3 className="title fz24">Вакансии не найдены</h3>
                            <p className="text gray">
                                Попробуйте изменить параметры поиска
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
} 