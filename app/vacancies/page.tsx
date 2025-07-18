"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import classNames from "classnames";
import Button from "../_components/ui/Button/Button";
import CustomSearch from "../_components/ui/CustomSearch/CustomSearch";
import VacancyFilters from "./VacancyFilters";
import VacancySort from "./VacancySort";
import React from "react";
import { useRouter } from "next/navigation";
import { getVacancies, IVacancy } from "../_http/API/vacancyApi";

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
    const [vacancies, setVacancies] = useState<IVacancy[]>([]);
    const [filteredVacancies, setFilteredVacancies] = useState<IVacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка вакансий из API
    useEffect(() => {
        const loadVacancies = async () => {
            try {
                setLoading(true);
                const response = await getVacancies();
                
                if (response.status === 200 && response.data) {
                    setVacancies(response.data);
                } else {
                    setError(response.message || "Ошибка загрузки вакансий");
                }
            } catch (err) {
                setError("Ошибка подключения к серверу");
                console.error("Error loading vacancies:", err);
            } finally {
                setLoading(false);
            }
        };

        loadVacancies();
    }, []);

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

    // Фильтрация и сортировка вакансий
    React.useEffect(() => {
        let filtered = vacancies.filter((vacancy) => {
            // Поиск
            const matchesSearch =
                !searchQuery ||
                vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vacancy.companyProfile?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vacancy.location.toLowerCase().includes(searchQuery.toLowerCase());

            // Фильтры
            const matchesCategory =
                filters.categories.length === 0 ||
                filters.categories.includes(vacancy.category?.id || "");

            const matchesEmployment =
                filters.employments.length === 0 ||
                filters.employments.some((emp) => {
                    if (emp === "remote") return vacancy.remote_work;
                    if (emp === "hybrid") return vacancy.hybrid_work;
                    return vacancy.employment_type === emp;
                });

            const matchesExperience =
                filters.levels.length === 0 ||
                filters.levels.some((level) => 
                    vacancy.experience_required === level
                );

            const matchesSchedule =
                filters.schedules.length === 0 ||
                filters.schedules.some((schedule) => 
                    vacancy.work_schedule === schedule
                );

            return (
                matchesSearch &&
                matchesCategory &&
                matchesEmployment &&
                matchesExperience &&
                matchesSchedule
            );
        });

        // Сортировка
        if (sort === "new") {
            filtered = filtered.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else if (sort === "old") {
            filtered = filtered.sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        } else if (sort === "salary_desc") {
            filtered = filtered.sort((a, b) => b.salary_max - a.salary_max);
        } else if (sort === "salary_asc") {
            filtered = filtered.sort((a, b) => a.salary_min - b.salary_min);
        }

        setFilteredVacancies(filtered);
    }, [vacancies, searchQuery, filters, sort]);

    const formatSalary = (vacancy: IVacancy) => {
        if (vacancy.salary_negotiable) {
            return "По договоренности";
        }
        if (vacancy.salary_min === vacancy.salary_max) {
            return `${vacancy.salary_min.toLocaleString()} ${vacancy.salary_currency}`;
        }
        return `${vacancy.salary_min.toLocaleString()} - ${vacancy.salary_max.toLocaleString()} ${vacancy.salary_currency}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "Сегодня";
        if (diffDays === 2) return "Вчера";
        if (diffDays <= 7) return `${diffDays - 1} дней назад`;
        
        return date.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className={classNames("container", styles.container)}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Загрузка вакансий...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={classNames("container", styles.container)}>
                <div className={styles.error}>
                    <h3>Ошибка загрузки</h3>
                    <p>{error}</p>
                    <Button 
                        type="primary" 
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </Button>
                </div>
            </div>
        );
    }

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
                                    <span className={styles.vacancyDate}>
                                        {formatDate(vacancy.createdAt)}
                                    </span>
                                </div>
                                <div className={styles.vacancyCompanyRow}>
                                    <span className={styles.vacancyCompany}>
                                        {vacancy.companyProfile?.companyName || "Компания"}, {vacancy.location}
                                    </span>
                                </div>
                                <div className={styles.vacancyTitleRow}>
                                    <span className={styles.vacancyTitle}>{vacancy.title}</span>
                                </div>
                                <div className={styles.vacancyTagsRow}>
                                    {vacancy.employment_type && (
                                        <span className={styles.vacancyTag}>{vacancy.employment_type}</span>
                                    )}
                                    {vacancy.experience_required && (
                                        <span className={styles.vacancyTag}>{vacancy.experience_required}</span>
                                    )}
                                    {vacancy.remote_work && (
                                        <span className={styles.vacancyTag}>Удалённо</span>
                                    )}
                                    {vacancy.hybrid_work && (
                                        <span className={styles.vacancyTag}>Гибрид</span>
                                    )}
                                </div>
                                <div className={styles.vacancySalaryRow}>
                                    {formatSalary(vacancy)}
                                </div>
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