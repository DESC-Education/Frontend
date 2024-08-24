import { IStudentProfile } from '@/app/_types';
import SideBar from '../../../_components/SideBar/SideBar';
import styles from './layout.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link';

const students = [
    { id: "1", name: "Петя", surname: "Иванов", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "1", isVerified: true, name: "Петя", surname: "Петров", logoImg: { id: "1", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "2", name: "Вася", surname: "Васильев", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "2", isVerified: true, name: "Вася", surname: "Васильев", logoImg: { id: "2", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "3", name: "Иван", surname: "Иванов", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "3", isVerified: true, name: "Иван", surname: "Иванов", logoImg: { id: "3", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "4", name: "Вася", surname: "Васильев", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "4", isVerified: true, name: "Вася", surname: "Васильев", logoImg: { id: "4", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "5", name: "Вася", surname: "Васильев", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "5", isVerified: true, name: "Вася", surname: "Васильев", logoImg: { id: "5", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "6", name: "Вася", surname: "Васильев", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "6", isVerified: true, name: "Вася", surname: "Васильев", logoImg: { id: "6", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "7", name: "Иван", surname: "Иванов", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "7", isVerified: true, name: "Иван", surname: "Иванов", logoImg: { id: "7", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
    { id: "8", name: "Вася", surname: "Васильев", isVerified: true, isOnline: true, isBanned: false, type: "student", data: { id: "8", isVerified: true, name: "Вася", surname: "Васильев", logoImg: { id: "8", name: "Имя Фамилия", path: "/images/userIcon.png", type: "image/png" }, description: "Описание", phone: "123456789", specialityId: "1", instituteId: "1", formOfEducationId: "1", timezone: "Europe/Moscow", grade: "1", yearOfGraduation: 2024, telegramLink: "https://t.me/joinchat/123456789" } as IStudentProfile },
];

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="container">
            <div className='selectLayout'>
                <SideBar>
                    <div className={styles.studentsList}>
                        {students.map((student, index) => (
                            <Link href={`/admin-panel/verification/students/${index}`} key={index} className={styles.studentItem}>
                                <div className={styles.studentItem} key={index}>
                                    <div className={styles.mainInfo}>
                                        <Image src={student.data.logoImg.path} alt={student.data.logoImg.name} width={70} height={70} />
                                        <div className={classNames("text fw500", styles.studetnName)}>{student.name} {student.surname}</div>
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