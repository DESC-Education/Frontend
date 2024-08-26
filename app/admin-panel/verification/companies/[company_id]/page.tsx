import Image from 'next/image';
import styles from './page.module.scss';
import classNames from 'classnames';
import Button from '@/app/_components/ui/Button/Button';


export default function CompanyPage() {
    return (
        <div className={styles.companyRequest}>
            <div className={styles.info}>
                <div className={styles.header}>
                    <div className={styles.avatar}>
                        <Image src="/images/userImage10.png" alt="userIcon" width={100} height={100} />
                    </div>
                    <div className={styles.firstInfo}>
                        <div className={styles.name}>
                            <div className="title">Имя</div>
                            <div className="title">Фамилия</div>
                        </div>
                        <div className={styles.education}>
                            <div className='text gray fz20'>СФУ, ИКИТ, 3 курс</div>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <p className='text fw500'>О компании</p>
                    <div className={classNames('text fz20', styles.descriptionText)}>
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