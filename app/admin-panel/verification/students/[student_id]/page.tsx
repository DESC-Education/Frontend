import Button from '@/app/_components/ui/Button/Button';
import styles from './page.module.scss';
import Image from 'next/image';
import classNames from 'classnames';

export default function StudentPage() {

    const student = {
        id: "1",
        isVerified: true,
        admissionYear: 2023,
        description: "Текст текстТекст текстТекст текстТекст текстТекст текстТекст текстТекст текстТекст текстТекст текстТекст текст ",
        firstName: "Петя",
        lastName: "Иванов",
        logoImg: "/images/userImage10.png",
        phone: "",
        emailVisibility: true,
        phoneVisibility: true,
        timezone: 3,
        university: {
            id: "1",
            name: "СФУ",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            }
        },
        speciality: {
            id: "1",
            name: "ИСИТ",
            type: "speciality",
            code: "code",
        },
        faculty: {
            id: "1",
            name: "ИКИТ",
            university: "СФУ",
        },
        formOfEducation: "bachelor",
        educationProgram: "bachelor",
        telegramLink: "https://t.me/joinchat/asdfasdf",
        vkLink: "https://vk.com/joinchat/asdfasdf",
        city: {
            id: "1",
            name: "город X",
            region: "Регион X",
        },
        skills: [
            {
                id: "1",
                name: "Навык X",
                percent: 50,
            },
            {
                id: "2",
                name: "Навык Y",
                percent: 50,
            },
        ],
    }

    const documents = [
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
    ]

    return (
        <div className={styles.studentRequest}>
            <div className={styles.info}>
                <div className={styles.header}>
                    <div className={styles.avatar}>
                        <Image src={student.logoImg} alt="userIcon" width={100} height={100} />
                    </div>
                    <div className={styles.firstInfo}>
                        <div className={styles.name}>
                            <div className="title">{student.firstName}</div>
                            <div className="title">{student.lastName}</div>
                        </div>
                        <div className={styles.location}>
                            <div className='text gray fz20'>{student.city.name}, {student.city.region}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Образование</p>
                        <div className={classNames('text', styles.info)}>Университет: {<p>{student.university.name}</p>}</div>
                        <div className={classNames('text', styles.info)}>Специализация: {<p>{student.speciality.name}</p>}</div>
                        <div className={classNames('text', styles.info)}>Факультет: {<p>{student.faculty.name}</p>}</div>
                        <div className={classNames('text', styles.info)}>Выпускная программа: {<p>{student.educationProgram}</p>}</div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Связь</p>
                        {student.telegramLink && <div className={classNames('text', styles.info)}>Телеграм: {<a className='text under' href={student.telegramLink}>@{student.telegramLink.slice(22)}</a>}</div>}
                        {student.vkLink && <div className={classNames('text', styles.info)}>ВКонтакте: {<a className='text under' href={student.vkLink}>@{student.vkLink.slice(24)}</a>}</div>}
                        {student.phone && <div className={classNames('text', styles.info)}>Телефон: {<p>{student.phone}</p>}</div>}
                        <div className={classNames('text', styles.info)}>Электронная почта: {<p>email@mail.com</p>}</div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Информация</p>
                        <div className={classNames('text', styles.info)}>О студенте: {<p>{student.description}</p>}</div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Документы</p>
                        <div className={classNames('text', styles.documents)}>
                            {documents.map((document) => (
                                <div className={styles.documentItem} key={document.id}>
                                    <p className={classNames('text gray fz16', styles.documentName)}>{document.name}.{document.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <Button type="primary" className={styles.button}>Отклонить</Button>
                <Button type="secondary" className={styles.button}>Принять</Button>
            </div>
        </div>
    );
}