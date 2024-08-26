import { link } from "fs"
import styles from "./page.module.scss"
import Link from "next/link";
import classNames from "classnames";
import Image from "next/image";



export default function CompaniesListPage() {

    const companies = [
        {
            linkToCompany: "https://vk.com/join/asdfasdf",
            companyName: "Компания 1",
            firstName: "Иван",
            lastName: "Иванов",
            id: "1",
            isVerified: true,
            logoImg: "/images/userImage10.png",
            description: "Описание компании",
            vkLink: "https://vk.com/join/asdfasdf",
            telegramLink: "https://t.me/joinchat/asdfasdf",
            timezone: "3",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            },
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
        },
        {
            linkToCompany: "https://vk.com/join/asdfasdf",
            companyName: "Компания 2",
            firstName: "Иван",
            lastName: "Иванов",
            id: "2",
            isVerified: true,
            logoImg: "/images/userImage10.png",
            description: "Описание компании",
            vkLink: "https://vk.com/join/asdfasdf",
            telegramLink: "https://t.me/joinchat/asdfasdf",
            timezone: "3",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            },
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
        },
        {
            linkToCompany: "https://vk.com/join/asdfasdf",
            companyName: "Компания 3",
            firstName: "Иван",
            lastName: "Иванов",
            id: "3",
            isVerified: true,
            logoImg: "/images/userImage10.png",
            description: "Описание компании",
            vkLink: "https://vk.com/join/asdfasdf",
            telegramLink: "https://t.me/joinchat/asdfasdf",
            timezone: "3",
            city: {
                id: "1",
                name: "город X",
                region: "Регион X",
            },
            phone: "123456789",
            emailVisibility: true,
            phoneVisibility: true,
        },
    ];



    return (
        <div className="container">
            <div className={styles.search}>
                <input type="text" placeholder="Поиск" className="text" />
            </div>
            <div className={styles.companiesList}>
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
            </div>
        </div>
    );
}