import styles from "./page.module.scss";

export default function Page() {
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
            <p className="title">Выберите собеседника</p>
        </div>
    );
}