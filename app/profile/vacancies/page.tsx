"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import { getCompanyVacancies, getVacancyApplications, evaluateApplication } from "../../_http/API/vacancyApi";
import { useTypesSelector } from "../../_hooks/useTypesSelector";
import { IVacancy, IVacancyApplication } from "../../_http/API/vacancyApi";
import CustomOval from "../../_components/ui/CustomOval/CustomOval";

export default function ProfileVacanciesPage() {
    const router = useRouter();
    const { user } = useTypesSelector((state) => state.userReducer);
    const [vacancies, setVacancies] = useState<IVacancy[]>([]);
    const [applications, setApplications] = useState<{ [key: string]: IVacancyApplication[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVacancy, setSelectedVacancy] = useState<string | null>(null);
    const [evaluatingApplication, setEvaluatingApplication] = useState<string | null>(null);

    // Проверяем, что пользователь - компания
    if (user.role !== "company") {
        router.push("/profile");
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
                console.error("Ошибка при загрузке вакансий:", response.message);
            }
        } catch (error) {
            console.error("Произошла ошибка при загрузке вакансий:", error);
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
                console.error("Ошибка при загрузке заявок:", response.message);
            }
        } catch (error) {
            console.error("Произошла ошибка при загрузке заявок:", error);
        }
    };

    const handleEvaluateApplication = async (applicationId: string, status: "accepted" | "rejected", comment?: string) => {
        setEvaluatingApplication(applicationId);
        try {
            const response = await evaluateApplication(applicationId, { status, comment });
            if (response.status === 200) {
                // Обновляем список заявок
                if (selectedVacancy) {
                    loadApplications(selectedVacancy);
                }
            } else {
                console.error("Ошибка при оценке заявки:", response.message);
            }
        } catch (error) {
            console.error("Произошла ошибка при оценке заявки:", error);
        } finally {
            setEvaluatingApplication(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <span className={styles.statusActive}>Активна</span>;
            case "inactive":
                return <span className={styles.statusInactive}>Неактивна</span>;
            case "moderation":
                return <span className={styles.statusModeration}>На модерации</span>;
            default:
                return <span className={styles.statusDefault}>{status}</span>;
        }
    };

    const getApplicationStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span className={styles.statusPending}>На рассмотрении</span>;
            case "accepted":
                return <span className={styles.statusAccepted}>Принята</span>;
            case "rejected":
                return <span className={styles.statusRejected}>Отклонена</span>;
            default:
                return <span className={styles.statusDefault}>{status}</span>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <CustomOval />
                    <p>Загрузка вакансий...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="title fz32">Мои вакансии</h1>
                <Button 
                    type="primary" 
                    onClick={() => router.push("/vacancies/create")}
                    className={styles.createButton}
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
                        className={styles.createButton}
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
                                    <p className={styles.vacancyDate}>
                                        Создана: {formatDate(vacancy.createdAt)}
                                    </p>
                                </div>
                                <div className={styles.vacancyActions}>
                                    <Button 
                                        type="secondary" 
                                        onClick={() => router.push(`/vacancies/${vacancy.id}`)}
                                        className={styles.viewButton}
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
                                        className={styles.applicationsButton}
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
                                                        <p>Доступен с: {formatDate(application.available_from)}</p>
                                                        <p>Статус: {getApplicationStatusBadge(application.status)}</p>
                                                        <p>Подана: {formatDate(application.createdAt)}</p>
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
                                                            className={styles.acceptButton}
                                                            disabled={evaluatingApplication === application.id}
                                                        >
                                                            {evaluatingApplication === application.id ? "Принятие..." : "Принять"}
                                                        </Button>
                                                        <Button 
                                                            type="secondary" 
                                                            onClick={() => handleEvaluateApplication(application.id, "rejected")}
                                                            className={styles.rejectButton}
                                                            disabled={evaluatingApplication === application.id}
                                                        >
                                                            {evaluatingApplication === application.id ? "Отклонение..." : "Отклонить"}
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