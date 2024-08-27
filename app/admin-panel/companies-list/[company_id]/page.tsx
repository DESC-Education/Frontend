"use client"

import classNames from "classnames";
import styles from "./page.module.scss"
import Link from "next/link";
import Image from "next/image";


const CompanyPage = () => {
    return (
        <div className={classNames(styles.container, "container")}>
            <div>
                <div className={styles.companyHeader}>
                    <Link href={"/admin-panel/companies-list"} className={styles.backButton}>
                        <Image src="/icons/backIcon.svg" width={15} height={15} alt="arrow-left" className={styles.img}/>
                        <p className="text green fz20">Вернуться к списку</p>
                    </Link>
                    <p className="title">
                         СВО
                    </p>
                </div>
            </div>
        </div>
    )
}
export default CompanyPage;