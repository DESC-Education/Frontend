import { useEffect, useRef, useState } from "react";
import styles from "./SelectSkills.module.scss";
import "./SelectSkills.scss";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import Input from "../ui/Input/Input";
import Image from "next/image";
import classNames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ISkill } from "@/app/_types";

type SelectSkillsProps = {
    title: string;
    options: ISkill[];
    maxItems: number;
    values: ISkill[];
    selectValues: (values: ISkill[]) => void;
    errorText?: string;
    onInput?: (search: string) => void;
    required?: boolean;
};

const SelectSkills: React.FC<SelectSkillsProps> = ({
    title,
    options,
    maxItems,
    values,
    selectValues,
    errorText,
    onInput = () => {},
    required = false,
}) => {
    const [queryText, setQueryText] = useState("");
    const [mockQueryText, setMockQueryText] = useState("");

    useEffect(() => {
        onInput(mockQueryText);
        const timeout = setTimeout(() => {
            setQueryText(mockQueryText);
        }, 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [mockQueryText]);

    const filteredList = useFuzzySearchList({
        list: options,
        getText: (item) => [item.name],
        queryText: mockQueryText === "" ? queryText : mockQueryText,
        mapResultItem: (item) => {
            return item.item;
        },
    });

    const optionsRef = useRef<HTMLDivElement>(null);

    const addItem = (item: ISkill) => {
        if (
            values.length < maxItems &&
            !values.some((skill) => skill.name === item.name)
        ) {
            selectValues([...values, item]);
        }
    };

    // const valuesListRef = useRef<any>(null);

    return (
        <div
            className={classNames(styles.container, {
                [styles.error]: errorText,
            })}
        >
            <p className="text fz24 fw500">
                {title}{" "}
                {values.length > maxItems - 1 && `(максимум ${maxItems})`}{" "}
                {required && <span className={styles.required}>*</span>}
            </p>
            <div className={styles.values}>
                <CSSTransition
                    unmountOnExit
                    in={values.length === 0}
                    timeout={200}
                    classNames="values"
                >
                    <p className="text fz20">
                        Тут пока пусто... (начните вводить название навыка)
                    </p>
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
                                key={value.id}
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
                                >
                                    <p className="text fw500 fz24">
                                        {value.name}
                                    </p>
                                    <img src="/icons/trash.svg" alt="trash" />
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </CSSTransition>
            </div>
            {errorText && <p className="text fz20 fw500 red">{errorText}</p>}
            <div className={styles.inputWrapper}>
                <Input
                    containerClassName={styles.input}
                    type="text"
                    value={mockQueryText}
                    onChange={(val) => setMockQueryText(val)}
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
                            .filter(
                                (item) =>
                                    !values.some(
                                        (skill) => skill.name === item.name,
                                    ),
                            )
                            .map((item) => (
                                <CSSTransition
                                    className={styles.filteredItem}
                                    key={item.id}
                                    timeout={200}
                                    classNames="item"
                                >
                                    <p
                                        onClick={() => addItem(item)}
                                        className={classNames(
                                            // "text fw500 fz24",  
                                            styles.filteredItem,
                                        )}
                                    >
                                        {item.name}
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
