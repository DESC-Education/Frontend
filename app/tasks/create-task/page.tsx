import classNames from "classnames";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";


export default function CreateTaskPage() {
    return (
        <div className={classNames(styles.container, "container")}>
            <div className={styles.taskHeader}>
                <Link href={"/tasks"} className={styles.backButton}>
                    <Image src="/icons/backIcon.svg" width={15} height={15} alt="arrow-left" className={styles.img} />
                    <p className="text green fz20">Вернуться к списку</p>
                </Link>
                <p className="title">
                    Создать задание
                </p>

            </div>
        </div>
    );
}