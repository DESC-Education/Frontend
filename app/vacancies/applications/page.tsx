"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import { getStudentApplications } from "../../_http/API/vacancyApi";
import { useTypesSelector } from "../../_hooks/useTypesSelector";
import { IVacancyApplication } from "../../_http/API/vacancyApi";

export default function MyApplicationsPage() {
    const router = useRouter();
    const { user } = useTypesSelector((state) => state.userReducer);
    const [applications, setApplications] = useState<IVacancyApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Проверяем, что пользователь - студент
    if (user.role !== "student") {
        router.push("/vacancies");
        return null;
    }

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            const response = await getStudentApplications();
            if (response.status === 200) {
                setApplications(response.data || []);
            } else {
                alert("Ошибка при загрузке заявок: " + response.message);
            }
        } catch (error) {
            alert("Произошла ошибка при загрузке заявок");
        } finally {
            setIsLoading(false);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className={classNames("container", styles.container)}>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <p>Загрузка заявок...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("container", styles.container)}>
            <div style={{ marginBottom: 24 }}>
                <a href="/vacancies" className={styles.backLink}>&lt; К списку вакансий</a>
            </div>
            
            <div className={styles.myApplicationsHeader}>
                <h1 className="title fz32">Мои заявки</h1>
            </div>

            {applications.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📝</div>
                    <h3 className="title fz24">У вас пока нет заявок</h3>
                    <p className="text gray">
                        Найдите интересные вакансии и подайте заявку
                    </p>
                    <Button 
                        type="primary" 
                        onClick={() => router.push("/vacancies")}
                    >
                        Найти вакансии
                    </Button>
                </div>
            ) : (
                <div className={styles.applicationsList}>
                    {applications.map((application) => (
                        <div key={application.id} className={styles.applicationCard}>
                            <div className={styles.applicationHeader}>
                                <div className={styles.applicationInfo}>
                                    <h3 className={styles.vacancyTitle}>
                                        Вакансия #{application.vacancy}
                                    </h3>
                                    <div className={styles.applicationStatus}>
                                        {getApplicationStatusBadge(application.status)}
                                    </div>
                                    <p className={styles.applicationDate}>
                                        Подана: {formatDate(application.createdAt)}
                                    </p>
                                    {application.respondedAt && (
                                        <p className={styles.responseDate}>
                                            Ответ: {formatDate(application.respondedAt)}
                                        </p>
                                    )}
                                </div>
                                <div className={styles.applicationActions}>
                                    <Button 
                                        type="secondary" 
                                        onClick={() => router.push(`/vacancies/${application.vacancy}`)}
                                    >
                                        Просмотр вакансии
                                    </Button>
                                </div>
                            </div>
                            
                            <div className={styles.applicationDetails}>
                                <div className={styles.detailRow}>
                                    <strong>Ожидаемая зарплата:</strong> {application.expected_salary} ₽
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Доступен с:</strong> {formatDate(application.available_from)}
                                </div>
                                {application.companyComment && (
                                    <div className={styles.companyComment}>
                                        <strong>Комментарий компании:</strong>
                                        <p>{application.companyComment}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.coverLetter}>
                                <strong>Сопроводительное письмо:</strong>
                                <p>{application.cover_letter}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}