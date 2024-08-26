"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";
import classNames from "classnames";


export default function StudentsListPage() {

    const students = [
        {
            id: "1",
            isVerified: false,
            admissionYear: 2023,
            description: "Описание студента",
            firstName: "Иван",
            lastName: "Иванов",
            logoImg: "/images/userImage10.png",
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
            timezone: 3,
            university: {
                id: "1",
                name: "Университет имени X",
                city: {
                    id: "1",
                    name: "город X",
                    region: "Регион X",
                }
            },
            speciality: {
                id: "1",
                name: "Специальность X",
                type: "speciality",
                code: "code",
            },
            faculty: {
                id: "1",
                name: "Факультет X",
                university: "Университет имени X",
            },
            formOfEducation: "bachelor",
            educationProgram: "bachelor",
            telegramLink: "https://t.me/joinchat/asdfasdf",
            vkLink: "https://vk.com/join/asdfasdf",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            },
            skills: [
                {
                    id: "1",
                    name: "Навык X",
                    percent: 50,
                },
                {
                    id: "2",
                    name: "Навык Y",
                    percent: 50,
                },
            ],
        },
        {
            id: "2",
            isVerified: true,
            admissionYear: 2023,
            description: "Описание студента",
            firstName: "Петр",
            lastName: "Петров",
            logoImg: "/images/userImage10.png",
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
            timezone: 3,
            university: {
                id: "1",
                name: "Университет имени X",
                city: {
                    id: "1",
                    name: "город X",
                    region: "Регион X",
                }
            },
            speciality: {
                id: "1",
                name: "Специальность X",
                type: "speciality",
                code: "code",
            },
            faculty: {
                id: "1",
                name: "Факультет X",
                university: "Университет имени X",
            },
            formOfEducation: "bachelor",
            educationProgram: "bachelor",
            telegramLink: "https://t.me/joinchat/asdfasdf",
            vkLink: "https://vk.com/join/asdfasdf",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            },
            skills: [
                {
                    id: "1",
                    name: "Навык X",
                    percent: 50,
                },
                {
                    id: "2",
                    name: "Навык Y",
                    percent: 50,
                },
            ],
        },
        {
            id: "3",
            isVerified: true,
            admissionYear: 2023,
            description: "Описание студента",
            firstName: "Петр",
            lastName: "Петров",
            logoImg: "/images/userImage10.png",
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
            timezone: 3,
            university: {
                id: "1",
                name: "Университет имени X",
                city: {
                    id: "1",
                    name: "город X",
                    region: "Регион X",
                }
            },
            speciality: {
                id: "1",
                name: "Специальность X",
                type: "speciality",
                code: "code",
            },
            faculty: {
                id: "1",
                name: "Факультет X",
                university: "Университет имени X",
            },
            formOfEducation: "bachelor",
            educationProgram: "bachelor",
            telegramLink: "https://t.me/joinchat/asdfasdf",
            vkLink: "https://vk.com/join/asdfasdf",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            },
            skills: [
                {
                    id: "1",
                    name: "Навык X",
                    percent: 10,
                },
            ],
        }
    ];

    return (
        <div className="container">
            <div className={styles.search}>
                <input type="text" placeholder="Поиск" className="text" />
            </div>
            <div className={styles.studentsList}>
                {students.map((student) => (
                    <Link href={`/admin-panel/students-list/${student.id}`} key={student.id} className={styles.studentLink}>
                        <div className={styles.student}>
                            <p className={classNames("text fw500", styles.id)}>#{student.id}</p>
                            <Image src="/images/userImage10.png" alt="student" width={50} height={50} />
                            <div className={styles.info}>
                                <p className={classNames("text fw500", styles.name)}>{student.firstName} {student.lastName}</p>
                                <p className={classNames("text gray fz16", styles.education)}>{student.university.name} {student.faculty.name} {student.speciality.name}</p>
                            </div>
                            <div className={styles.status}>
                                {student.isVerified ? <p className={classNames("text green fz16 fw500", styles.verified)}>Проверен</p> : <p className={classNames("text red fz16 fw500", styles.notVerified)}>Не проверен</p>}
                                
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}