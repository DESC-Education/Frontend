"use client";

import { date } from "zod";
import styles from "./page.module.scss";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import Link from "next/link";
import Button from "@/app/_components/ui/Button/Button";
import { ICompanyProfile, ITask } from "@/app/_types";
import TaskCard from "@/app/_components/TaskCard/TaskCard";
import ProfileStatus from "../ProfileStatus/ProfileStatus";
import { ProfileRoute } from "@/app/_utils/protectedRoutes";

const tasks: ITask[] = [
    {
        name: "Заказ1",
        deadline: "10.03.2024",
        description: "asdasd",
        id: "1",
        company: {
            id: "1",
            logoImg: {
                id: "2",
                name: "logo1",
                path: "/images/userImage2.png",
                type: "png",
            },
            linkToCompany: "",
            description: "",
            phone: "",
            emailVisibility: false,
            phoneVisibility: false,
            timezone: 0,
            city: {
                id: "1",
                name: "Moscow",
                region: "Россия",
            },
            skills: [],
            companyName: "",
            firstName: "",
            lastName: "",
            verification: { status: "verified" },
        },
        isVisible: true,
        createdAt: "10.03.2024",
        files: [],
        isSuspicious: false,
        isVerified: true,
    },
];

export default function Home() {
    const { profileVerification } = useTypesSelector(
        (state) => state.userReducer,
    );

    if (profileVerification.status !== "verified") {
        return <ProfileStatus profileVerification={profileVerification} />;
    }

    return (
        <div className={styles.container}>
            {tasks.map((task, index) => (
                <TaskCard key={index} task={task} />
            ))}
        </div>
    );
}
