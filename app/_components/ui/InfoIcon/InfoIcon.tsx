import { FC, useEffect, useRef, useState } from "react";
import styles from "./InfoIcon.module.scss";

import classNames from "classnames";

type InfoIconProps = {
    action: "tooltip" | "modal";
    tooltipContent?: React.ReactElement | string;
    className?: string;
    toggleContent?: React.ReactElement | string;
};

const InfoIcon: FC<InfoIconProps> = ({
    action,
    tooltipContent,
    className,
    toggleContent,
}) => {
    const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);

    const hoverHandler = (enter: boolean) => {
        if (action !== "tooltip") return;

        if (enter) {
            setIsShowTooltip(true);
        } else {
            setIsShowTooltip(false);
        }
    };

    const tooltipContentWidthRef = useRef<HTMLDivElement>(null);
    const toggleContentWidthRef = useRef<HTMLDivElement>(null);

    const [tooltipWidth, setTooltipWidth] = useState<number>(0);
    const [toggleContentWidth, setToggleContentWidth] = useState<number>(0);

    useEffect(() => {
        if (tooltipContentWidthRef.current) {
            setTooltipWidth(
                tooltipContentWidthRef.current.getBoundingClientRect().width,
            );
        }
    }, [tooltipContentWidthRef]);

    useEffect(() => {
        if (toggleContentWidthRef.current) {
            setToggleContentWidth(
                toggleContentWidthRef.current.getBoundingClientRect().width,
            );
        }
    }, [toggleContentWidthRef]);

    console.log(toggleContentWidth, tooltipWidth);

    return (
        <div
            className={classNames(styles.container, className, {
                [styles.innerContent]: toggleContent,
            })}
        >
            {action === "tooltip" && (
                <div
                    onMouseEnter={() => isShowTooltip && hoverHandler(true)}
                    onMouseLeave={() => isShowTooltip && hoverHandler(false)}
                    style={{ left: toggleContentWidth / 2 - tooltipWidth / 2 - 10 }}
                    className={classNames(styles.tooltip, {
                        [styles.hide]: !isShowTooltip,
                    })}
                >
                    <div
                        ref={tooltipContentWidthRef}
                        className="text fz20 fw500"
                    >
                        {tooltipContent}
                    </div>
                </div>
            )}
            {toggleContent && (
                <div
                    onMouseEnter={() => hoverHandler(true)}
                    onMouseLeave={() => hoverHandler(false)}
                    ref={toggleContentWidthRef}
                >
                    {toggleContent}
                </div>
            )}
            <img
                onMouseEnter={() => hoverHandler(true)}
                onMouseLeave={() => hoverHandler(false)}
                src="/icons/attention.png"
                alt="info"
            />
        </div>
    );
};

export default InfoIcon;
