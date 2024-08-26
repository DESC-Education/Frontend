import { FC, useState } from "react";
import styles from "./InfoIcon.module.scss";

import classNames from "classnames";

type InfoIconProps = {
    action: "tooltip" | "modal";
    tooltipContent?: React.ReactElement | string;
    className?: string;
};

const InfoIcon: FC<InfoIconProps> = ({ action, tooltipContent, className }) => {
    const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);

    const hoverHandler = (enter: boolean) => {
        if (action !== "tooltip") return;

        if (enter) {
            setIsShowTooltip(true);
        } else {
            setIsShowTooltip(false);
        }
    };

    return (
        <div className={classNames(styles.container, className)}>
            {action === "tooltip" && (
                <div
                    onMouseEnter={() => isShowTooltip && hoverHandler(true)}
                    onMouseLeave={() => isShowTooltip && hoverHandler(false)}
                    className={classNames(styles.tooltip, {
                        [styles.hide]: !isShowTooltip,
                    })}
                >
                    <p className="text fz20 fw500">{tooltipContent}</p>
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
