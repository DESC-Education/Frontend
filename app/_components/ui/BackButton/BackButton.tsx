"use client";

import Link from "next/link";
import styles from "./BackButton.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import classNames from "classnames";

type BackButtonProps = {
    title?: string;
    forceUrl?: string;
    className?: string;
};

const BackButton: FC<BackButtonProps> = ({
    title = "Назад",
    forceUrl,
    className,
}) => {
    const router = useRouter();

    return (
        <div
            onClick={() => (forceUrl ? router.push(forceUrl) : router.back())}
            className={classNames(styles.backButton, className)}
        >
            <Image
                src="/icons/backIcon.svg"
                width={15}
                height={15}
                alt="arrow-left"
                className={styles.img}
            />
            <p className="text green fz20">{title}</p>
        </div>
    );
};

export default BackButton;
