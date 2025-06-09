"use client";

import Image from "next/image";
import { useContext, useState } from "react";
import styles from "./page.module.scss";
import Button from "./_components/ui/Button/Button";
import classNames from "classnames";
import Header from "./_components/Header/Header";
import CustomSearch from "./_components/ui/CustomSearch/CustomSearch";
import BriefModal from "./_components/modals/BriefModal/BriefModal";
import { ModalContext } from "./_context/ModalContext";
import Link from "next/link";
import ProjectsList from "./_components/ProjectsList/ProjectsList";
import PartnersList from "./_components/PartnersList/PartnersList";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./swiper.scss";
import ProjectCard from "./_components/ProjectsList/ProjectCard/ProjectCard";
import AuthModal from "./_components/modals/AuthModal/AuthModal";
import { useTypesSelector } from "./_hooks/useTypesSelector";

const projects = [
    {
        id: "1",
        img: "/images/projectCardImage1.png",
        name: "nickname12",
        avatar: "/images/userImage1.png",
    },
    {
        id: "2",
        img: "/images/projectCardImage2.png",
        name: "nickname12",
        avatar: "/images/userImage2.png",
    },
    {
        id: "3",
        img: "/images/projectCardImage3.png",
        name: "nickname12",
        avatar: "/images/userImage3.png",
    },
    {
        id: "4",
        img: "/images/projectCardImage4.png",
        name: "nickname12",
        avatar: "/images/userImage4.png",
    },
];

const partners = [
    {
        id: "1",
        logo: "/partners/ikit.jpg",
        name: "ИКИТ СФУ",
        description:
            "ИКИТ активно поддерживает проект, предоставляя информационное сопровождение и необходимые ресурсы для организации мероприятий. Благодаря их участию, студенты получают доступ к современным технологиям и оборудованию для выполнения практических заданий.",
    },
    {
        id: "2",
        logo: "/partners/polytech.jpg",
        name: "ПИ СФУ",
        description:
            "Политехнический институт содействует проекту, помогая устанавливать контакты с новыми партнерами и предоставляя инфраструктуру для образовательных мероприятий. Их поддержка расширяет возможности для студентов, открывая двери к новым знаниям и практическому опыту.",
    },
    {
        id: "3",
        logo: "/partners/iubp.jpg",
        name: "ИУБП СФУ",
        description:
            "Институт управления бизнес-процессами активно участвует в развитии платформы, обеспечивая экспертизу в разработке маркетинговых стратегий и управления цифровым продуктом. Благодаря вовлеченности студентов ИУБП, платформа расширяет аудиторию и внедряет различные подходы в образовательном процессе, делая обучение еще более доступным и эффективным.",
    },
];

export default function Home() {
    const { isAuth } = useTypesSelector((state) => state.userReducer);

    const { showModal } = useContext(ModalContext);

    return (
        <div className={classNames("container", styles.container)}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <p className="title fz36">
                        Студенты создают. Компании растут
                    </p>
                    <h2 className="title fz48">
                        Один шаг к открытию возможностей
                    </h2>
                    {!isAuth && (
                        <div className={styles.buttons}>
                            <Button
                                onClick={() =>
                                    showModal({
                                        content: (
                                            <AuthModal
                                                initRegState="regClient"
                                                initModalState="reg"
                                            />
                                        ),
                                    })
                                }
                                type="primary"
                            >
                                Студент
                            </Button>
                            <Button
                                onClick={() =>
                                    showModal({
                                        content: (
                                            <AuthModal
                                                initRegState="regCompany"
                                                initModalState="reg"
                                            />
                                        ),
                                    })
                                }
                                type="primary"
                            >
                                Компания
                            </Button>
                        </div>
                    )}
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
            </div>

            {/* About Us div */}
            <div className={styles.aboutUs}>
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
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword1,
                                "text fz16 fw500",
                            )}
                        >
                            🚀 Большие проекты
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword2,
                                "text fz16 fw500",
                            )}
                        >
                            📈 Карьерный рост
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword3,
                                "text fz16 fw500",
                            )}
                        >
                            🔥 Реальный опыт
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword4,
                                "text fz16 fw500",
                            )}
                        >
                            💼 Трудоустройство
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword5,
                                "text fz16 fw500",
                            )}
                        >
                            🏆 Команда мечты
                        </div>
                        <img src="images/students.webp" alt="students" />
                    </div>
                </div>
            </div>

            {/* How It Works div */}
            <div className={styles.howItWorks}>
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
                {/* <div className={styles.instructions}>
                    <Button
                        type="primary"
                        onClick={() =>
                            showModal({
                                content: (
                                    <BriefModal initModalState="forStudent" />
                                ),
                            })
                        }
                    >
                        Инструкция для студента
                    </Button>
                    <Button
                        type="primary"
                        onClick={() =>
                            showModal({
                                content: (
                                    <BriefModal initModalState="forCompany" />
                                ),
                            })
                        }
                    >
                        Инструкция для компании
                    </Button>
                </div> */}
            </div>

            {/* Opportunities div */}
            <div className={styles.opportunities}>
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
            </div>

            {/* Projects div */}
            <div className={styles.studentProjects}>
                <h2 className="title fz48">Проекты студентов</h2>
                <div className={styles.projectsContainer}>
                    <ProjectsList projects={projects} />
                </div>
            </div>

            {/* Partners div */}
            <div className={styles.partners}>
                <h2 className="title fz48">Партнеры</h2>
                <PartnersList partners={partners} />
            </div>
        </div>
    );
}
