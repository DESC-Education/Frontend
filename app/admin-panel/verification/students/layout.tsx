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
import { use, useEffect } from 'react';
import { useTypesDispatch } from '@/app/_hooks/useTypesDispatch';
import { profileVerifySlice } from '@/app/_store/reducers/profileVerifySlice';
import { Oval } from 'react-loader-spinner';



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { studentsVerifications } = useTypesSelector((state) => state.profileVerifyReducer);
    const { updateStudentsVerifications } = profileVerifySlice.actions;
    const dispatch = useTypesDispatch();

    const updateProfiles = async () => {
        const profiles = await getRequests("pending");
        if (profiles.status === 200) {
            
            dispatch(updateStudentsVerifications({ profiles: profiles.requests! }));
        }
    }

    useEffect(() => {
        updateProfiles();
    }, []);

    if (!studentsVerifications) return (<div className={styles.loading}><Oval /></div>);
    return (
        <div className="container">
            <div className='selectLayout'>
                <SideBar>
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