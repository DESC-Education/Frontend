import Image from 'next/image';
import styles from './page.module.scss';
import classNames from 'classnames';
import Button from '@/app/_components/ui/Button/Button';
import { link } from 'fs';


export default function CompanyPage() {

    const company = {
        linkToCompany: "https://yandex.ru",
        companyName: "Компания 1",
        firstName: "Иван",
        lastName: "Иванов",
        id: "1",
        isVerified: true,
        logoImg: "/images/userImage10.png",
        description: "Описание компании и о ней и о ней текст текст Описание компании и о ней и о ней текст текст Описание компании и о ней и о ней текст текст",
        vkLink: "https://vk.com/join/asdfasdf",
        telegramLink: "https://t.me/joinchat/asdfasdf",
        timezone: "3",
        city: {
            id: "1",
            name: "город X",
            region: "Регион X",
        },
        phone: "88005553535",
        emailVisibility: true,
        phoneVisibility: true
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
        <div className={styles.companyRequest}>
            <div className={styles.info}>
                <div className={styles.header}>
                    <div className={styles.avatar}>
                        <Image src="/images/userImage10.png" alt="userIcon" width={100} height={100} />
                    </div>
                    <div className={styles.firstInfo}>
                        <div className={styles.name}>
                            <div className="title">{company.companyName}</div>
                        </div>
                        <div className={styles.location}>
                            <div className='text gray fz20'>{company.city.name}, {company.city.region}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Контактное лицо</p>
                        <div className={classNames('text', styles.info)}>{company.firstName} {company.lastName} </div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Связь</p>
                        { company.telegramLink && <div className={classNames('text', styles.info)}>Телеграм: {<a className='text under' href={company.telegramLink}>@{company.telegramLink.slice(22)}</a>}</div>}
                        { company.vkLink && <div className={classNames('text', styles.info)}>ВКонтакте: {<a className='text under' href={company.vkLink}>@{company.vkLink.slice(20)}</a>}</div>}
                        { company.phone && <div className={classNames('text', styles.info)}>Телефон: {<p>{company.phone}</p>}</div>}
                        <div className={classNames('text', styles.info)}>Электронная почта: {<p>email@mail.com</p>}</div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Информация</p>
                        <div className={classNames('text', styles.info)}>О компании: {<p>{company.description}</p>}</div>
                        <div className={classNames('text', styles.info)}>Ссылка на сайт: {<a className='text under' href={company.linkToCompany}>{company.linkToCompany}</a>}</div>

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