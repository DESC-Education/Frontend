"use client"


import SideBar from '@/app/_components/SideBar/SideBar';
import styles from './layout.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { useTypesSelector } from '@/app/_hooks/useTypesSelector';
import { profileVerifySlice } from '@/app/_store/reducers/profileVerifySlice';
import { useTypesDispatch } from '@/app/_hooks/useTypesDispatch';
import { getRequests } from '@/app/_http/API/adminApi';
import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import Input from '@/app/_components/ui/Input/Input';
import Button from '@/app/_components/ui/Button/Button';


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { companiesVerifications } = useTypesSelector((state) => state.profileVerifyReducer);
    const { updateCompaniesVerifications } = profileVerifySlice.actions;

    const dispatch = useTypesDispatch();

    const updateProfiles = async (q?: string) => {
        //setSearch("");
        const profiles = await getRequests("pending", "company", q || "");
        if (profiles.status === 200) {
            dispatch(updateCompaniesVerifications({ profiles: profiles.requests! }));
        }
    }

    useEffect(() => {
        updateProfiles();
    }, []);

    const [search, setSearch] = useState<string>("");


    if (!companiesVerifications) return (<div className={styles.loading}><Oval /></div>);

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
                    <div className={styles.companiesList}>
                        {companiesVerifications.map((company, index) => (
                            <Link href={`/admin-panel/verification/companies/${company.id}`} key={index} className={styles.companyItem}>
                                <div className={styles.companyItem} key={index}>
                                    <div className={styles.mainInfo}>
                                        <div className={styles.info}>
                                            <div className={classNames("text fw500", styles.companyName)}>{company.firstName} {company.lastName} { }</div>

                                        </div>
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