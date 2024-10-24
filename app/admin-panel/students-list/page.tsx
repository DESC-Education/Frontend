"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { IUsersRequest } from "@/app/_types";
import { getUsers } from "@/app/_http/API/adminApi";
import { Oval } from "react-loader-spinner";


export default function StudentsListPage() {

    const [users, setUsers] = useState<IUsersRequest[] | null>(null);

    useEffect(() => {
        const asyncFunc = async () => {
            const data = await getUsers("student", "");
            if (!data.users) return;
            setUsers(data.users);
            console.log(data)
        };
        asyncFunc();
    }, []);



    if (!users) return (<div className={styles.loading}><Oval /></div>);
    return (
        <div className="container">
            <div className={styles.search}>
                <input type="text" placeholder="Поиск" className="text" />
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
                                {user.isVerified ? <p className={classNames("text green fz16 fw500", styles.verified)}>Проверен</p> : <p className={classNames("text red fz16 fw500", styles.notVerified)}>Не проверен</p>}

                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}