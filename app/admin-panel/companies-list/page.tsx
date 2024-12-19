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
import usePagination from "@/app/_hooks/usePagination";
import Pagination from "@/app/_components/ui/Pagination/Pagination";
import Button from "@/app/_components/ui/Button/Button";

export default function CompanyListPage() {
    const [search, setSearch] = useState<string>("");

    const [currentUsers, totalPages, page, setPage, loading, fetchData] =
        usePagination<IUsersRequest>(
            getUsers,
            {
                role: "company",
                q: search,
            },
            20,
        );

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={classNames("container", styles.container)}>
            <div className={styles.search}>
                <form
                    className={styles.searchForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setPage(1);
                        fetchData();
                    }}>
                    <Input
                        containerClassName={styles.searchInput}
                        type="text"
                        placeholder="Поиск"
                        // onBlur={() => fetchData()}
                        onChange={(e) => setSearch(e)}
                        value={search}
                    />
                    <Button type="secondary" htmlType="submit">
                        Поиск
                    </Button>
                </form>
            </div>
            <div className={styles.studentsList}>
                {!loading ? (
                    currentUsers?.map((user) => (
                        <Link
                            href={`/admin-panel/students-list/${user.id}`}
                            key={user.id}
                            className={styles.studentLink}>
                            <div className={styles.student}>
                                <div className={styles.info}>
                                    {user.firstName && user.lastName && (
                                        <p
                                            className={classNames(
                                                "text fw500",
                                                styles.name,
                                            )}>
                                            {user.firstName} {user.lastName}
                                        </p>
                                    )}
                                    <p
                                        className={classNames(
                                            "text fw500",
                                            styles.name,
                                        )}>
                                        {user.email}
                                    </p>
                                    {/* <p className={classNames("text gray fz16", styles.education)}>{user.university.name} {student.faculty.name} {student.speciality.name}</p> */}
                                </div>
                                <div className={styles.status}>
                                    {user.profileVerification === "verified" ? (
                                        <p
                                            className={classNames(
                                                "text green fz16 fw500",
                                                styles.verified,
                                            )}>
                                            Проверен
                                        </p>
                                    ) : (
                                        <p
                                            className={classNames(
                                                "text red fz16 fw500",
                                                styles.notVerified,
                                            )}>
                                            Не проверен
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={styles.loading}>
                        <Oval />
                    </div>
                )}
            </div>
            {totalPages > 1 && !loading && (
                <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
}
