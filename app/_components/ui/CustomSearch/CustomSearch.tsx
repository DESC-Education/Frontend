import { useSelect } from "react-select-search";
import styles from "./CustomSearch.module.scss";
import { FC, useMemo } from "react";
import classNames from "classnames";

type CustomSelectProps = {
    options: any[];
    value?: any;
    multiple?: boolean;
    useFuzzySearch?: boolean;
    disabled?: boolean;
    onInput?: (value: any) => void;
    onChange: (value: any) => void;
    search?: boolean;
    errorText?: string;
    isFirstOptionBlank?: boolean;
};

const CustomSearch: FC<CustomSelectProps> = ({
    options,
    value,
    multiple = false,
    search = true,
    onInput = () => {},
    onChange,
    useFuzzySearch = true,
    disabled = false,
    errorText = "",
    isFirstOptionBlank = false,
}) => {
    const [snapshot, valueProps, optionProps]: any = useSelect({
        options,
        value,
        useFuzzySearch,
        closeOnSelect: true,
        onChange,
        multiple,
        search,
    });

    const currOptions = useMemo(() => {
        if (isFirstOptionBlank && snapshot.search === "") {
            return snapshot.options.slice(1);
        }
        return snapshot.options;
    }, [isFirstOptionBlank, snapshot.options, snapshot.search]);

    return (
        <>
            <div
                className={classNames(styles.selectSearch, {
                    [styles.disabled]: disabled,
                })}
            >
                <input
                    disabled={disabled}
                    {...valueProps}
                    onInput={(e: any) => {
                        onInput(e.target.value);
                    }}
                    className={classNames({ [styles.error]: errorText })}
                    value={snapshot.focus ? snapshot.search : valueProps.value}
                />
                {/* {snapshot.focus && ( */}
                <ul
                    className={classNames(styles.select, {
                        [styles.hasFocus]: snapshot.focus,
                    })}
                >
                    {currOptions.map((option: any, index: number) => (
                        <li className={styles.row} key={index}>
                            <button {...optionProps} value={option.value}>
                                {option.name}
                            </button>
                        </li>
                    ))}
                </ul>
                {/* )} */}
            </div>
            {errorText && (
                <p className={classNames(styles.errorText, "text fz20 red")}>
                    {errorText}
                </p>
            )}
        </>
    );
};

export default CustomSearch;
