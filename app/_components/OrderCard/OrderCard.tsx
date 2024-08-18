import { ICompany } from '@/app/_types';
import styles from './OrderCard.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import Button from '../ui/Button/Button';

type OrderCardProps = {
    title: string;
    description: string;
    deadline: string;
    reminingTime: string;
    company: ICompany;
    isViewed: boolean;
};

const OrderCard: React.FC<OrderCardProps> = ({
    title,
    description,
    deadline,
    reminingTime,
    company,
    isViewed,
}) => {
    if (!company.isVerified) return null;
    return (
        <div className={styles.taskCard}>
            <div className={classNames( 'text gray fz20', styles.isViewed, isViewed && styles.viewed)}>Просмотрено</div>
            <div className={styles.orderContent}>
                <div className={styles.taskContent}>
                    <div className={styles.companyInfo}>
                        <div className={styles.companyLogo}><Image src={company.logoImg.path} alt={company.name} width={60} height={60} /></div>
                        <h4 className={classNames(styles.taskTitle, "title")}>{company.name}</h4>
                    </div>
                    <div className={styles.taskDescription}>
                        <div className={classNames(styles.taskName, "title")}>{title}</div>
                        <div className="text">
                            <p className={styles.description}>{description}</p>
                            <span className={classNames(styles.showMore, "text gray fz24 under pointer")}>Показать полностью</span>
                        </div>
                    </div>
                </div>
                <div className={styles.taskFooter}>
                    <div className={styles.deadlineAndTime}>
                        <span className={classNames(styles.deadline, "text fw500")}>Срок выполнения: {deadline}</span>
                        <span className={classNames(styles.timeLeft, "text fw500 fz20")}>осталось {reminingTime}</span>
                    </div>
                    <Button type="secondary" className={styles.proposeButton}>Предложить решение</Button>
                </div>
            </div>
        </div>
    );
}

export default OrderCard;