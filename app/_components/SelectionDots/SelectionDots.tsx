import styles from './SelectionDots.module.scss';

type SelectionDotsProps = {
    title: string;
};

export default function SelectionDots({
    title,
}: Readonly<SelectionDotsProps>) {
    return (
        <div className={styles.placeholder}>
            <div className={styles.icon}>
                <div className={styles.bubble}></div>
                <div className={styles.dots}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <p className="title">{title}</p>
        </div>
    );
};