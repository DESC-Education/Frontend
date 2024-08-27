import { create } from 'domain';
import styles from './layout.module.scss';
import SideBar from '@/app/_components/SideBar/SideBar';
import classNames from 'classnames';
import Link from 'next/link';



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const tasks = [
        {
            id: 1,
            title: "Разработка сиси масиси",
            description: "Описание задания 1",
            deadline: "10.10.2022",
            createdat: "10.10.2022",
            catogoryId: "1",
            isVerified: false,
            isSuspicious: true,
            isVisible: true,
            files: [
                {
                    id: "1",
                    name: "Документ 1",
                    path: "path",
                    type: "pdf",
                },
                {
                    id: "2",
                    name: "Документ 2",
                    path: "path",
                    type: "pdf",
                },
            ],


        },
        {
            id: "2",
            title: "Задание 2",
            description: "Описание задания 2",
            deadline: "10.10.2022",
            createdat: "10.10.2022",
            catogoryId: "1",
            isVerified: false,
            isSuspicious: false,
            isVisible: true,
            files: [
                {
                    id: "1",
                    name: "Документ 1",
                    path: "path",
                    type: "pdf",
                },
                {
                    id: "2",
                    name: "Документ 2",
                    path: "path",
                    type: "pdf",
                },
            ],

        },
        {
            id: "3",
            title: "Задание 3",
            description: "Описание задания 3",
            deadline: "10.10.2022",
            createdat: "10.10.2022",
            catogoryId: "1",
            isVerified: false,
            isSuspicious: false,
            isVisible: true,
            files: [
                {
                    id: "1",
                    name: "Документ 1",
                    path: "path",
                    type: "pdf",
                },
                {
                    id: "2",
                    name: "Документ 2",
                    path: "path",
                    type: "pdf",
                },
            ],
        }
    ];

    return (
        <div className="container">
            <div className='selectLayout'>
                <SideBar>
                    <div className={styles.tasksList}>
                        {tasks.map((task) => (
                            <Link className={styles.taskItem} key={task.id} href={`/admin-panel/verification/tasks/${task.id}`}>
                                <div className={styles.mainInfo}>
                                    <div className={styles.taskTitle}>
                                        {task.isSuspicious === true && <div className="text red fw500">!</div>}
                                        <div className="text fw500">{task.title}</div>
                                    </div>
                                    <div className={styles.dates}>
                                        <div className={classNames("text green fz16", styles.date)}>Дата создания: {task.createdat}</div>
                                        <div className={classNames("text red fz16", styles.date)}>Дата выполнения: {task.deadline}</div>
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
}