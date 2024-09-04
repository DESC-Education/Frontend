"use client";

import classNames from "classnames";
import styles from "./page.module.scss";
import {
    ICompanyProfile,
    IStudentProfile,
    IUser,
    RoleStudent,
} from "../_types";
import Image from "next/image";
import Link from "next/link";
import TipCard, { TipTypeBackground } from "../_components/TipCard/TipCard";
// import { getuser } from "../_http/API/userApi";
import { useEffect } from "react";
import { getProfile } from "../_http/API/profileApi";
import { useTypesDispatch } from "../_hooks/useTypesDispatch";
import { userSlice } from "../_store/reducers/userSlice";
import { yearsOfEducation } from "../_utils/constants";
import LoadingScreen from "../_components/LoadingScreen/LoadingScreen";
import Button from "../_components/ui/Button/Button";
import ProfileStatus from "./ProfileStatus/ProfileStatus";
import { ProfileRoute } from "../_utils/protectedRoutes";
import { useTypesSelector } from "../_hooks/useTypesSelector";

export default function Home() {
    const { profileVerification, isProfileLoading, companyProfile, studentProfile, user } = useTypesSelector(
        (state) => state.userReducer,
    );

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
                <>
                    <div className={styles.mainInfo}>
                        <div
                            className={classNames(
                                styles.speciality,
                                "title fz48",
                            )}
                        >
                            {studentProfile?.formOfEducation}
                        </div>
                        <div className={styles.level}>
                            <p className="text fw500">
                                {studentProfile?.formOfEducation}
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
                        {studentProfile?.phoneVisibility && (
                            <div className={styles.contact}>
                                <Image
                                    src="/icons/phoneIcon.svg"
                                    alt="phone"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">{studentProfile?.phone}</p>
                            </div>
                        )}
                        <div className={styles.contact}>
                            <Link
                                href={
                                    "https:/t.me/" +
                                    studentProfile?.telegramLink
                                }
                                className={styles.contact}
                            >
                                <Image
                                    src="/icons/telegramIcon.svg"
                                    alt="telegram"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">
                                    {studentProfile.telegramLink}
                                </p>
                            </Link>
                        </div>
                        <div className={styles.education}>
                            <p
                                className={classNames(
                                    styles.educationTitle,
                                    "title",
                                )}
                            >
                                Образование
                            </p>
                            {/* <p
                                className={classNames(
                                    styles.yearOfEducation,
                                    "text gray fz20",
                                )}
                            >
                                {studentProfile.admissionYear} -{" "}
                                {studentProfile.admissionYear +
                                    yearsOfEducation[
                                        studentProfile.educationProgram
                                    ]}{" "}
                                гг.
                            </p> */}
                            <p
                                className={classNames(
                                    styles.university,
                                    "title",
                                )}
                            >
                                {/* {studentProfile.instituteId} */}
                                Сибирский федеральный университет
                            </p>
                            <p
                                className={classNames(
                                    styles.institute,
                                    "text fw500",
                                )}
                            >
                                {/* {studentProfile.university} */}
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
                            Навыки
                        </p>
                        <div className={styles.circles}>
                            {studentProfile.skills &&
                                studentProfile.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className={styles.circleWrapper}
                                    >
                                        <div
                                            className={styles.circle}
                                            style={{
                                                background: `conic-gradient(#19282C ${skill.percent}%, #e0e0e0 0%)`,
                                            }}
                                        >
                                            <span
                                                className={classNames(
                                                    styles.percentage,
                                                    "title",
                                                )}
                                            >
                                                {skill.percent}%
                                            </span>
                                        </div>
                                        <p className="text fw500">
                                            {skill.name}
                                        </p>
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
                </>
            ) : (
                <>
                    <div className={styles.mainInfo}>
                        <div
                            className={classNames(
                                styles.speciality,
                                "title fz48",
                            )}
                        >
                            Веб дизайнер
                        </div>
                        <div className={styles.level}>
                            <p className="text fw500">Средний уровень</p>
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
                            {studentProfile.description}
                        </p>
                        {studentProfile.phoneVisibility && (
                            <div className={styles.contact}>
                                <Image
                                    src="/icons/phoneIcon.svg"
                                    alt="phone"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">{studentProfile.phone}</p>
                            </div>
                        )}
                        <div className={styles.contact}>
                            <Link
                                href={
                                    "https:/t.me/" + studentProfile.telegramLink
                                }
                                className={styles.contact}
                            >
                                <Image
                                    src="/icons/telegramIcon.svg"
                                    alt="telegram"
                                    width={35}
                                    height={35}
                                />
                                <p className="text">
                                    {studentProfile.telegramLink}
                                </p>
                            </Link>
                        </div>
                        <div className={styles.education}>
                            <p
                                className={classNames(
                                    styles.educationTitle,
                                    "title",
                                )}
                            >
                                Образование
                            </p>
                            {/* <p
                                className={classNames(
                                    styles.yearOfEducation,
                                    "text gray fz20",
                                )}
                            >
                                {studentProfile.admissionYear} -{" "}
                                {studentProfile.admissionYear +
                                    yearsOfEducation[
                                        studentProfile.educationProgram
                                    ]}{" "}
                                гг.
                            </p> */}
                            <p
                                className={classNames(
                                    styles.university,
                                    "title",
                                )}
                            >
                                {/* {studentProfile.instituteId} */}
                                Сибирский федеральный университет
                            </p>
                            <p
                                className={classNames(
                                    styles.institute,
                                    "text fw500",
                                )}
                            >
                                {/* {studentProfile.university} */}
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
                            Навыки
                        </p>
                        <div className={styles.circles}>
                            {studentProfile.skills &&
                                studentProfile.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className={styles.circleWrapper}
                                    >
                                        <div
                                            className={styles.circle}
                                            style={{
                                                background: `conic-gradient(#19282C ${skill.percent}%, #e0e0e0 0%)`,
                                            }}
                                        >
                                            <span
                                                className={classNames(
                                                    styles.percentage,
                                                    "title",
                                                )}
                                            >
                                                {skill.percent}%
                                            </span>
                                        </div>
                                        <p className="text fw500">
                                            {skill.name}
                                        </p>
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
                </>
            )}
        </div>
    );
}
