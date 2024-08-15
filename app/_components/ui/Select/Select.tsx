import { FC } from "react";
import { useSelect } from "react-select-search";

type SelectProps = {
    options: any;
    value: string;
    multiple: boolean;
};

const Select: FC<SelectProps> = ({ options, value, multiple }) => {
    const [snapshot, valueProps, optionProps]: any = useSelect({
        options,
        value,
        search: true,
        multiple,
        // disabled,
    });

    return (
        <div>
            <input
                {...valueProps}
                // value={snapshot.displayValue}
            />
            {snapshot.focus && (
                <ul>
                    {snapshot.options.map((option: any) => (
                        <li key={option.value}>
                            <button {...optionProps} value={option.value}>
                                {option.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;
