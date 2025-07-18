"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";

const EmployerVacanciesPage = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Размещение вакансий для работодателей
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Найдите лучших студентов и выпускников для своей компании с нашей платформой
                    </p>
                    <Link href="/vacancies/create" className={styles.heroButton}>
                        Подробнее об услуге
                    </Link>
                </div>
                <div className={styles.heroImageContainer}>
                    <Image
                        src="/icons/hummingbird.svg"
                        alt="Hummingbird"
                        width={262}
                        height={218}
                        className={styles.heroImage}
                    />
                </div>
            </section>

            {/* Преимущества */}
            <section className={styles.advantagesSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Наши преимущества</h2>
                    <div className={styles.advantagesGrid}>
                        <div className={`${styles.advantageCard} ${styles.card1}`}>
                            <div className={styles.cardNumber}>1</div>
                            <div className={styles.cardIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2"/>
                                    <path d="M8 12L11 15L16 9" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={styles.cardTitle}>Целевая аудитория</h3>
                            <p className={styles.cardDescription}>
                                Только студенты и выпускники, активно ищущие работу или стажировку. 
                                Никаких случайных соискателей.
                            </p>
                        </div>
                        <div className={`${styles.advantageCard} ${styles.card2}`}>
                            <div className={styles.cardNumber}>2</div>
                            <div className={styles.cardIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={styles.cardTitle}>Прозрачная оплата</h3>
                            <p className={styles.cardDescription}>
                                Платите только за отклики (20 руб. за каждый). 
                                Никаких скрытых платежей или подписок.
                            </p>
                        </div>
                        <div className={`${styles.advantageCard} ${styles.card3}`}>
                            <div className={styles.cardNumber}>3</div>
                            <div className={styles.cardIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={styles.cardTitle}>Быстрый результат</h3>
                            <p className={styles.cardDescription}>
                                Среднее время получения первого отклика — менее 24 часов 
                                для популярных вакансий.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Описание услуги */}
            <section className={styles.serviceSection}>
                <div className="container">
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceDescription}>
                            <h2 className={styles.serviceTitle}>Описание услуги</h2>
                            <p className={styles.serviceText}>
                                Сервис DESC Education предоставляет работодателям возможность публикации вакансий 
                                для студентов и выпускников вузов. Услуга включает:
                            </p>
                            <ul className={styles.serviceList}>
                                <li>Размещение информации о вакансии в разделе "Карьера"</li>
                                <li>Доступ к базе активных соискателей-студентов</li>
                                <li>Получение и обработку откликов от кандидатов</li>
                                <li>Управление вакансиями через личный кабинет</li>
                            </ul>
                        </div>
                        <div className={styles.serviceProperties}>
                            <div className={styles.propertiesNumber}>1</div>
                            <h3 className={styles.propertiesTitle}>Потребительские свойства</h3>
                            <p className={styles.propertiesSubtitle}>
                                Ключевые преимущества и характеристики услуги:
                            </p>
                            <div className={styles.propertiesList}>
                                <div className={styles.propertyItem}>
                                    <strong>Целевая аудитория:</strong> только студенты и выпускники, заинтересованные в работе и стажировках
                                </div>
                                <div className={styles.propertyItem}>
                                    <strong>Гибкая оплата:</strong> платите только за реальные отклики (20 руб. за каждый)
                                </div>
                                <div className={styles.propertyItem}>
                                    <strong>Быстрый результат:</strong> среднее время получения первого отклика — менее 24 часов
                                </div>
                                <div className={styles.propertyItem}>
                                    <strong>Простое управление:</strong> удобный интерфейс для работы с вакансиями
                                </div>
                                <div className={styles.propertyItem}>
                                    <strong>Безлимитный срок:</strong> вакансия остается активной до ручного закрытия
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Стоимость услуги */}
            <section className={styles.pricingSection}>
                <div className="container">
                    <div className={styles.pricingContent}>
                        <div className={styles.priceCard}>
                            <h2 className={styles.pricingTitle}>Стоимость услуги</h2>
                            <div className={styles.priceCircle}>
                                <div className={styles.priceAmount}>20 ₽</div>
                                <div className={styles.priceLabel}>За каждый отклик</div>
                            </div>
                            <div className={styles.pricingMetrics}>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricNumber}>1</span>
                                    <div className={styles.metricContent}>
                                        <strong>Минимальное пополнение</strong>
                                        <span>1 000 рублей</span>
                                    </div>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricNumber}>2</span>
                                    <div className={styles.metricContent}>
                                        <strong>Среднее количество откликов</strong>
                                        <span>15-30 на вакансию</span>
                                    </div>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricNumber}>3</span>
                                    <div className={styles.metricContent}>
                                        <strong>Ожидаемые расходы</strong>
                                        <span>300-600 рублей</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.pricingExample}>
                                <h4>Пример расчета:</h4>
                                <p>При получении 25 откликов на вакансию: 25 откликов x 20 ₽ = 500 ₽</p>
                            </div>
                        </div>
                        <div className={styles.pricingRightColumn}>
                            <div className={styles.pricingProcedure}>
                                <div className={styles.procedureNumber}>2</div>
                                <h3 className={styles.procedureTitle}>Порядок предоставления услуги</h3>
                                <div className={styles.procedureList}>
                                    <div className={styles.procedureItem}>
                                        <span className={styles.procedureStepNumber}>1.</span>
                                        <span>Регистрация компании в системе</span>
                                    </div>
                                    <div className={styles.procedureItem}>
                                        <span className={styles.procedureStepNumber}>2.</span>
                                        <span>Пополнение баланса в личном кабинете</span>
                                    </div>
                                    <div className={styles.procedureItem}>
                                        <span className={styles.procedureStepNumber}>3.</span>
                                        <span>Создание и публикация вакансии</span>
                                    </div>
                                    <div className={styles.procedureItem}>
                                        <span className={styles.procedureStepNumber}>4.</span>
                                        <span>Получение откликов от соискателей</span>
                                    </div>
                                    <div className={styles.procedureItem}>
                                        <span className={styles.procedureStepNumber}>5.</span>
                                        <span>Автоматическое списание средств за каждый отклик (20 руб.)</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.ctaCard}>
                                <h3 className={styles.ctaTitle}>
                                    Закрывайте вакансии в 3 раза быстрее!
                                </h3>
                                <p className={styles.ctaText}>
                                    Получайте целевые отклики от студентов с релевантными навыками уже сегодня. 
                                    Платите только за результат!
                                </p>
                                <Link 
                                    href="/vacancies/create" 
                                    className={styles.ctaButton}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    Начать размещение вакансии
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Контакты */}
            <section className={styles.contactsSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Наши контакты</h2>
                    <div className={styles.contactsGrid}>
                        <div className={`${styles.contactCard} ${styles.emailCard}`}>
                            <div className={styles.contactIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="22,6 12,13 2,6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={styles.contactTitle}>Электронная почта</h3>
                            <p className={styles.contactDescription}>Пишите нам по любым вопросам</p>
                            <a href="mailto:support@desc-education.ru" className={styles.contactLink}>
                                support@desc-education.ru
                            </a>
                        </div>
                        <div className={`${styles.contactCard} ${styles.phoneCard}`}>
                            <div className={styles.contactIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2136 21.3521 21.4019C21.1469 21.5902 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3146 6.72533 15.2661 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09477 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65181C2.82196 2.44693 3.04965 2.28335 3.30351 2.17149C3.55737 2.05963 3.83188 2.00195 4.10999 2H7.10999C7.59522 1.99522 8.06574 2.16708 8.43376 2.48353C8.80178 2.79999 9.042 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97348 7.27675 9.89381 7.65307C9.81415 8.02939 9.62976 8.37471 9.35999 8.65L8.08999 9.92C9.51355 12.4135 11.5865 14.4865 14.08 15.91L15.35 14.64C15.6253 14.3702 15.9706 14.1858 16.3469 14.1062C16.7233 14.0265 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={styles.contactTitle}>Телефон</h3>
                            <p className={styles.contactDescription}>Звоните в рабочее время</p>
                            <a href="tel:+79911320757" className={styles.contactLink}>
                                +7 (991) 132-07-57
                            </a>
                        </div>
                        <div className={`${styles.contactCard} ${styles.socialCard}`}>
                            <div className={styles.contactIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={styles.contactTitle}>Социальные сети</h3>
                            <p className={styles.contactDescription}>Подпишитесь на наши обновления</p>
                            <div className={styles.socialLinks}>
                                <a href="https://t.me/desc_edu" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 2L11 13" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </a>
                                <a href="https://vk.com/desc_edu" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                    VK
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmployerVacanciesPage; 