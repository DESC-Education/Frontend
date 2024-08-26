import { IStudentProfile } from '@/app/_types';
import SideBar from '../../../_components/SideBar/SideBar';
import styles from './layout.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link';



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const students = [
        {
            id: "1",
            isVerified: true,
            admissionYear: 2024,
            description: "Описание",
            firstName: "Петя",
            lastName: "Иванов",
            logoImg: "/images/userIcon.png",
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
            timezone: "Europe/Moscow",
            university: { id: "1", name: "Университет имени", city: { id: "1", name: "Москва", region: "Россия" } },
            speciality: { id: "1", name: "Специализация", type: "speciality", code: "1" },
            faculty: { id: "1", name: "Факультет", university: "1" }, formOfEducation: "part_time",
            educationProgram: "bachelor", telegramLink: "https://t.me/joinchat/123456789",
            vkLink: "https://vk.com/joinchat/123456789",
            city: { id: "1", name: "Москва", region: "Россия" },
            skills: [{ id: "1", name: "Навык", percent: 100 }]
        },
        {
            id: "2",
            isVerified: true,
            admissionYear: 2024,
            description: "Описание",
            firstName: "Вася",
            lastName: "Васильев",
            logoImg: "/images/userImage10.png",
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
            timezone: "Europe/Moscow",
            university: { id: "1", name: "Университет имени", city: { id: "1", name: "Москва", region: "Россия" } },
            speciality: { id: "1", name: "Специализация", type: "speciality", code: "1" },
            faculty: { id: "1", name: "Факультет", university: "1" }, formOfEducation: "part_time",
            educationProgram: "bachelor", telegramLink: "https://t.me/joinchat/123456789",
            vkLink: "https://vk.com/joinchat/123456789",
            city: { id: "1", name: "Москва", region: "Россия" },
            skills: [{ id: "1", name: "Навык", percent: 100 }]
        }
    ]

    return (
        <div className="container">
            <div className='selectLayout'>
                <SideBar>
                    <div className={styles.studentsList}>
                        {students.map((student, index) => (
                            <Link href={`/admin-panel/verification/students/${index}`} key={index} className={styles.studentItem}>
                                <div className={styles.studentItem} key={index}>
                                    <div className={styles.mainInfo}>
                                        <Image src={student.logoImg} alt={student.logoImg} width={70} height={70} />
                                        <div className={classNames("text fw500", styles.studetnName)}>{student.firstName} {student.lastName}</div>
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