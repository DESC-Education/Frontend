"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import mockVacancyDetails from "../mockVacancyDetails";
import { useTypesSelector } from "../../_hooks/useTypesSelector";
import { applyToVacancy } from "../../_http/API/vacancyApi";

export default function VacancyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user,isAuth } = useTypesSelector((state) => state.userReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationData, setApplicationData] = useState({
        cover_letter: "",
        expected_salary: "",
        available_from: ""
    });
    
    const vacancy = mockVacancyDetails; // Здесь всегда один мок, но можно подставить по id

    const handleApply = async () => {
        if (user.role !== "student") {
            alert("Только студенты могут подавать заявки на вакансии");
            return;
        }

        if (!isAuth) {
            alert("Необходимо войти в систему");
            return;
        }

        setShowApplicationForm(true);
    };

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await applyToVacancy({
                vacancyId: id as string,
                cover_letter: applicationData.cover_letter,
                expected_salary: parseInt(applicationData.expected_salary),
                available_from: applicationData.available_from
            });

            if (response.status === 200) {
                alert("Заявка успешно отправлена!");
                setShowApplicationForm(false);
                setApplicationData({ cover_letter: "", expected_salary: "", available_from: "" });
            } else {
                alert("Ошибка при отправке заявки: " + response.message);
            }
        } catch (error) {
            alert("Произошла ошибка при отправке заявки");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setApplicationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={classNames("container", styles.container)}>
            <div style={{ marginBottom: 24 }}>
                <a href="/vacancies" className={styles.backLink}>&lt; К списку вакансий</a>
            </div>
            
            {showApplicationForm ? (
                <div className={styles.applicationForm}>
                    <h2 className="title fz24">Подать заявку на вакансию</h2>
                    <form onSubmit={handleSubmitApplication}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Сопроводительное письмо *</label>
                            <textarea
                                name="cover_letter"
                                value={applicationData.cover_letter}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                required
                                placeholder="Расскажите о себе, своем опыте и почему вы подходите для этой вакансии"
                                rows={6}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Ожидаемая зарплата *</label>
                                <input
                                    type="number"
                                    name="expected_salary"
                                    value={applicationData.expected_salary}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="100000"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Доступен с *</label>
                                <input
                                    type="date"
                                    name="available_from"
                                    value={applicationData.available_from}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <Button 
                                type="secondary" 
                                onClick={() => setShowApplicationForm(false)}
                                className={styles.cancelButton}
                            >
                                Отмена
                            </Button>
                            <Button 
                                type="primary" 
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? "Отправка..." : "Отправить заявку"}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.vacancyDetailLayout}>
                    {/* Левая часть */}
                    <div className={styles.vacancyDetailMain}>
                        <div className={styles.vacancyDetailHeaderImg} />
                        <h1 className={styles.vacancyDetailTitle}>{vacancy.title}</h1>
                        <div className={styles.vacancyDetailCompany}>{vacancy.company}</div>
                        <div className={styles.vacancyDetailLocation}>{vacancy.location}</div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>О компании</h3>
                            <p>{vacancy.description}</p>
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Обязанности</h3>
                            <ul>
                                {vacancy.requirements.map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Условия</h3>
                            <ul>
                                {vacancy.conditions.map((cond, i) => <li key={i}>{cond}</li>)}
                            </ul>
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Навыки</h3>
                            <div className={styles.vacancyDetailSkills}>
                                {vacancy.skills.map((skill, i) => (
                                    <span key={i} className={styles.vacancyTag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Вас могут заинтересовать эти вакансии</h3>
                            <div className={styles.vacancyDetailSimilar}>
                                <div className={styles.vacancyDetailSimilarItem}>
                                    <div>Fullstack разработчик</div>
                                    <div>Санкт-Петербург · Частичная занятость</div>
                                    <div className={styles.vacancyDetailSimilarSalary}>130 000 руб.</div>
                                </div>
                                <div className={styles.vacancyDetailSimilarItem}>
                                    <div>Fullstack разработчик</div>
                                    <div>Санкт-Петербург · Частичная занятость</div>
                                    <div className={styles.vacancyDetailSimilarSalary}>130 000 руб.</div>
                                </div>
                                <div className={styles.vacancyDetailSimilarItem}>
                                    <div>Fullstack разработчик</div>
                                    <div>Санкт-Петербург · Частичная занятость</div>
                                    <div className={styles.vacancyDetailSimilarSalary}>130 000 руб.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Правая часть */}
                    <div className={styles.vacancyDetailSidebar}>
                        <div className={styles.vacancyDetailSidebarCard}>
                            <div className={styles.vacancyDetailSidebarLocation}>{vacancy.location}</div>
                            <div className={styles.vacancyDetailSidebarSalary}>{vacancy.salary}</div>
                            <div className={styles.vacancyDetailSidebarPer}>на руки</div>
                            <div className={styles.vacancyDetailSidebarTags}>
                                {vacancy.tags.map((tag, i) => (
                                    <span key={i} className={styles.vacancyTag}>{tag}</span>
                                ))}
                            </div>
                            <div className={styles.vacancyDetailSidebarInfo}>
                                <div>Полная занятость</div>
                                <div>{vacancy.postedDate}</div>
                            </div>
                           { user.role === "student" && isAuth ? (
                                <Button type="primary" className={styles.applyButton} onClick={handleApply}>
                                    Откликнуться
                                </Button>
                            ) : user.role === "company" ? (
                                <div className={styles.companyInfo}>
                                    <p>Вы не можете подать заявку на свою вакансию</p>
                                </div>
                            ) : (
                                <Button type="secondary" className={styles.applyButton} onClick={() => router.push("/login")}>
                                    Войти для отклика
                                </Button>
                            )}
                        </div>
                        <div className={styles.vacancyDetailSidebarCompanyCard}>
                            <div className={styles.vacancyDetailSidebarCompanyTitle}>Название компании</div>
                            <div className={styles.vacancyDetailSidebarCompanyDesc}>
                                Краткое описание компании, её миссия, ценности и преимущества для сотрудников. Укажите, почему стоит работать именно у вас.
                            </div>
                            <a className={styles.vacancyDetailSidebarCompanyMore} href="#">Узнать больше</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}