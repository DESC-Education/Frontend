import { ICompany } from '@/app/_types';
import styles from './OrderCard.module.scss';

type OrderCardProps = {
    title: string;
    description: string;
    deadline: string;
    reminingTime: string;
    company: ICompany;
};

const OrderCard: React.FC<OrderCardProps> = ({
    title,
    description,
    deadline,
    reminingTime,
    company,
}) => {
    if (!company.isVerified) return null;
    return (
        <div className={styles.orderCard}>
            <div className={styles.header}>
                <div className={styles.companyInfo}>
                    <div className={styles.companyLogo}></div>
                    <h4 className={styles.companyTitle}>{company.name}</h4>
                </div>
                <span className={styles.deadline}>Срок выполнения: {deadline}</span>
            </div>
            <div className={styles.description}>
                <p>{description}</p>
            </div>
            <div className={styles.footer}>
                <span className={styles.reminingTime}>Осталось {reminingTime}</span>
                <button className={styles.proposeButton}>Предложить решение</button>
            </div>
        </div>
    );
}

export default OrderCard;