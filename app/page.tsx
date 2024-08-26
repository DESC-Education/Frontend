"use client";

import Image from "next/image";
import ProjectCard from "./_components/ProjectCard/ProjectCard";
import { useContext, useState } from "react";
import styles from "./page.module.scss";
import Button from "./_components/ui/Button/Button";
import classNames from "classnames";
import Header from "./_components/Header/Header";
import { createProfileCompany, filesTest } from "./_http/API/profileApi";
import CustomSearch from "./_components/ui/CustomSearch/CustomSearch";

const projects = [
    {
        id: 1,
        imgSrc: "/images/projectCardImage1.png",
        nickname: "nickname12",
        userImage: "/images/userImage1.png",
    },
    {
        id: 2,
        imgSrc: "/images/projectCardImage2.png",
        nickname: "nickname12",
        userImage: "/images/userImage2.png",
    },
    {
        id: 3,
        imgSrc: "/images/projectCardImage3.png",
        nickname: "nickname12",
        userImage: "/images/userImage3.png",
    },
    {
        id: 4,
        imgSrc: "/images/projectCardImage4.png",
        nickname: "nickname12",
        userImage: "/images/userImage4.png",
    },
];

const partners = [
    // { id: 1, logo: '/images/IKITlogo.svg', name: 'ИКИТ', description: 'Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач' },
    {
        id: 2,
        logo: "/images/politechlogo.png",
        name: "ПОЛИТЕХНИЧЕСКИЙ ИНСТИТУТ",
        description:
            "Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач",
    },
    {
        id: 3,
        logo: "ikit.png",
        name: "ИКИТ",
        description:
            "Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач",
    },
    {
        id: 4,
        logo: "polytechnic.png",
        name: "ПОЛИТЕХНИЧЕСКИЙ ИНСТИТУТ",
        description:
            "Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях. Наша миссия — сделать процесс поиска талантливых специалистов и решения задач",
    },
];

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? partners.length - 1 : prevIndex - 1,
        );
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === partners.length - 1 ? 0 : prevIndex + 1,
        );
    };

    const [files, setFiles] = useState<FileList>();
    const [tempValue, setTempValue] = useState<string>("1");
    const getValuesTemp = (tempValue: string) => {
        const options1 = [
            {
                value: 1,
                name: "test1",
            },
            {
                value: 2,
                name: "test2",
            },
            {
                value: 3,
                name: "test3",
            },
        ];
        const options2 = [
            {
                value: 5,
                name: "test5",
            },
            {
                value: 6,
                name: "test6",
            },
            {
                value: 7,
                name: "test7",
            },
        ];

        return tempValue === "1" ? options1 : options2;
    };

    return (
        <div className={styles.container}>
            <input
                multiple
                type="file"
                onChange={async (e) => {
                    if (!e.target.files) return;
                    console.log(e.target.files);
                    setFiles(e.target.files);
                }}
            />
            <button
                onClick={async () => {
                    if (!files) return;
                    const formdata = new FormData();
                    for (let i = 0; i < files.length; i++) {
                        console.log("helo?", files[i]);

                        formdata.append("files", files[i]);
                    }
                    // files.forEach((file: File) => formdata.append("files", file));
                    // formdata.append("files", files[0]);
                    const res = await filesTest(formdata);
                    for (let i of formdata.entries()) {
                        console.log(i);
                    }
                    console.log(files, files.length, formdata);
                }}
                className={styles.arrowButton}
            >
                HELOW
            </button>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <p className="title fz36">
                        Студенты создают. Компании растут
                    </p>
                    <h2 className="title fz48">
                        Один шаг к открытию возможностей
                    </h2>
                    <div className={styles.buttons}>
                        <Button type="primary">Студент</Button>
                        <Button type="primary">Компания</Button>
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
                            )}
                        >
                            🚀 Большие проекты
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword2,
                            )}
                        >
                            📈 Карьерный рост
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword3,
                            )}
                        >
                            🔥 Реальный опыт
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword4,
                            )}
                        >
                            💼 Трудоустройство
                        </div>
                        <div
                            className={classNames(
                                styles.keyword,
                                styles.keyword5,
                            )}
                        >
                            🏆 Команда мечты
                        </div>
                        <img src="images/students.png" alt="students" />
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
                <div className={styles.instructions}>
                    <Button type="primary">Инструкция для студента</Button>
                    <Button type="primary">Инструкция для компании</Button>
                </div>
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
                        <span
                            key={index}
                            className={`${styles.bullet} ${
                                index === 0 ? styles.active : ""
                            }`}
                        ></span>
                    ))}
                </div>
            </div>

            {/* Partners div */}
            <div className={styles.partners}>
                <h2 className="title fz48">Партнеры</h2>
                <div className={styles.carousel}>
                    <button onClick={handlePrev} className={styles.arrowButton}>
                        <span>&larr;</span>
                    </button>
                    <div className={styles.partnerDetails}>
                        <div className={styles.partnerLogo}>
                            <img
                                src={partners[activeIndex].logo}
                                alt={partners[activeIndex].name}
                            />
                        </div>
                        <div className={styles.partnerInfo}>
                            <h3 className="title fz48">
                                {partners[activeIndex].name}
                            </h3>
                            <p className="text">
                                {partners[activeIndex].description}
                            </p>
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
                            className={`${styles.smallLogo} ${
                                index === activeIndex ? styles.active : ""
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Footer div */}
            <footer className={styles.footer}>
                <p>DIESC © 2024</p>
            </footer>
        </div>
    );
}
