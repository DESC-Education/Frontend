"use client";

import { IStudentProfile } from '@/app/_types';
import SideBar from '../../../_components/SideBar/SideBar';
import styles from './layout.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link';
import { get } from 'http';
import { getRequests } from '@/app/_http/API/adminApi';
import { useTypesSelector } from '@/app/_hooks/useTypesSelector';
import { use, useEffect, useState } from 'react';
import { useTypesDispatch } from '@/app/_hooks/useTypesDispatch';
import { profileVerifySlice } from '@/app/_store/reducers/profileVerifySlice';
import { Oval } from 'react-loader-spinner';
import Input from '@/app/_components/ui/Input/Input';
import Button from '@/app/_components/ui/Button/Button';



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { studentsVerifications } = useTypesSelector((state) => state.profileVerifyReducer);
    const { updateStudentsVerifications } = profileVerifySlice.actions;
    const dispatch = useTypesDispatch();

    const updateProfiles = async (q?: string) => {
        const profiles = await getRequests("pending", "student", q || "");
        if (profiles.status === 200) {

            dispatch(updateStudentsVerifications({ profiles: profiles.requests! }));
        }
    }

    useEffect(() => {
        updateProfiles();
    }, []);

    const [search, setSearch] = useState<string>("");

    if (!studentsVerifications) return (<div className={styles.loading}><Oval /></div>);
    return (
        <div className="container">
            <div className={styles.selectLayout}>
                <SideBar>
                    <div className={styles.search}>
                        <Input
                            type="text"
                            placeholder="Поиск компаний"
                            value={search}
                            onChange={(e) => setSearch(e)}
                            containerClassName={styles.input}
                        />
                        <Button type="primary" onClick={() => updateProfiles(search)} className={styles.searchIcon}><img src="/icons/searchIcon.svg" alt="search" /></Button>
                    </div>
                    <div className={styles.studentsList}>
                        {studentsVerifications?.map((profile, index) => (
                            <Link href={`/admin-panel/verification/students/${profile.id}`} key={index} className={styles.studentItem}>
                                <div className={styles.studentItem} key={index}>
                                    <div className={styles.mainInfo}>
                                        <div className={classNames("text fw500", styles.studetnName)}>{profile.firstName} {profile.lastName}</div>
                                    </div>
                                    <div className={styles.info}>
                                        <div> </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </SideBar>
                {children}
            </div>
        </div>
    );
};