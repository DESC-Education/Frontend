"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import { getCompanyVacancies, getVacancyApplications, evaluateApplication } from "../../_http/API/vacancyApi";
import { useTypesSelector } from "../../_hooks/useTypesSelector";
import { IVacancy, IVacancyApplication } from "../../_http/API/vacancyApi";

export default function MyVacanciesPage() {
    const router = useRouter();
    const { user } = useTypesSelector((state) => state.userReducer);
    const [vacancies, setVacancies] = useState<IVacancy[]>([]);
    const [applications, setApplications] = useState<{ [key: string]: IVacancyApplication[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVacancy, setSelectedVacancy] = useState<string | null>(null);

    // Проверяем, что пользователь - компания
    if (user.role !== "company") {
        router.push("/vacancies");
        return null;
    }

    useEffect(() => {
        loadVacancies();
    }, []);

    const loadVacancies = async () => {
        setIsLoading(true);
        try {
            const response = await getCompanyVacancies();
            if (response.status === 200) {
                setVacancies(response.data || []);
            } else {
                alert("Ошибка при загрузке вакансий: " + response.message);
            }
        } catch (error) {
            alert("Произошла ошибка при загрузке вакансий");
        } finally {
            setIsLoading(false);
        }
    };

    const loadApplications = async (vacancyId: string) => {
        try {
            const response = await getVacancyApplications(vacancyId);
            if (response.status === 200) {
                setApplications(prev => ({
                    ...prev,
                    [vacancyId]: response.data || []
                }));
            } else {
                alert("Ошибка при загрузке заявок: " + response.message);
            }
        } catch (error) {
            alert("Произошла ошибка при загрузке заявок");
        }
    };

    const handleEvaluateApplication = async (applicationId: string, status: "accepted" | "rejected", comment?: string) => {
        try {
            const response = await evaluateApplication(applicationId, { status, comment });
            if (response.status === 200) {
                alert(`Заявка ${status === "accepted" ? "принята" : "отклонена"}`);
                // Обновляем список заявок
                if (selectedVacancy) {
                    loadApplications(selectedVacancy);
                }
            } else {
                alert("Ошибка при оценке заявки: " + response.message);
            }
        } catch (error) {
            alert("Произошла ошибка при оценке заявки");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <span style={{ color: "#10b981", fontWeight: 600 }}>Активна</span>;
            case "inactive":
                return <span style={{ color: "#6b7280", fontWeight: 600 }}>Неактивна</span>;
            case "moderation":
                return <span style={{ color: "#f59e0b", fontWeight: 600 }}>На модерации</span>;
            default:
                return <span style={{ color: "#6b7280", fontWeight: 600 }}>{status}</span>;
        }
    };

    const getApplicationStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span style={{ color: "#f59e0b", fontWeight: 600 }}>На рассмотрении</span>;
            case "accepted":
                return <span style={{ color: "#10b981", fontWeight: 600 }}>Принята</span>;
            case "rejected":
                return <span style={{ color: "#ef4444", fontWeight: 600 }}>Отклонена</span>;
            default:
                return <span style={{ color: "#6b7280", fontWeight: 600 }}>{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className={classNames("container", styles.container)}>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <p>Загрузка вакансий...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("container", styles.container)}>
            <div style={{ marginBottom: 24 }}>
                <a href="/vacancies" className={styles.backLink}>&lt; К списку вакансий</a>
            </div>
            
            <div className={styles.myVacanciesHeader}>
                <h1 className="title fz32">Мои вакансии</h1>
                <Button 
                    type="primary" 
                    onClick={() => router.push("/vacancies/create")}
                >
                    Создать вакансию
                </Button>
            </div>

            {vacancies.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3 className="title fz24">У вас пока нет вакансий</h3>
                    <p className="text gray">
                        Создайте свою первую вакансию, чтобы найти подходящих кандидатов
                    </p>
                    <Button 
                        type="primary" 
                        onClick={() => router.push("/vacancies/create")}
                    >
                        Создать вакансию
                    </Button>
                </div>
            ) : (
                <div className={styles.vacanciesList}>
                    {vacancies.map((vacancy) => (
                        <div key={vacancy.id} className={styles.vacancyItem}>
                            <div className={styles.vacancyHeader}>
                                <div className={styles.vacancyInfo}>
                                    <h3 className={styles.vacancyTitle}>{vacancy.title}</h3>
                                    <p className={styles.vacancyLocation}>{vacancy.location}</p>
                                    <p className={styles.vacancySalary}>
                                        {vacancy.salary_min} - {vacancy.salary_max} {vacancy.salary_currency}
                                    </p>
                                    <div className={styles.vacancyStatus}>
                                        {getStatusBadge(vacancy.status)}
                                    </div>
                                </div>
                                <div className={styles.vacancyActions}>
                                    <Button 
                                        type="secondary" 
                                        onClick={() => router.push(`/vacancies/${vacancy.id}`)}
                                    >
                                        Просмотр
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        onClick={() => {
                                            setSelectedVacancy(selectedVacancy === vacancy.id ? null : vacancy.id);
                                            if (selectedVacancy !== vacancy.id) {
                                                loadApplications(vacancy.id);
                                            }
                                        }}
                                    >
                                        {selectedVacancy === vacancy.id ? "Скрыть заявки" : `Заявки (${vacancy.applicationsCount})`}
                                    </Button>
                                </div>
                            </div>
                            
                            {selectedVacancy === vacancy.id && applications[vacancy.id] && (
                                <div className={styles.applicationsList}>
                                    <h4 className={styles.applicationsTitle}>Заявки на вакансию</h4>
                                    {applications[vacancy.id].length === 0 ? (
                                        <p className={styles.noApplications}>Пока нет заявок</p>
                                    ) : (
                                        applications[vacancy.id].map((application) => (
                                            <div key={application.id} className={styles.applicationItem}>
                                                <div className={styles.applicationInfo}>
                                                    <div className={styles.applicantName}>
                                                        {application.studentProfile.firstName} {application.studentProfile.lastName}
                                                    </div>
                                                    <div className={styles.applicationDetails}>
                                                        <p>Ожидаемая зарплата: {application.expected_salary} ₽</p>
                                                        <p>Доступен с: {new Date(application.available_from).toLocaleDateString()}</p>
                                                        <p>Статус: {getApplicationStatusBadge(application.status)}</p>
                                                    </div>
                                                    <div className={styles.coverLetter}>
                                                        <strong>Сопроводительное письмо:</strong>
                                                        <p>{application.cover_letter}</p>
                                                    </div>
                                                </div>
                                                {application.status === "pending" && (
                                                    <div className={styles.applicationActions}>
                                                        <Button 
                                                            type="primary" 
                                                            onClick={() => handleEvaluateApplication(application.id, "accepted")}
                                                        >
                                                            Принять
                                                        </Button>
                                                        <Button 
                                                            type="secondary" 
                                                            onClick={() => handleEvaluateApplication(application.id, "rejected")}
                                                        >
                                                            Отклонить
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}