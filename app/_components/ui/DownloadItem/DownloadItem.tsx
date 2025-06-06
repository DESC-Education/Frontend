"use client";

import { FC, useState } from "react";
import styles from "./DownloadItem.module.scss";
import classNames from "classnames";

type DownloadItemProps = {
    name: string;
    url: string;
    extension: string;
    showcase?: boolean;
};

const DownloadItem: FC<DownloadItemProps> = ({
    extension,
    name,
    url,
    showcase,
}) => {
    const [isHover, setIsHover] = useState(false);

    if (showcase) {
        return <div>
            <div
                className={styles.container}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <div className={styles.imgBlock}>
                    <img
                        className={classNames(styles.img, {
                            [styles.hover]: isHover,
                        })}
                        alt="icon"
                        src={`/icons/extensions/${extension}.png`}
                    />
                    <img
                        className={classNames(styles.imgHover, {
                            [styles.hover]: isHover,
                        })}
                        alt="icon"
                        src={`/icons/extensions/${extension}_hover.png`}
                    />
                </div>
                <p className="text fz20">{name}</p>
            </div>
        </div>
    }

    return (
        <a href={url} target="_blank" rel="noreferrer">
            <div
                className={styles.container}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <div className={styles.imgBlock}>
                    <img
                        className={classNames(styles.img, {
                            [styles.hover]: isHover,
                        })}
                        alt="icon"
                        src={`/icons/extensions/${extension}.png`}
                    />
                    <img
                        className={classNames(styles.imgHover, {
                            [styles.hover]: isHover,
                        })}
                        alt="icon"
                        src={`/icons/extensions/${extension}_hover.png`}
                    />
                </div>
                <p className="text fz20">{name}</p>
            </div>
        </a>
    );
};

export default DownloadItem;
