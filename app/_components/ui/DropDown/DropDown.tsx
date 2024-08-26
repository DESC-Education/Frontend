"use client";

import React, { useState } from "react";
import styles from "./DropDown.module.scss";
import classNames from "classnames";
import Link from "next/link";

type Option = {
    label: string;
    value: string;
    href?: string;
};

type DropdownProps = {
    options: Option[];
    placeholder?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("");

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectedLabel =
        options.find((option) => option.value === selectedValue)?.label ||
        placeholder;

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                <p
                    className={classNames(
                        "text fz24 fw500",
                        styles.selectedOption,
                    )}
                >
                    {selectedLabel}
                </p>
                <div
                    className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
                ></div>
            </div>
            {isOpen && (
                <div
                    className={classNames(
                        styles.dropdownList,
                        isOpen ? styles.open : "",
                    )}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={classNames(
                                "text fz24 fw500",
                                styles.item,
                                selectedValue === option.value
                                    ? styles.selected
                                    : "",
                            )}
                            onClick={() => handleSelect(option.value)}
                        >
                            <Link
                                href={option.href || "#"}
                                className={styles.dropdownLink}
                            >
                                {option.label}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
