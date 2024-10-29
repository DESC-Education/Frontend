"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { IUsersRequest } from "@/app/_types";
import { getUsers } from "@/app/_http/API/adminApi";
import { Oval } from "react-loader-spinner";
import Input from "@/app/_components/ui/Input/Input";
import { get } from "http";


export default function StudentsListPage() {

    const [users, setUsers] = useState<IUsersRequest[] | null>(null);
    const [search, setSearch] = useState<string>("");

    const getUserFunc = async (q?: string) => {
        const data = await getUsers("student", q || "");
        if (!data.users) return;
        setUsers(data.users);
    }

    useEffect(() => {
        getUserFunc();
    }, []);



    if (!users) return (<div className={styles.loading}><Oval /></div>);
    return (
        <div className="container">
            <div className={styles.search}>
                <Input 
                type="text" 
                placeholder="Поиск" 
                onChange={(e) => (setSearch(e), getUserFunc(e))}
                value={search}
                />
            </div>
            <div className={styles.studentsList}>
                {users.map((user) => (
                    <Link href={`/admin-panel/students-list/${user.id}`} key={user.id} className={styles.studentLink}>
                        <div className={styles.student}>
                            <div className={styles.info}>
                                {user.firstName && user.lastName &&
                                    <p className={classNames("text fw500", styles.name)}>{user.firstName} {user.lastName}</p>
                                }
                                <p className={classNames("text fw500", styles.name)}>{user.email}</p>
                                {/* <p className={classNames("text gray fz16", styles.education)}>{user.university.name} {student.faculty.name} {student.speciality.name}</p> */}
                            </div>
                            <div className={styles.status}>
                                {user.profileVerification === "verified" ? <p className={classNames("text green fz16 fw500", styles.verified)}>Проверен</p> : <p className={classNames("text red fz16 fw500", styles.notVerified)}>Не проверен</p>}

                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}