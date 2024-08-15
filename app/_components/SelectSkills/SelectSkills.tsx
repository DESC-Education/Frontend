import { useEffect, useRef, useState } from "react";
import styles from "./SelectSkills.module.scss";
import "./SelectSkills.scss";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import Input from "../ui/Input/Input";
import Image from "next/image";
import classNames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";

type SelectSkillsProps = {
    title: string;
    options: string[];
    maxItems: number;
    values: string[];
    selectValues: (values: string[]) => void;
};

const SelectSkills: React.FC<SelectSkillsProps> = ({
    title,
    options,
    maxItems,
    values,
    selectValues,
}) => {
    const [queryText, setQueryText] = useState("");
    const [mockQueryText, setMockQueryText] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setQueryText(mockQueryText);
        }, 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [mockQueryText]);

    const filteredList = useFuzzySearchList({
        list: options,
        queryText: mockQueryText === "" ? queryText : mockQueryText,
        mapResultItem: ({ item }) => ({
            item,
        }),
    });

    const optionsRef = useRef<HTMLDivElement>(null);

    const addItem = (item: string) => {
        if (values.length < maxItems && !values.includes(item)) {
            selectValues([...values, item]);
        }
    };

    const valuesListRef = useRef<any>(null);

    return (
        <div className={styles.container}>
            <p className="title fw32">
                {title}{" "}
                {values.length > maxItems - 1 && `(максимум ${maxItems})`}
            </p>
            <div className={styles.values}>
                <CSSTransition
                    unmountOnExit
                    in={values.length === 0}
                    timeout={200}
                    classNames="values"
                >
                    <p className="text fw500 fz16">Тут пока пусто...</p>
                </CSSTransition>
                <CSSTransition
                    unmountOnExit
                    in={values.length > 0}
                    timeout={200}
                    classNames="values"
                >
                    <TransitionGroup>
                        {values.map((value, index) => (
                            <CSSTransition
                                key={value}
                                timeout={200}
                                classNames="item-value"
                            >
                                <div
                                    onClick={() =>
                                        selectValues(
                                            values.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }
                                    className={styles.value}
                                    key={value}
                                >
                                    <p className="text fw500 fz16">{value}</p>
                                    <img src="/icons/trash.svg" alt="trash" />
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </CSSTransition>
            </div>
            <div className={styles.inputWrapper}>
                <Input
                    onKeyUp={(e) => e.key === "Enter" && addItem(mockQueryText)}
                    containerClassName={styles.input}
                    type="text"
                    value={mockQueryText}
                    onChange={(val) => setMockQueryText(val)}
                />
                <Image
                    className={classNames(styles.applyIcon, {
                        [styles.disabled]:
                            values.length >= maxItems ||
                            values.includes(mockQueryText),
                    })}
                    width={50}
                    height={50}
                    src="/icons/apply.svg"
                    alt="apply"
                    onClick={() => addItem(mockQueryText)}
                />
            </div>
            <CSSTransition
                unmountOnExit
                in={mockQueryText !== ""}
                nodeRef={optionsRef}
                timeout={200}
                classNames="filteredList"
            >
                <div
                    ref={optionsRef}
                    className={classNames(styles.filteredList, "filteredList")}
                >
                    <TransitionGroup>
                        {filteredList
                            .filter(({ item }) => !values.includes(item))
                            .map(({ item }) => (
                                <CSSTransition
                                    className={styles.filteredItem}
                                    key={item}
                                    timeout={200}
                                    classNames="item"
                                >
                                    <p
                                        onClick={() => addItem(item)}
                                        key={item}
                                        className={classNames(
                                            "text fw500 fz16",
                                            styles.filteredItem,
                                        )}
                                    >
                                        {item}
                                    </p>
                                </CSSTransition>
                            ))}
                    </TransitionGroup>
                </div>
            </CSSTransition>
        </div>
    );
};

export default SelectSkills;
