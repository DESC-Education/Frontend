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
                    <Link href={"/"} className={styles.backButton}>
                        <Image src="/icons/backIcon.svg" width={15} height={15} alt="arrow-left" className={styles.img} />
                        <p className="text green fz20">Назад</p>
                    </Link>
                    <div className={styles.projectInfo}>
                        <p className={classNames("title", styles.title)}>Название проекта</p>
                        <div className={styles.author}>
                            <Image src="/images/userImage1.png" width={40} height={40} alt="user" />
                            <p className="text gray">Имя автора</p>
                        </div>
                    </div>
                </div>
                <div className={styles.projectDescription}>
                    <p className={classNames("text fw500", styles.text)}>Redis — это key-value хранилище. Если провести аналогию с питоновскими типами — словарь, который отлично подходит для хранения кэша. Удобно использовать для межкомпонентного взаимодействия.
                        MongoDB — это хранилище JSON-документов, по такой же аналогии — список json’ов. Отлично подходит, если у вас где‑то генерируется большое количество данных, которые вы не хотели бы терять. Например, если бы все эти данные писали в реальном времени в реляционную: это долго, могут случится ошибки записи.
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
                            <SwiperSlide className={styles.swiperSlide} key={index}>
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
