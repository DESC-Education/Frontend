import classNames from "classnames";
import styles from "./page.module.scss";
// import { useTypesSelector } from "../_hooks/useTypesSelector";
import { IUser } from "../_types";
import Image from "next/image";
import Link from "next/link";
import TipCard, { TipTypeBackground } from "../_components/TipCard/TipCard";
import { getProfile } from "../_http/API/profileApi";
import { useEffect } from "react";

export default async function Home() {
    // const { user, isAuth } = useTypesSelector((state) => state.userReducer);
    // const { isLoading } = useTypesSelector((state) => state.contentReducer);

    const { profile, message } = await getProfile();

    console.log(profile);
    

    // if (!profile?.isVerified) return null;

    // const user = { id: "1", mail: "mail@mail.com", isVerified: true, role: "student", isOnline: true, isBanned: false, type: "student", data: { id: "1", isVerified: true, name: "Петя", surname: "Петров", logoImg: { id: "1", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Я разработчик веб-приложений и создаю простые и удобные веб-сайты для моих клиентов. Я люблю использовать технологии React, Next.js, TypeScript, Tailwind CSS, Node.js и MongoDB. Я обладаю навыками в разработке веб-приложений для большинства служб и проектов.", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "Alexsey_2004" } } as IUser;

    const rubrics = [
        { label: "Разработка", percentage: 75 },
        { label: "Веб-дизайн", percentage: 90 },
        { label: "Верстка", percentage: 32 },
    ];

    if (!profile) return null;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.mainInfo}>
                <div className={classNames(styles.speciality, "title fz48")}>
                    Веб дизайнер
                </div>
                <div className={styles.level}>
                    <p className="text fw500">Средний уровень</p>
                </div>
            </div>
            <div className={styles.description}>
                <p className={classNames(styles.descriptionText, "title")}>
                    О cебе
                </p>
                <p className={classNames(styles.descriptionText, "text")}>
                    {profile.description}
                </p>
                <div className={styles.contact}>
                    <Image
                        src="/icons/phoneIcon.svg"
                        alt="phone"
                        width={35}
                        height={35}
                    />
                    <p className="text">{profile.phone}</p>
                </div>
                <div className={styles.contact}>
                    <Link
                        href={"https:/t.me/" + profile.telegramLink}
                        className={styles.contact}
                    >
                        <Image
                            src="/icons/telegramIcon.svg"
                            alt="telegram"
                            width={35}
                            height={35}
                        />
                        <p className="text">{profile.telegramLink}</p>
                    </Link>
                </div>
                <div className={styles.education}>
                    <p className={classNames(styles.educationTitle, "title")}>
                        Образование
                    </p>
                    <p
                        className={classNames(
                            styles.yearOfEducation,
                            "text gray fz20",
                        )}
                    >
                        2024
                    </p>
                    <p className={classNames(styles.university, "title")}>
                        Сибирский федеральный университет
                    </p>
                    <p className={classNames(styles.institute, "text fw500")}>
                        Институт космических и информационных технологий
                    </p>
                    <p
                        className={classNames(
                            styles.speciality,
                            "text gray fw500",
                        )}
                    >
                        Прикладная информатика
                    </p>
                </div>
            </div>

            <div className={styles.rubrics}>
                <p className={classNames(styles.rubricsTitle, "title")}>
                    Рубрики
                </p>
                <div className={styles.circles}>
                    {rubrics.map((rubric, index) => (
                        <div key={index} className={styles.circleWrapper}>
                            <div
                                className={styles.circle}
                                style={{
                                    background: `conic-gradient(#19282C ${rubric.percentage}%, #e0e0e0 0%)`,
                                }}
                            >
                                <span
                                    className={classNames(
                                        styles.percentage,
                                        "title",
                                    )}
                                >
                                    {rubric.percentage}%
                                </span>
                            </div>
                            <p className="text fw500">{rubric.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.tips}>
                <TipCard
                    title="Совет 1"
                    description="Не стоит кушать желтый снег"
                    image="/images/tip2Image.png"
                    BackgroundType={TipTypeBackground.GREEN}
                />
                <TipCard
                    title="Совет 2"
                    description="Не стоит кушать желтый снег"
                    image="/images/tip2Image.png"
                />
            </div>
        </div>
    );
}
