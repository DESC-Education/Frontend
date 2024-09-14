"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import "./page.scss";
import Image from "next/image";
import Link from "next/link";
import { yearsOfEducation } from "../_utils/constants";
import ProfileStatus from "./ProfileStatus/ProfileStatus";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { getBeautifiedPhone } from "../_utils/utils";

export default function Home() {
    const {
        profileVerification,
        isProfileLoading,
        companyProfile,
        studentProfile,
        user,
    } = useTypesSelector((state) => state.userReducer);

    if (profileVerification.status !== "verified") {
        return <ProfileStatus profileVerification={profileVerification} />;
    }

    return (
        <div
            className={classNames(styles.userContainer, {
                [styles.loading]: isProfileLoading,
            })}
        >
            {user.role === "student" ? (
                <div>
                    <div className={styles.mainInfo}>
                        <div
                            className={classNames(
                                styles.speciality,
                                "title fz48",
                            )}
                        >
                            {studentProfile.profession}
                        </div>
                        <div
                            className={classNames(
                                styles.level,
                                `level${studentProfile.level.value}`,
                            )}
                        >
                            <p className="text fw500">
                                {studentProfile.level.name}
                            </p>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <p
                            className={classNames(
                                styles.descriptionText,
                                "title",
                            )}
                        >
                            О cебе
                        </p>
                        <p
                            className={classNames(
                                styles.descriptionText,
                                "text",
                            )}
                        >
                            {studentProfile?.description}
                        </p>
                        {studentProfile?.emailVisibility && user.email && (
                            <Link
                                href={`mailto:${user.email}`}
                                className={styles.contact}
                            >
                                <Image
                                    src="/icons/mail.png"
                                    alt="phone"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">{user.email}</p>
                            </Link>
                        )}
                        {studentProfile?.phoneVisibility &&
                            studentProfile.phone && (
                                <Link
                                    href={`tel:${studentProfile.phone}`}
                                    className={styles.contact}
                                >
                                    <Image
                                        src="/icons/tel.png"
                                        alt="phone"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text">
                                        {getBeautifiedPhone(
                                            studentProfile.phone,
                                        )}
                                    </p>
                                </Link>
                            )}
                        {studentProfile?.telegramLink && (
                            <Link
                                target="_blank"
                                rel="noreferrer"
                                href={
                                    "https:/t.me/" +
                                    studentProfile?.telegramLink
                                }
                                className={styles.contact}
                            >
                                <Image
                                    src="/icons/tg.png"
                                    alt="telegram"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">
                                    @{studentProfile.telegramLink}
                                </p>
                            </Link>
                        )}
                        {studentProfile?.vkLink && (
                            <Link
                                target="_blank"
                                rel="noreferrer"
                                href={"https:/vk.com/" + studentProfile?.vkLink}
                                className={styles.contact}
                            >
                                <Image
                                    src="/icons/vk.png"
                                    alt="vk"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">{studentProfile.vkLink}</p>
                            </Link>
                        )}

                        <div className={styles.education}>
                            <p
                                className={classNames(
                                    styles.educationTitle,
                                    "title",
                                )}
                            >
                                Образование
                            </p>
                            <p
                                className={classNames(
                                    styles.yearOfEducation,
                                    "text gray fz20",
                                )}
                            >
                                {studentProfile.admissionYear} -{" "}
                                {studentProfile.admissionYear! +
                                    yearsOfEducation[
                                        studentProfile.specialty.type
                                    ]}{" "}
                                гг.
                            </p>
                            <p
                                className={classNames(
                                    styles.university,
                                    "title fz28",
                                )}
                            >
                                {studentProfile.university.name}
                            </p>
                            <p
                                className={classNames(
                                    styles.institute,
                                    "text fw500",
                                )}
                            >
                                {studentProfile.faculty.name}
                            </p>
                            <p
                                className={classNames(
                                    styles.speciality,
                                    "text gray fw500",
                                )}
                            >
                                {studentProfile.specialty.name}
                            </p>
                        </div>

                        <div className={styles.education}>
                            <p
                                className={classNames(
                                    styles.educationTitle,
                                    "title",
                                )}
                            >
                                Навыки
                            </p>
                            <div className={styles.skills}>
                                {studentProfile.skills.map((skill, index) => (
                                    <div key={index} className={styles.skill}>
                                        <p className="text fw500">
                                            {skill.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!!studentProfile.leadTaskCategories?.length && (
                        <div className={styles.rubrics}>
                            <p
                                className={classNames(
                                    styles.rubricsTitle,
                                    "title",
                                )}
                            >
                                Лидирующие категории решенных задач
                            </p>
                            <div className={styles.circles}>
                                {studentProfile.leadTaskCategories &&
                                    studentProfile.leadTaskCategories.map(
                                        (category, index) => (
                                            <div
                                                key={index}
                                                className={styles.circleWrapper}
                                            >
                                                <div
                                                    className={styles.circle}
                                                    style={{
                                                        background: `conic-gradient(#19282C ${category.percent * 100}%, #e0e0e0 0%)`,
                                                    }}
                                                >
                                                    <span
                                                        className={classNames(
                                                            styles.percentage,
                                                            "title",
                                                        )}
                                                    >
                                                        {category.percent * 100}%
                                                    </span>
                                                </div>
                                                <p className="text fw500">
                                                    {category.name}
                                                </p>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </div>
                    )}

                    {/* <div className={styles.tips}>
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
                    </div> */}
                </div>
            ) : (
                <div>
                    <div className={styles.mainInfo}>
                        <div
                            className={classNames(
                                styles.speciality,
                                "title fz48",
                            )}
                        >
                            {companyProfile.companyName}
                        </div>
                        {/* <div className={styles.level}> */}
                        {/* <p className="text fw500">Средний уровень</p> */}
                        {/* </div> */}
                    </div>
                    <div className={styles.description}>
                        <p
                            className={classNames(
                                styles.descriptionText,
                                "title",
                            )}
                        >
                            О компании
                        </p>
                        <p
                            className={classNames(
                                styles.descriptionText,
                                "text",
                            )}
                        >
                            {companyProfile.description}
                        </p>
                        {companyProfile.phoneVisibility &&
                            companyProfile.phone && (
                                <div className={styles.contact}>
                                    <Image
                                        src="/icons/tel.png"
                                        alt="phone"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text">
                                        {getBeautifiedPhone(
                                            companyProfile.phone,
                                        )}
                                    </p>
                                </div>
                            )}
                        {companyProfile.emailVisibility && user.email && (
                            <div className={styles.contact}>
                                <Image
                                    src="/icons/mail.png"
                                    alt="phone"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">{user.email}</p>
                            </div>
                        )}
                        {companyProfile.telegramLink && (
                            <div className={styles.contact}>
                                <Link
                                    href={
                                        "https:/t.me/" +
                                        companyProfile.telegramLink
                                    }
                                    className={styles.contact}
                                >
                                    <Image
                                        src="/icons/tg.png"
                                        alt="telegram"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text">
                                        @{companyProfile.telegramLink}
                                    </p>
                                </Link>
                            </div>
                        )}
                        {companyProfile.vkLink && (
                            <div className={styles.contact}>
                                <Link
                                    href={
                                        "https:/vk.com/" +
                                        companyProfile.vkLink
                                    }
                                    className={styles.contact}
                                >
                                    <Image
                                        src="/icons/vk.png"
                                        alt="vk"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text">
                                        {companyProfile.vkLink}
                                    </p>
                                </Link>
                            </div>
                        )}

                        <div className={styles.education}>
                            <p
                                className={classNames(
                                    styles.educationTitle,
                                    "title",
                                )}
                            >
                                Навыки, используемые в компании
                            </p>
                            <div className={styles.skills}>
                                {companyProfile.skills.map((skill, index) => (
                                    <div key={index} className={styles.skill}>
                                        <p className="text fw500">
                                            {skill.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {companyProfile.leadTaskCategories?.length && (
                        <div className={styles.rubrics}>
                            <p
                                className={classNames(
                                    styles.rubricsTitle,
                                    "title",
                                )}
                            >
                                Лидирующие категории созданных задач
                            </p>
                            <div className={styles.circles}>
                                {companyProfile.leadTaskCategories &&
                                    companyProfile.leadTaskCategories.map(
                                        (category, index) => (
                                            <div
                                                key={index}
                                                className={styles.circleWrapper}
                                            >
                                                <div
                                                    className={styles.circle}
                                                    style={{
                                                        background: `conic-gradient(#19282C ${category.percent * 100}%, #e0e0e0 0%)`,
                                                    }}
                                                >
                                                    <span
                                                        className={classNames(
                                                            styles.percentage,
                                                            "title",
                                                        )}
                                                    >
                                                        {category.percent * 100}%
                                                    </span>
                                                </div>
                                                <p className="text fw500">
                                                    {category.name}
                                                </p>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </div>
                    )}

                    {/* <div className={styles.tips}>
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
                    </div> */}
                </div>
            )}
        </div>
    );
}
