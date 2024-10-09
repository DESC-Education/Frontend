import classNames from "classnames";
import styles from "./page.module.scss";
import BackButton from "../_components/ui/BackButton/BackButton";

const levels = [
    {
        id: "1",
        name: "Начинающий",
        value: 0,
        color: "#CEE9F4",
        description: `Студенты на начальных курсах обучения.\nУспешно завершенные проекты: менее 15.\nНачальные знания в области информационных технологий и программирования.
        `,
    },
    {
        id: "2",
        name: "Средний",
        value: 1,
        color: "#FDF5A9",
        description: `Студенты на средних курсах обучения.\nУспешно завершенные проекты: от 15 до 30.\nЗнания в области информационных технологий и программирования на среднем уровне.
        `,
    },
    {
        id: "3",
        name: "Продвинутый",
        color: "#D0F5CD",
        value: 2,
        description: `Студенты на последних курсах обучения.\nУспешно завершенные проекты: более 30.\nПродвинутые навыки в области IT-разработки, программирования и информационных технологий.
        `,
    },
];

const LevelPage = () => {
    return (
        <div className={classNames(styles.container, "container")}>
            <BackButton />
            <p className="title">Уровни DESC Education</p>
            <div className={styles.levels}>
                {levels.map((level, index) => (
                    <div
                        key={index}
                        className={styles.level}
                        style={{
                            border: `1px solid ${level.color}`,
                        }}
                    >
                        <div
                            className={styles.header}
                            style={{ backgroundColor: level.color }}
                        >
                            <p className="title fw500">{level.name}</p>
                        </div>
                        {/* <p className={classNames("text fw500", styles.description)}> */}
                        {level.description.split("\n").map((line, index) => (
                            <p className="text fw500" key={index}>
                                {line}
                            </p>
                        ))}
                        {/* </p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelPage;
