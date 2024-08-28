"use client"

import classNames from "classnames";
import styles from "./page.module.scss"
import Link from "next/link";
import Image from "next/image";
import { link } from "fs";
import { createRef, ReactNode, RefObject, useState } from "react";
import Button from "@/app/_components/ui/Button/Button";

type CompanyInfo = "general" | "chats" | "tasks"

const CompanyPage = () => {

    const [activeTab, setActiveTab] = useState<CompanyInfo>("general");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);


    const company = {
        linkToCompany: "https://vk.com/join/asdfasdf",
        companyName: "Сибирская Ветроудаляющая Организация (СВО)",
        firstName: "Иван",
        lastName: "Иванов",
        id: "1",
        isVerified: true,
        logoImg: "/images/companyLogo.png",
        description: "Описание компании",
        vkLink: "https://vk.com/join/asdfasdf",
        telegramLink: "https://t.me/joinchat/asdfasdf",
        timezone: 3,
        city: {
            id: "1",
            name: "город X",
            region: "Регион X",
        },
        phone: "88005553535",
        emailVisibility: true,
        phoneVisibility: true,
    };


    const getCompanyContent = (activeTab: CompanyInfo,): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>
    } => {
        switch (activeTab) {
            case "general":
                return {
                    content: (
                        <div className={styles.content}>general
                        </div>
                    ),
                    ref: createRef(),
                }
            case "chats":
                return {
                    content: (
                        <div className={styles.content}>chats</div>
                    ),
                    ref: createRef(),
                }
            case "tasks":
                return {
                    content: (
                        <div className={styles.content}>tasks</div>
                    ),
                    ref: createRef(),
                }
        }
    }

    const handleTabChange = (newTab: CompanyInfo) => {
        if (activeTab === newTab) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(newTab);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.companyHeader}>
                <Link href={"/admin-panel/companies-list"} className={styles.backButton}>
                    <Image src="/icons/backIcon.svg" width={15} height={15} alt="arrow-left" className={styles.img} />
                    <p className="text green fz20">Вернуться к списку</p>
                </Link>
                <p className="title">
                    {company.companyName}
                </p>
            </div>
            <div className={styles.navigationButtons}>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "general" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("general")}
                >
                    Общие
                </Button>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "chats" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("chats")}
                >
                    Чаты
                </Button>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "tasks" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("tasks")}
                >
                    Заказы
                </Button>
            </div>
            <div
                className={classNames(styles.content, {
                    [styles.exit]: isAnimating,
                })}
            >
                {getCompanyContent(activeTab).content}

            </div>
        </div>
    )
}
export default CompanyPage;