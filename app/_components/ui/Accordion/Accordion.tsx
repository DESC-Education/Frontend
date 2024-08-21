"use client";

import { useState } from "react";
import styles from "./Accordion.module.scss";
import classNames from "classnames";

type AccordionProps = {
    index: number;
    title: string;
    content: string;
};

const Accordion: React.FC<AccordionProps> = ({ index, title, content }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (currentIndex: number) => {
        if (activeIndex === currentIndex) {
            setActiveIndex(null);
        } else {
            setActiveIndex(currentIndex);
        }
    };

    return (
        <div className={classNames(styles.accordion, "container")}>
            <div className={styles.accordionItem}>
                <div
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion(index)}
                >
                    <div className={classNames(styles.accordionIndex, "title")}>{`0${index}`}</div>
                    <h3 className={classNames(styles.accordionTitle, "title")}>{title}</h3>
                    <div
                        className={classNames(styles.accordionIcon, activeIndex === index ? styles.active : "")}
                    />
                </div>
            </div>
            <div
                className={classNames(styles.accordionContent, activeIndex === index ? styles.active : "")}
            >
                <p className="text fz20">{content}</p>
            </div>
        </div>
    );
};

export default Accordion;
