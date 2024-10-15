import { FC } from "react";
import { Oval } from "react-loader-spinner";

type CustomOvalProps = {
    width?: number;
    height?: number;
    color?: string;
    secondaryColor?: string;
};

const CustomOval: FC<CustomOvalProps> = ({
    width = 80,
    height = 80,
    color = "rgba(var(--black), 1)",
    secondaryColor = "rgba(var(--gray1), .6)",
}) => {
    return (
        <Oval
            width={width}
            height={height}
            color={color}
            secondaryColor={secondaryColor}
        />
    );
};

export default CustomOval;
