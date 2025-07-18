"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Link from "next/link";

const EmployerVacanciesPage = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className="container">
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
                    <div className={styles.heroImage}>
                        <div className={styles.hummingbird}></div>
                    </div>
                </div>
            </section>

            {/* Преимущества */}
            <section className={styles.advantagesSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Наши преимущества</h2>
                    <div className={styles.advantagesGrid}>
                        <div className={`${styles.advantageCard} ${styles.card1}`}>
                            <div className={styles.cardNumber}>1</div>
                            <h3 className={styles.cardTitle}>Целевая аудитория</h3>
                            <p className={styles.cardDescription}>
                                Только студенты и выпускники, активно ищущие работу или стажировку. 
                                Никаких случайных соискателей.
                            </p>
                        </div>
                        <div className={`${styles.advantageCard} ${styles.card2}`}>
                            <div className={styles.cardNumber}>2</div>
                            <h3 className={styles.cardTitle}>Прозрачная оплата</h3>
                            <p className={styles.cardDescription}>
                                Платите только за отклики (20 руб. за каждый). 
                                Никаких скрытых платежей или подписок.
                            </p>
                        </div>
                        <div className={`${styles.advantageCard} ${styles.card3}`}>
                            <div className={styles.cardNumber}>3</div>
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
                            <h2 className={styles.sectionTitle}>Описание услуги</h2>
                            <p className={styles.serviceText}>
                                Сервис DESC Education предоставляет возможность публикации вакансий 
                                для студентов и выпускников вузов. Наша платформа соединяет работодателей 
                                с талантливыми молодыми специалистами.
                            </p>
                            <h3 className={styles.serviceSubtitle}>Что входит в услугу:</h3>
                            <ul className={styles.serviceList}>
                                <li>Размещение информации о вакансии в разделе "Карьера"</li>
                                <li>Доступ к базе активных соискателей-студентов</li>
                                <li>Получение и обработка откликов от кандидатов</li>
                                <li>Управление вакансиями через личный кабинет</li>
                            </ul>
                        </div>
                        <div className={styles.serviceProperties}>
                            <h3 className={styles.propertiesTitle}>Потребительские свойства</h3>
                            <div className={styles.propertiesList}>
                                <div className={styles.propertyItem}>
                                    <h4>Целевая аудитория</h4>
                                    <p>Только студенты и выпускники, заинтересованные в работе и стажировках.</p>
                                </div>
                                <div className={styles.propertyItem}>
                                    <h4>Гибкая оплата</h4>
                                    <p>Платите только за реальные отклики (20 руб. за каждый).</p>
                                </div>
                                <div className={styles.propertyItem}>
                                    <h4>Быстрый результат</h4>
                                    <p>Среднее время получения первого отклика — менее 24 часов.</p>
                                </div>
                                <div className={styles.propertyItem}>
                                    <h4>Простое управление</h4>
                                    <p>Удобный интерфейс для работы с вакансиями.</p>
                                </div>
                                <div className={styles.propertyItem}>
                                    <h4>Безлимитный срок</h4>
                                    <p>Вакансия остается активной до ручного закрытия.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Стоимость услуги */}
            <section className={styles.pricingSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Стоимость услуги</h2>
                    <div className={styles.pricingContent}>
                        <div className={styles.priceCard}>
                            <div className={styles.priceAmount}>20 ₽</div>
                            <div className={styles.priceLabel}>За каждый отклик</div>
                        </div>
                        <div className={styles.pricingInfo}>
                            <div className={styles.pricingItem}>
                                <span className={styles.pricingLabel}>Минимальное пополнение:</span>
                                <span className={styles.pricingValue}>1000 рублей</span>
                            </div>
                            <div className={styles.pricingItem}>
                                <span className={styles.pricingLabel}>Среднее количество откликов:</span>
                                <span className={styles.pricingValue}>15-20 на вакансию</span>
                            </div>
                            <div className={styles.pricingItem}>
                                <span className={styles.pricingLabel}>Ожидаемые расходы:</span>
                                <span className={styles.pricingValue}>300-400 рублей</span>
                            </div>
                            <div className={styles.pricingExample}>
                                <h4>Пример расчета:</h4>
                                <p>При получении 25 откликов на вакансию: 25 откликов × 20 ₽ = 500 ₽</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>
                            Закрывайте вакансии в 3 раза быстрее!
                        </h2>
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
            </section>

            {/* Контакты */}
            <section className={styles.contactsSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Наши контакты</h2>
                    <div className={styles.contactsGrid}>
                        <div className={`${styles.contactCard} ${styles.emailCard}`}>
                            <div className={styles.contactIcon}>📧</div>
                            <h3 className={styles.contactTitle}>Электронная почта</h3>
                            <p className={styles.contactDescription}>Пишите нам по любым вопросам</p>
                            <a href="mailto:support@desc-education.ru" className={styles.contactLink}>
                                support@desc-education.ru
                            </a>
                        </div>
                        <div className={`${styles.contactCard} ${styles.phoneCard}`}>
                            <div className={styles.contactIcon}>📞</div>
                            <h3 className={styles.contactTitle}>Телефон</h3>
                            <p className={styles.contactDescription}>Звоните в рабочее время</p>
                            <a href="tel:+79911320757" className={styles.contactLink}>
                                +7 (991) 132-07-57
                            </a>
                        </div>
                        <div className={`${styles.contactCard} ${styles.socialCard}`}>
                            <div className={styles.contactIcon}>🌐</div>
                            <h3 className={styles.contactTitle}>Социальные сети</h3>
                            <p className={styles.contactDescription}>Подпишитесь на наши обновления</p>
                            <div className={styles.socialLinks}>
                                <a href="https://vk.com/desc_edu" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                    VK
                                </a>
                                <a href="https://t.me/studio_desc" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                    Telegram
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