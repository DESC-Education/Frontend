"use client";

import classNames from "classnames";
import styles from "./Footer.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";

const Footer = () => {
    const pathname = usePathname();

    const { isMobileDevice } = useTypesSelector(
        (state) => state.contentReducer,
    );

    if (pathname.split("/").includes("chat") && isMobileDevice) return null;

    return (
        <div className={classNames(styles.container)}>
            <div className={classNames(styles.wrapper, "container")}>
                {/* Логотип */}
                <div className={styles.logoSection}>
                    <img
                        className={styles.logo}
                        src="/icons/footerLogo.png"
                        alt="logo"
                    />
                </div>

                {/* Юридическая информация */}
                <div className={styles.legalSection}>
                    <h3 className={styles.sectionTitle}>Юридическая информация</h3>
                    <p className={styles.legalText}>Самозанятый Балденко А.В.</p>
                    <p className={styles.legalText}>ИНН: 741707840191</p>
                </div>

                {/* Контакты */}
                <div className={styles.contactsSection}>
                    <h3 className={styles.sectionTitle}>Контакты</h3>
                    <p className={styles.contactText}>
                        <a href="mailto:support@desc-education.ru" className={styles.contactLink}>
                            support@desc-education.ru
                        </a>
                    </p>
                    <p className={styles.contactText}>
                        <a href="tel:+79911320757" className={styles.contactLink}>
                            +7 (991) 132-07-57
                        </a>
                    </p>
                    <div className={styles.socialMedia}>
                        <Link
                            href="https://t.me/studio_desc"
                            className={styles.smItem}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src="/icons/tgFooter.png"
                                alt="telegram"
                                width={30}
                                height={30}
                            />
                        </Link>
                        <Link
                            href="https://vk.com/desc_edu"
                            className={styles.smItem}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src="/icons/vkFooter.png"
                                alt="vkontakte"
                                width={30}
                                height={30}
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Копирайт */}
            <div className={styles.copyrightSection}>
                <div className="container">
                    <p className={styles.copyrightText}>© 2024 - 2025 DESC Education</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
