"use client";
import { useParams } from "next/navigation";
import styles from "../page.module.scss";
import Button from "../../_components/ui/Button/Button";
import classNames from "classnames";
import mockVacancyDetails from "../mockVacancyDetails";

export default function VacancyDetailPage() {
    // В реальном проекте: получить vacancyId из useParams и загрузить данные
    const { id } = useParams();
    const vacancy = mockVacancyDetails; // Здесь всегда один мок, но можно подставить по id

    return (
        <div className={classNames("container", styles.container)}>
            <div style={{ marginBottom: 24 }}>
                <a href="/vacancies" className={styles.backLink}>&lt; К списку вакансий</a>
            </div>
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
                        <Button type="primary" className={styles.applyButton}>
                            Откликнуться
                        </Button>
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
        </div>
    );
} 