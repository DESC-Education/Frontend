"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./swiper.scss";
import BackButton from "@/app/_components/ui/BackButton/BackButton";

const Project = () => {
    const files = [
        {
            id: "1",
            name: "file1.txt",
            path: "/images/projectCardImage1.png",
            type: "png",
        },
        {
            id: "2",
            name: "file2.txt",
            path: "/images/projectCardImage2.png",
            type: "png",
        },
        {
            id: "3",
            name: "file3.txt",
            path: "/images/projectCardImage3.png",
            type: "png",
        },
    ];

    return (
        <div className="container">
            <div className={styles.project}>
                <div className={styles.projectHeader}>
                    <BackButton />
                    <div className={styles.projectInfo}>
                        <p className={classNames("title", styles.title)}>
                            Крутой проект студента!
                        </p>
                        <div className={styles.author}>
                            <Image
                                src="/images/userImage1.png"
                                width={40}
                                height={40}
                                alt="user"
                            />
                            <p className="text gray">Иван Иванов</p>
                        </div>
                    </div>
                </div>
                <div className={styles.projectDescription}>
                    <p className={classNames("text fw500", styles.text)}>
                        Здесь будет размещен детализированный текст вашего
                        проекта, включающий описание его целей, задач, методов
                        исследования, этапов выполнения, а также результаты и
                        выводы. В этом разделе вы сможете подробно изложить,
                        какие проблемы решает ваш проект, какие технологии и
                        подходы используются, и как вы достигли поставленных
                        целей. Также здесь будут приведены примеры, графики,
                        диаграммы или другие визуальные материалы, которые
                        помогут лучше понять суть вашей работы и ее результаты.
                    </p>
                </div>
                <div className={styles.projectFiles}>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={15}
                        pagination={{ clickable: true, dynamicBullets: false }}
                        modules={[Pagination]}
                        className={styles.swiper}
                    >
                        {files.map((file, index) => (
                            <SwiperSlide
                                className={styles.swiperSlide}
                                key={index}
                            >
                                <div className={styles.file}>
                                    <img src={file.path} alt="icon" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default Project;
