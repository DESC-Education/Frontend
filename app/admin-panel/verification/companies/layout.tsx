import SideBar from '@/app/_components/SideBar/SideBar';
import styles from './layout.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const companies = [
        { linktoCompany: "1", companyName: "Гугл", firstName: "Петя", lastName: "Иванов", id: "1", isVerified: true, logoImg: "/images/userIcon.png", description: "Описание", vkLink: "https://vk.com/joinchat/123456789", telegramLink: "https://t.me/joinchat/123456789", timezone: "Europe/Moscow", city: { id: "1", name: "Москва", region: "Россия" }, phone: "123456789", emailVisibility: true, phoneVisibility: true },
        { linktoCompany: "2", companyName: "Яндекс", firstName: "Вася", lastName: "Васильев", id: "2", isVerified: true, logoImg: "/images/userIcon.png", description: "Описание", vkLink: "https://vk.com/joinchat/123456789", telegramLink: "https://t.me/joinchat/123456789", timezone: "Europe/Moscow", city: { id: "1", name: "Москва", region: "Россия" }, phone: "123456789", emailVisibility: true, phoneVisibility: true },
    ]

    return (
        <div className="container">
            <div className='selectLayout'>
                <SideBar>
                    <div className={styles.companiesList}>
                        {companies.map((company, index) => (
                            <Link href={`/admin-panel/verification/companies/${index}`} key={index} className={styles.companyItem}>
                                <div className={styles.companyItem} key={index}>
                                    <div className={styles.mainInfo}>
                                        <Image src={company.logoImg} alt={company.logoImg} width={70} height={70} />
                                        <div className={styles.info}>
                                            <div className={classNames("text fw500", styles.companyName)}>{company.companyName}</div>
                                            <div className={styles.city}>
                                                {company.city.name + ", " + company.city.region}
                                            </div>
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