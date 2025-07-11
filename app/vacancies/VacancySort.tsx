import React from "react";
import styles from "./VacancySort.module.scss";

const options = [
    { label: "Рекомендации", value: "recommend" },
    { label: "Сначала новые", value: "new" },
    { label: "Сначала старые", value: "old" },
    { label: "По зарплате (убыв.)", value: "salary_desc" },
    { label: "По зарплате (возр.)", value: "salary_asc" },
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const VacancySort: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className={styles.sortBox}>
            <span className={styles.label}>Сортировка:</span>
            <select
                className={styles.select}
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};

export default VacancySort; 