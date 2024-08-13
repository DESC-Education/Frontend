"use client";

import Image from "next/image";
import Button from "./components/ui/Button/Button";
import { useContext, useState } from "react";
import { ModalContext } from "./context/ModalContext";
import styles from "./page.module.scss";

export default function Home() {
    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <Image src="/icons/headerLogo.svg" alt="Logo" width={125} height={53} />
                <nav>
                    <div className={styles.navList}>
                        <Button text="Вход" type="primary" />
                        <Button text="Регистрация" type="secondary" />
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <p className="title fz36">Студенты создают. Компании растут</p>
                    <h2 className="title fz48">Один шаг к открытию возможностей</h2>
                    <div className={styles.buttons}>
                        <Button text="Студент" type="tetraity" />
                        <Button text="Компания" type="tetraity" />
                    </div>
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


            {/* About Us Section */}
            <section className={styles.aboutUs}>
                <div className={styles.aboutUsContent}>
                    <div className={styles.textBlock}>
                        <p className="title fz48">Кто мы такие?</p>
                        <p className="text gray fw300">Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях.</p>
                        <p className="text gray fw300">Наша миссия — сделать процесс поиска талантливых специалистов и решения задач в области информационных технологий более эффективным и удобным для всех сторон.</p>
                    </div>
                    <div className={styles.keywordsBlock}>
                        <div className={styles.keyword}>🚀 Большие проекты</div>
                        <div className={styles.keyword}>📈 Карьерный рост</div>
                        <div className={styles.keyword}>🔥 Реальный опыт</div>
                        <div className={styles.keyword}>💼 Трудоустройство</div>
                        <div className={styles.keyword}>🏆 Команда мечты</div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className={styles.howItWorks}>
                <h2 className="title fz48">Как это работает</h2>
                <div className={styles.stepsContainer}>
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}><p>1</p></div>
                            <h3 className="text fw500">Компания оставляет задачу на решение</h3>
                        </div>
                        <p className="text gray fz20">Компании имеют возможность найти талантливых студентов, готовых помочь в решении различных задач, что поможет укрепить их команду и расширить профессиональные возможности.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}><p>2</p></div>
                            <h3 className="text fw500">Студент предлагает решение задачи</h3>
                        </div>
                        <p className="text gray fz20">Студенты получают возможность применить свои знания на практике, решая задачи, которые имеют реальное значение для компании.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}><p>3</p></div>
                            <h3 className="text fw500">Формирование портфолио</h3>
                        </div>
                        <p className="text gray fz20">Участие в проектах на нашей платформе позволяет студентам создать впечатляющее портфолио работ, которое можно продемонстрировать работодателям.</p>
                    </div>
                </div>
                <div className={styles.instructions}>
                    <Button text="Инструкция для студента" type="tetraity" />
                    <Button text="Инструкция для компании" type="tetraity" />
                </div>
            </section>

            {/* Opportunities Section */}
            <section className={styles.opportunities}>
                <h2 className="title fz48">Возможности</h2>
                <div className={styles.container}>
                    <div className={`${styles.block} ${styles.studentsBlock}`}>
                        <h3 className="title fz48">Для студентов</h3>
                        <ul>
                            <li className="text">Поиск и выполнение реальных задач от компаний</li>
                            <li className="text">Формирование портфолио</li>
                            <li className="text">Просмотр и отклик на вакансии</li>
                            <li className="text">Доступ к учебным ресурсам</li>
                            <li className="text">Форум для общения со студентами и компаниями</li>
                        </ul>
                    </div>
                    <div className={`${styles.block} ${styles.companiesBlock}`}>
                        <h3 className="title fz48">Для компаний</h3>
                        <ul>
                            <li className="text">Публикация задач на решение</li>
                            <li className="text">Поиск потенциальных работников</li>
                            <li className="text">Публикация актуальных вакансий</li>
                            <li className="text">Доступ к уникальным ресурсам</li>
                            <li className="text">Форум для общения со студентами и другими компаниями</li>
                        </ul>
                    </div>
                </div>
            </section>



            {/* Projects Section */}
            <section className={styles.projects}>
                <h2>Проекты студентов</h2>
                <div className={styles.projectList}>
                    <div className={styles.projectItem}>
                        <Image src="/path-to-project1.png" alt="Проект 1" width={200} height={150} />
                        <p>Проект 1</p>
                    </div>
                    <div className={styles.projectItem}>
                        <Image src="/path-to-project2.png" alt="Проект 2" width={200} height={150} />
                        <p>Проект 2</p>
                    </div>
                    <div className={styles.projectItem}>
                        <Image src="/path-to-project3.png" alt="Проект 3" width={200} height={150} />
                        <p>Проект 3</p>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className={styles.partners}>
                <h2>Партнеры</h2>
                <div className={styles.partnerLogos}>
                    <Image src="/path-to-logo.png" alt="ИКИТ СФУ" width={100} height={50} />
                    <Image src="/path-to-logo.png" alt="VENIT" width={100} height={50} />
                    <Image src="/path-to-logo.png" alt="VENIT" width={100} height={50} />
                    <Image src="/path-to-logo.png" alt="VENIT" width={100} height={50} />
                </div>
            </section>

            {/* Footer Section */}
            <footer className={styles.footer}>
                <p>DIESC © 2024</p>
            </footer>
        </div>
    );
}
