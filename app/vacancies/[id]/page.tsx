"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import { useTypesSelector } from "../../_hooks/useTypesSelector";
import { applyToVacancy, getVacancyById, IVacancy } from "../../_http/API/vacancyApi";

export default function VacancyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isAuth } = useTypesSelector((state) => state.userReducer);
    const [vacancy, setVacancy] = useState<IVacancy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationData, setApplicationData] = useState({
        cover_letter: "",
        expected_salary: "",
        available_from: ""
    });

    // Загрузка данных вакансии
    useEffect(() => {
        const loadVacancy = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await getVacancyById(id as string);
                
                if (response.status === 200 && response.data) {
                    setVacancy(response.data);
                } else {
                    setError(response.message || "Вакансия не найдена");
                }
            } catch (err) {
                setError("Ошибка загрузки вакансии");
                console.error("Error loading vacancy:", err);
            } finally {
                setLoading(false);
            }
        };

        loadVacancy();
    }, [id]);

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
                    <p>Загрузка вакансии...</p>
                </div>
            </div>
        );
    }

    if (error || !vacancy) {
        return (
            <div className={classNames("container", styles.container)}>
                <div className={styles.error}>
                    <h3>Ошибка загрузки</h3>
                    <p>{error || "Вакансия не найдена"}</p>
                    <Button 
                        type="primary" 
                        onClick={() => router.push("/vacancies")}
                    >
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

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
                        <div className={styles.vacancyDetailCompany}>
                            {vacancy.companyProfile?.companyName || "Компания"}
                        </div>
                        <div className={styles.vacancyDetailLocation}>{vacancy.location}</div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Описание</h3>
                            <p>{vacancy.description}</p>
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Обязанности</h3>
                            <div dangerouslySetInnerHTML={{ __html: vacancy.responsibilities }} />
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Требования</h3>
                            <div dangerouslySetInnerHTML={{ __html: vacancy.requirements }} />
                        </div>
                        <div className={styles.vacancyDetailSection}>
                            <h3>Условия работы</h3>
                            <ul>
                                <li>Тип занятости: {vacancy.employment_type}</li>
                                <li>График работы: {vacancy.work_schedule}</li>
                                {vacancy.remote_work && <li>Удаленная работа</li>}
                                {vacancy.hybrid_work && <li>Гибридная работа</li>}
                                {vacancy.experience_required && (
                                    <li>Требуемый опыт: {vacancy.experience_required}</li>
                                )}
                                {vacancy.education_required && (
                                    <li>Образование: {vacancy.education_required}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* Правая часть */}
                    <div className={styles.vacancyDetailSidebar}>
                        <div className={styles.vacancyDetailSidebarCard}>
                            <div className={styles.vacancyDetailSidebarLocation}>{vacancy.location}</div>
                            <div className={styles.vacancyDetailSidebarSalary}>
                                {formatSalary(vacancy)}
                            </div>
                            <div className={styles.vacancyDetailSidebarPer}>на руки</div>
                            <div className={styles.vacancyDetailSidebarTags}>
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
                            <div className={styles.vacancyDetailSidebarInfo}>
                                <div>{vacancy.employment_type}</div>
                                <div>{formatDate(vacancy.createdAt)}</div>
                            </div>
                            {user.role === "student" && isAuth ? (
                                <Button type="primary" className={styles.applyButton} onClick={handleApply}>
                                    Откликнуться
                                </Button>
                            ) : user.role === "company" && vacancy.companyProfile?.id === user.id ? (
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
                            <div className={styles.vacancyDetailSidebarCompanyTitle}>
                                {vacancy.companyProfile?.companyName || "Компания"}
                            </div>
                            <div className={styles.vacancyDetailSidebarCompanyDesc}>
                                Информация о компании будет добавлена позже.
                            </div>
                            <a className={styles.vacancyDetailSidebarCompanyMore} href="#">
                                Узнать больше
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}