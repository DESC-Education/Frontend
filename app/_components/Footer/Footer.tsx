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
                <img
                    className={styles.logo}
                    src="/icons/footerLogo.png"
                    alt="logo"
                />
                <div className={styles.sm}>
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
                        <p className="text white">Telegram</p>
                    </Link>
                    <Link
                        href="https://vk.com/desc_edu"
                        className={styles.smItem}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            src="/icons/vkFooter.png"
                            alt="telegram"
                            width={30}
                            height={30}
                        />
                        <p className="text white">Вконтакте</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
