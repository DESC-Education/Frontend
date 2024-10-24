"use client"


import { link } from "fs"
import styles from "./page.module.scss"
import Link from "next/link";
import classNames from "classnames";
import Image from "next/image";
import { getUsers } from "@/app/_http/API/adminApi";
import { useEffect, useState } from "react";
import { IUsersRequest } from "@/app/_types";



export default function CompaniesListPage() {

    const [users, setUsers] = useState<IUsersRequest[] | null>(null);

    useEffect(() => {
        const asyncFunc = async () => {
            const data = await getUsers("company", "");
            if (!data.users) return;
            setUsers(data.users);
            console.log(users)
        };
        asyncFunc();
    }, []);


    return (
        <div className="container">
            <div className={styles.search}>
                <input type="text" placeholder="Поиск" className="text" />
            </div>
            <div className={styles.companiesList}>
                {users?.map((user) => (
                    <Link href={`/admin-panel/companies-list/${user.id}`} key={user.id} className={styles.companyLink}>
                        <div className={styles.company}>
                            <div className={styles.info}>
                                <p className={classNames("text fw500", styles.name)}>{user.companyName}</p>
                                <p className={classNames("text fw500", styles.name)}>{user.isActive}</p>
                            </div>
                            <div className={styles.status}>
                                {user.isVerified ? <p className={classNames("text green fz16 fw500", styles.verified)}>Верифицирован</p> : <p className={classNames("text red fz16 fw500", styles.notVerified)}>Не верифицирован</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {/* <div className={styles.companiesList}>
                {companies.map((company) => (
                    <Link href={`/admin-panel/companies-list/${company.id}`} key={company.id} className={styles.companyLink}>
                        <div className={styles.company}>
                            <p className={classNames("text fw500", styles.id)}>#{company.id}</p>
                            <Image src="/images/userImage10.png" alt="company" width={50} height={50} />
                            <div className={styles.info}>
                                <p className={classNames("text fw500", styles.name)}>{company.companyName}</p>
                                <p className={classNames("text gray fz16", styles.address)}>{company.city.name}, {company.city.region}</p>
                            </div>
                            <div className={styles.status}>
                                {company.isVerified ? <p className={classNames("text green fz16 fw500", styles.verified)}>Проверен</p> : <p className={classNames("text red fz16 fw500", styles.notVerified)}>Не проверен</p>}

                            </div>
                        </div>
                    </Link>
                ))}
            </div> */}
        </div>
    );
}