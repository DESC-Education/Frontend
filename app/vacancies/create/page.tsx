"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import { createVacancy } from "../../_http/API/vacancyApi";
import { useTypesSelector } from "../../_hooks/useTypesSelector";

export default function CreateVacancyPage() {
    const router = useRouter();
    const { user } = useTypesSelector((state) => state.userReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: "",
        responsibilities: "",
        salary_min: "",
        salary_max: "",
        salary_currency: "RUB",
        location: "",
        remote_work: false,
        categoryId: "",
        experience_required: "",
        education_required: "",
        employment_type: "Полная занятость",
        work_schedule: "Полный день"
    });

    // Проверяем, что пользователь - компания
    if (user.role !== "company") {
        router.push("/vacancies");
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await createVacancy({
                ...formData,
                salary_min: parseInt(formData.salary_min),
                salary_max: parseInt(formData.salary_max),
                categoryId: formData.categoryId || "default-category-id" // В реальном проекте нужно получить список категорий
            });

            if (response.status === 200) {
                router.push("/vacancies");
            } else {
                alert("Ошибка при создании вакансии: " + response.message);
            }
        } catch (error) {
            alert("Произошла ошибка при создании вакансии");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classNames("container", styles.container)}>
            <div style={{ marginBottom: 24 }}>
                <a href="/vacancies" className={styles.backLink}>&lt; К списку вакансий</a>
            </div>
            
            <div className={styles.createVacancyForm}>
                <h1 className="title fz32">Создать вакансию</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h3 className="title fz20">Основная информация</h3>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Название вакансии *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={styles.input}
                                required
                                placeholder="Например: Frontend Developer"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Описание вакансии *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                required
                                placeholder="Подробное описание вакансии, миссии компании, корпоративной культуры"
                                rows={5}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Минимальная зарплата *</label>
                                <input
                                    type="number"
                                    name="salary_min"
                                    value={formData.salary_min}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="50000"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Максимальная зарплата *</label>
                                <input
                                    type="number"
                                    name="salary_max"
                                    value={formData.salary_max}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="150000"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Валюта</label>
                                <select
                                    name="salary_currency"
                                    value={formData.salary_currency}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="RUB">Рубли (₽)</option>
                                    <option value="USD">Доллары ($)</option>
                                    <option value="EUR">Евро (€)</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Локация *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="Москва"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Тип занятости</label>
                                <select
                                    name="employment_type"
                                    value={formData.employment_type}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="Полная занятость">Полная занятость</option>
                                    <option value="Частичная занятость">Частичная занятость</option>
                                    <option value="Проектная работа">Проектная работа</option>
                                    <option value="Стажировка">Стажировка</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="remote_work"
                                    checked={formData.remote_work}
                                    onChange={handleInputChange}
                                    className={styles.checkbox}
                                />
                                Возможна удаленная работа
                            </label>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3 className="title fz20">Требования и обязанности</h3>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Требования *</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                required
                                placeholder="Опишите требования к кандидату: опыт работы, навыки, образование"
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Обязанности *</label>
                            <textarea
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                required
                                placeholder="Опишите основные обязанности и задачи"
                                rows={4}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Требуемый опыт</label>
                                <select
                                    name="experience_required"
                                    value={formData.experience_required}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Не указано</option>
                                    <option value="Без опыта">Без опыта</option>
                                    <option value="1-3 года">1-3 года</option>
                                    <option value="3-6 лет">3-6 лет</option>
                                    <option value="Более 6 лет">Более 6 лет</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Образование</label>
                                <select
                                    name="education_required"
                                    value={formData.education_required}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Не указано</option>
                                    <option value="Среднее">Среднее</option>
                                    <option value="Среднее специальное">Среднее специальное</option>
                                    <option value="Высшее">Высшее</option>
                                    <option value="Неполное высшее">Неполное высшее</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Button 
                            type="secondary" 
                            onClick={() => router.push("/vacancies")}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </Button>
                        <Button 
                            type="primary" 
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? "Создание..." : "Создать вакансию"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}