"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.scss";
import "./page.scss";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useEffect, useState } from "react";
import { getProfile } from "@/app/_http/API/profileApi";
import classNames from "classnames";
import { ICompanyProfile, IStudentProfile } from "@/app/_types";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import Link from "next/link";
import Image from "next/image";
import { getBeautifiedPhone } from "@/app/_utils/utils";
import { yearsOfEducation } from "@/app/_utils/constants";
import BackButton from "@/app/_components/ui/BackButton/BackButton";
import Button from "@/app/_components/ui/Button/Button";
import { createChat } from "@/app/_http/API/chatsApi";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { chatSlice } from "@/app/_store/reducers/chatSlice";

const ProfilePage = () => {
    const { id, role } = useParams<{
        id: string;
        role: "student" | "company";
    }>();

    const router = useRouter();

    const { user } = useTypesSelector((state) => state.userReducer);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    const [studentProfile, setStudentProfile] = useState<
        (IStudentProfile & { email: string; tasksCompleted: number }) | null
    >(null);
    const [companyProfile, setCompanyProfile] = useState<
        (ICompanyProfile & { email: string }) | null
    >(null);

    const { updateCurrentChat } = chatSlice.actions;
    const dispatch = useTypesDispatch();

    useEffect(() => {
        if (id === user.id) {
            router.replace("/profile");
        }
    }, []);

    useEffect(() => {
        const asyncFunc = async () => {
            const res = await getProfile(id);

            if (role === "student") {
                setStudentProfile(res.profile!);
            } else {
                setCompanyProfile(res.profile!);
            }

            setIsLoading(false);
        };
        asyncFunc();
    }, []);

    const getCurrentCourse = (start: number, end: number): string => {
        const currentYear = new Date().getFullYear();

        if (start <= currentYear && currentYear <= end) {
            return "Выпускник";
        } else if (start > currentYear) {
            return `${currentYear - start} курс`;
        }
        return "Выпускник";
    };

    const handlerStartChat = async () => {
        setIsChatLoading(true);
        const res = await createChat({
            companionId: id,
        });

        if (res.status === 200) {
            router.push(`/chat/${res.chat!.id}`);
        }

        setIsChatLoading(false);
    };

    if (isLoading || (!studentProfile && !companyProfile))
        return (
            <div className="centerContent">
                <CustomOval />
            </div>
        );

    return (
        <div
            className={classNames(styles.userContainer, "container", {
                [styles.loading]: isLoading,
            })}
        >
            <BackButton className={styles.backButton} />
            {role === "student" && studentProfile ? (
                <div className={styles.content}>
                    <div className={styles.contactInfo}>
                        <img
                            className={styles.avatar}
                            src={
                                studentProfile.logoImg
                                    ? process.env.NEXT_PUBLIC_SERVER_PATH +
                                      studentProfile.logoImg
                                    : "/images/avatar.png"
                            }
                            alt="avatar"
                        />
                        <p className="text fz28">
                            {studentProfile.firstName[0].toLocaleUpperCase() +
                                studentProfile.firstName.slice(1)}{" "}
                            {studentProfile.lastName[0].toLocaleUpperCase() +
                                studentProfile.lastName.slice(1)}{" "}
                        </p>
                        {studentProfile.tasksCompleted > 0 && (
                            <p className="text fz20 green">
                                {studentProfile.tasksCompleted} заданий
                                выполнено
                            </p>
                        )}
                        <div className={styles.sm}>
                            {studentProfile?.email && (
                                <Link
                                    href={`mailto:${studentProfile.email}`}
                                    className={styles.contact}
                                >
                                    <Image
                                        src="/icons/mail.png"
                                        alt="phone"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text">
                                        {studentProfile.email}
                                    </p>
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
                                        @{studentProfile.telegramLink.slice(13)}
                                    </p>
                                </Link>
                            )}
                            {studentProfile?.vkLink && (
                                <Link
                                    target="_blank"
                                    rel="noreferrer"
                                    href={
                                        "https:/vk.com/" +
                                        studentProfile?.vkLink
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
                                        {studentProfile.vkLink.slice(15)}
                                    </p>
                                </Link>
                            )}
                        </div>
                        {user.role === "company" &&
                            (isChatLoading ? (
                                <Button type="secondary" loading>
                                    <CustomOval
                                        width={30}
                                        height={30}
                                        color="rgba(var(--white), 1)"
                                        secondaryColor="rgba(var(--gray1), .6)"
                                    />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handlerStartChat()}
                                    type="secondary"
                                >
                                    Написать
                                </Button>
                            ))}
                    </div>
                    <div className={styles.profileBody}>
                        <div className={styles.mainInfo}>
                            <div
                                className={classNames(
                                    styles.speciality,
                                    "title fz48",
                                )}
                            >
                                {studentProfile.profession}
                            </div>
                            <Link
                                href={`/levels/`}
                                className={classNames(
                                    styles.level,
                                    `level${studentProfile.level.value}`,
                                )}
                            >
                                <p className="text fw500">
                                    {studentProfile.level.name}
                                </p>
                            </Link>
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
                                {studentProfile?.description
                                ? studentProfile?.description
                                : "Информации нет"}
                            </p>
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
                                    гг.{" "}
                                    {getCurrentCourse(
                                        studentProfile.admissionYear!,
                                        studentProfile.admissionYear! +
                                            yearsOfEducation[
                                                studentProfile.specialty.type
                                            ],
                                    )}
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
                                    {studentProfile.skills.map(
                                        (skill, index) => (
                                            <div
                                                key={index}
                                                className={styles.skill}
                                            >
                                                <p className="text fw500">
                                                    {skill.name}
                                                </p>
                                            </div>
                                        ),
                                    )}
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
                                                    className={
                                                        styles.circleWrapper
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.circle
                                                        }
                                                        style={{
                                                            background: `conic-gradient(#19282C ${Math.floor(
                                                                category.percent *
                                                                    100,
                                                            )}%, #e0e0e0 0%)`,
                                                        }}
                                                    >
                                                        <span
                                                            className={classNames(
                                                                styles.percentage,
                                                                "title",
                                                            )}
                                                        >
                                                            {Math.floor(
                                                                category.percent *
                                                                    100,
                                                            )}
                                                            %
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
                    </div>
                </div>
            ) : role === "company" && companyProfile ? (
                <div className={styles.content}>
                    <div className={styles.contactInfo}>
                        <img
                            className={styles.avatar}
                            src={
                                companyProfile.logoImg
                                    ? process.env.NEXT_PUBLIC_SERVER_PATH +
                                      companyProfile.logoImg
                                    : "/images/avatar.png"
                            }
                            alt="avatar"
                        />
                        <p className="text fz28">
                            {companyProfile.firstName[0].toLocaleUpperCase() +
                                companyProfile.firstName.slice(1)}{" "}
                            {companyProfile.lastName[0].toLocaleUpperCase() +
                                companyProfile.lastName.slice(1)}{" "}
                        </p>
                        <div className={styles.sm}>
                            {companyProfile?.email && (
                                <Link
                                    href={`mailto:${companyProfile.email}`}
                                    className={styles.contact}
                                >
                                    <Image
                                        src="/icons/mail.png"
                                        alt="phone"
                                        width={35}
                                        height={35}
                                    />
                                    <p className="text">
                                        {companyProfile.email}
                                    </p>
                                </Link>
                            )}
                            {companyProfile?.phoneVisibility &&
                                companyProfile.phone && (
                                    <Link
                                        href={`tel:${companyProfile.phone}`}
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
                                                companyProfile.phone,
                                            )}
                                        </p>
                                    </Link>
                                )}
                            {companyProfile?.telegramLink && (
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
                                        @{companyProfile.telegramLink.slice(13)}
                                    </p>
                                </Link>
                            )}
                            {companyProfile?.vkLink && (
                                <Link
                                    target="_blank"
                                    rel="noreferrer"
                                    href={
                                        "https:/vk.com/" +
                                        studentProfile?.vkLink
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
                                        {companyProfile.vkLink.slice(15)}
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className={styles.profileBody}>
                        <div className={styles.mainInfo}>
                            <div
                                className={classNames(
                                    styles.speciality,
                                    "title fz48",
                                )}
                            >
                                {companyProfile.companyName}
                            </div>
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
                                {companyProfile?.description
                                ? companyProfile?.description
                                : "Информации нет"}
                            </p>
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
                                    {companyProfile.skills.map(
                                        (skill, index) => (
                                            <div
                                                key={index}
                                                className={styles.skill}
                                            >
                                                <p className="text fw500">
                                                    {skill.name}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                        {!!companyProfile.leadTaskCategories?.length && (
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
                                                    className={
                                                        styles.circleWrapper
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.circle
                                                        }
                                                        style={{
                                                            background: `conic-gradient(#19282C ${
                                                                category.percent *
                                                                100
                                                            }%, #e0e0e0 0%)`,
                                                        }}
                                                    >
                                                        <span
                                                            className={classNames(
                                                                styles.percentage,
                                                                "text fw500",
                                                            )}
                                                        >
                                                            {category.percent *
                                                                100}
                                                            %
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
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default ProfilePage;
