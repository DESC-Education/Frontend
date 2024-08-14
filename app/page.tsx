"use client";

import Image from "next/image";
import Button from "./components/ui/Button/Button";
import ProjectCard from "./components/ProjectCard/ProjectCard";
import { useContext, useState } from "react";
import { ModalContext } from "./context/ModalContext";
import styles from "./page.module.scss";


export default function Home() {

    const projects = [
        { id: 1, imgSrc: '/icons/projectCardImage1.png', nickname: 'nickname12', userImage: "/icons/userImage1.png" },
        { id: 2, imgSrc: '/icons/projectCardImage2.png', nickname: 'nickname12', userImage: "/icons/userImage2.png" },
        { id: 3, imgSrc: '/icons/projectCardImage3.png', nickname: 'nickname12', userImage: "/icons/userImage3.png" },
        { id: 4, imgSrc: '/icons/projectCardImage4.png', nickname: 'nickname12', userImage: "/icons/userImage4.png" },
    ];


    const partners = [
        { id: 1, logo: '/icons/IKITlogo.svg', name: 'ИКИТ', description: 'Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач' },
        { id: 2, logo: '', name: 'ПОЛИТЕХНИЧЕСКИЙ ИНСТИТУТ', description: 'Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач' },
        { id: 3, logo: 'ikit.png', name: 'ИКИТ', description: 'Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач' },
        { id: 4, logo: 'polytechnic.png', name: 'ПОЛИТЕХНИЧЕСКИЙ ИНСТИТУТ', description: 'Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач' }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? partners.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === partners.length - 1 ? 0 : prevIndex + 1));
    };





    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <Image
                    src="/icons/headerLogo.svg"
                    alt="Logo"
                    width={125}
                    height={53}
                />
                <nav>
                    <div className={styles.navList}>
                        <Button type="primary">Вход</Button>
                        <Button type="secondary">Регистрация</Button>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <p className="title fz36">
                        Студенты создают. Компании растут
                    </p>
                    <h2 className="title fz48">
                        Один шаг к открытию возможностей
                    </h2>
                    <div className={styles.buttons}>
                        <Button type="tetraity">Студент</Button>
                        <Button type="tetraity">Компания</Button>
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
                        <p className="text gray fw300">
                            Desc Education - инновационная платформа,
                            соединяющая студентов IT-специальностей с
                            компаниями, которые нуждаются в IT-решениях.
                        </p>
                        <p className="text gray fw300">
                            Наша миссия — сделать процесс поиска талантливых
                            специалистов и решения задач в области
                            информационных технологий более эффективным и
                            удобным для всех сторон.
                        </p>
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
                            <div className={styles.stepNumber}>
                                <p>1</p>
                            </div>
                            <h3 className="text fw500">
                                Компания оставляет задачу на решение
                            </h3>
                        </div>
                        <p className="text gray fz20">
                            Компании имеют возможность найти талантливых
                            студентов, готовых помочь в решении различных задач,
                            что поможет укрепить их команду и расширить
                            профессиональные возможности.
                        </p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>
                                <p>2</p>
                            </div>
                            <h3 className="text fw500">
                                Студент предлагает решение задачи
                            </h3>
                        </div>
                        <p className="text gray fz20">
                            Студенты получают возможность применить свои знания
                            на практике, решая задачи, которые имеют реальное
                            значение для компании.
                        </p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>
                                <p>3</p>
                            </div>
                            <h3 className="text fw500">
                                Формирование портфолио
                            </h3>
                        </div>
                        <p className="text gray fz20">
                            Участие в проектах на нашей платформе позволяет
                            студентам создать впечатляющее портфолио работ,
                            которое можно продемонстрировать работодателям.
                        </p>
                    </div>
                </div>
                <div className={styles.instructions}>
                    <Button type="tetraity">Инструкция для студента</Button>
                    <Button type="tetraity">Инструкция для компании</Button>
                </div>
            </section>

            {/* Opportunities Section */}
            <section className={styles.opportunities}>
                <h2 className="title fz48">Возможности</h2>
                <div className={styles.container}>
                    <div className={`${styles.block} ${styles.studentsBlock}`}>
                        <h3 className="title fz48">Для студентов</h3>
                        <ul>
                            <li className="text">
                                Поиск и выполнение реальных задач от компаний
                            </li>
                            <li className="text">Формирование портфолио</li>
                            <li className="text">
                                Просмотр и отклик на вакансии
                            </li>
                            <li className="text">Доступ к учебным ресурсам</li>
                            <li className="text">
                                Форум для общения со студентами и компаниями
                            </li>
                        </ul>
                    </div>
                    <div className={`${styles.block} ${styles.companiesBlock}`}>
                        <h3 className="title fz48">Для компаний</h3>
                        <ul>
                            <li className="text">
                                Публикация задач на решение
                            </li>
                            <li className="text">
                                Поиск потенциальных работников
                            </li>
                            <li className="text">
                                Публикация актуальных вакансий
                            </li>
                            <li className="text">
                                Доступ к уникальным ресурсам
                            </li>
                            <li className="text">
                                Форум для общения со студентами и другими
                                компаниями
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className={styles.studentProjects}>
                <h2 className="title fz48">Проекты студентов</h2>
                <div className={styles.projectsContainer}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            nickName={project.nickname}
                            image={project.imgSrc}
                            userIcon={project.userImage}
                        />
                    ))}
                </div>
                <div className={styles.pagination}>
                    {projects.map((_, index) => (
                        <span key={index} className={`${styles.bullet} ${index === 0 ? styles.active : ''}`}></span>
                    ))}
                </div>
            </section>

            {/* Partners Section */}
            <section className={styles.partners}>
                <h2 className="title fz48">Партнеры</h2>
                <div className={styles.carousel}>
                    <button onClick={handlePrev} className={styles.arrowButton}>
                        <span>&larr;</span>
                    </button>
                    <div className={styles.partnerDetails}>
                        <div className={styles.partnerLogo} >
                            <img src={partners[activeIndex].logo} alt={partners[activeIndex].name}/>
                        </div>
                        <div className={styles.partnerInfo}>
                            <h3 className="title fz48">{partners[activeIndex].name}</h3>
                            <p className="text">{partners[activeIndex].description}</p>
                        </div>
                    </div>
                    <button onClick={handleNext} className={styles.arrowButton}>
                        <span>&rarr;</span>
                    </button>
                </div>
                <div className={styles.partnerLogos}>
                    {partners.map((partner, index) => (
                        <img
                            key={partner.id}
                            src={partner.logo}
                            alt={partner.name}
                            className={`${styles.smallLogo} ${index === activeIndex ? styles.active : ''}`}
                        />
                    ))}
                </div>
            </section>

            {/* Footer Section */}
            <footer className={styles.footer}>
                <p>DIESC © 2024</p>
            </footer>
        </div>
    );
}
