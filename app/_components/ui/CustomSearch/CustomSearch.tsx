import { useSelect } from "react-select-search";
import styles from "./CustomSearch.module.scss";
import { FC, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Select, { OptionsOrGroups } from "react-select";
import AsyncSelect from "react-select/async";
import "./CustomSearch.scss";
import { CSSTransition } from "react-transition-group";

type CustomSelectProps = {
    options?: OptionsOrGroups<any, any> | undefined;
    className?: string;
    value?: any;
    initValue?: any;
    multiple?: boolean;
    disabled?: boolean;
    onFocus?: (value: any) => void;
    onChange: (value: any) => void;
    search?: boolean;
    errorText?: string;
    isLoading?: boolean;
    asyncSelect?: boolean;
    placeholder?: string;
    loadOptions?: (inputValue: string) => Promise<any[]>;
    noOptionsMessage?: string;
    noDataFoundMessage?: string;
    cacheOptions?: any;
};

const CustomSearch: FC<CustomSelectProps> = ({
    options,
    className = "",
    value,
    initValue = null,
    multiple = false,
    search = true,
    onFocus = () => {},
    onChange,
    disabled = false,
    errorText = "",
    isLoading = false,
    asyncSelect = false,
    placeholder = "",
    loadOptions = () => Promise.resolve([]),
    noOptionsMessage = "Ничего не найдено",
    noDataFoundMessage = "Ничего не найдено",
    cacheOptions = {},
}) => {
    const errorRef = useRef<HTMLParagraphElement>(null);

    const [queryText, setQueryText] = useState("");

    if (asyncSelect) {
        return (
            <>
                <AsyncSelect
                    defaultValue={initValue}
                    cacheOptions={cacheOptions}
                    loadingMessage={() => "Загрузка..."}
                    loadOptions={async (inputValue) => loadOptions(inputValue)}
                    isDisabled={disabled}
                    placeholder={placeholder}
                    className={classNames(styles.selectSearch, className, {
                        error: errorText,
                    })}
                    onInputChange={(e) => setQueryText(e)}
                    classNamePrefix="select"
                    isSearchable={search}
                    value={value}
                    noOptionsMessage={() =>
                        queryText ? noDataFoundMessage : noOptionsMessage
                    }
                    onFocus={onFocus}
                    onChange={(e) => onChange(e)}
                    isLoading={isLoading}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            text: "green",
                            primary25: "rgba(0,0,0,.1)",
                            primary: "rgba(0,0,0,.5)",
                        },
                    })}
                />
                <CSSTransition
                    in={errorText.length !== 0}
                    nodeRef={errorRef}
                    timeout={100}
                    classNames="errorText"
                >
                    <p
                        ref={errorRef}
                        className={classNames("text fz20", styles.errorText)}
                    >
                        {errorText}
                    </p>
                </CSSTransition>
            </>
        );
    }

    return (
        <>
            <Select
                defaultValue={initValue}
                onFocus={onFocus}
                isDisabled={disabled}
                placeholder={placeholder}
                className={classNames(styles.selectSearch, className, {
                    error: errorText,
                })}
                classNamePrefix="select"
                options={options}
                isSearchable={search}
                noOptionsMessage={() => "Ничего не найдено"}
                value={value}
                // menuIsOpen
                onChange={(e) => onChange(e)}
                isLoading={isLoading}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        text: "green",
                        primary25: "rgba(0,0,0,.1)",
                        primary: "rgba(0,0,0,.4)",
                    },
                })}
            />
            <CSSTransition
                in={errorText.length !== 0}
                nodeRef={errorRef}
                timeout={100}
                classNames="errorText"
            >
                <p
                    ref={errorRef}
                    className={classNames("text fz20", styles.errorText)}
                >
                    {errorText}
                </p>
            </CSSTransition>
        </>
    );
};

export default CustomSearch;
