import { FC, useContext, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import styles from "./Timer.module.scss";
import classNames from "classnames";

import playIcon from "../../../assets/play.png";
import pauseIcon from "../../../assets/pause.png";
import refreshIcon from "../../../assets/refreshArrowBlack.png";
import { AlertContext } from "@/app/_context/AlertContext";
import { correctTime } from "@/app/_utils/time";

export type TimerState = "running" | "paused" | "stopped";

type TimerProps = {
    time: number;
    className?: string;
    onStart?: () => void;
    onPause?: (currentTime: number) => void;
    onRestart?: (currentTime: number) => void;
    updateTime?: (time: number) => void;
    controls?: boolean;
    state?: TimerState;
    handlerTimeUp?: () => void;
    autostart?: boolean;
};

const Timer: FC<TimerProps> = ({
    time,
    className,
    onStart,
    onPause,
    onRestart,
    updateTime,
    controls = true,
    autostart = false,
    handlerTimeUp = () => {},
    state = "paused",
}) => {
    const { showAlert } = useContext(AlertContext);

    const [timeIsUp, setTimeIsUp] = useState<boolean>(false);

    let {
        seconds,
        minutes,
        isRunning,
        resume,
        pause,
        restart,
        totalSeconds,
    } = useTimer({
        expiryTimestamp: new Date(Date.now() + 1000 * time),
        autoStart: autostart,
        onExpire: () => {
            handlerTimeUp();
            setTimeIsUp(true);
        },
    });

    useEffect(() => {        
        if (state === "paused") {
            pause();
        } else if (state === "running") {
            resume();
        } else {
            restart(new Date(Date.now() + 1000 * time));
            pause();
        }
    }, [state, time]);

    return (
        <div className={classNames(styles.container, className)}>
            <p
                className={classNames("text normal fz20", styles.time, {
                    [styles.red]: timeIsUp,
                })}
            >
                {correctTime(minutes)}:{correctTime(seconds)}
            </p>
            {/* {controls && (
                <div className={styles.controls}>
                    {isRunning ? (
                        <img
                            onClick={() => {
                                pause();
                                onPause && onPause(totalSeconds);
                            }}
                            className={styles.icon}
                            src={pauseIcon}
                            alt="pause"
                            title="pause"
                        />
                    ) : (
                        <img
                            onClick={() => {
                                if (timeIsUp) return;
                                resume();
                                setTimeIsUp(false);
                                onStart && onStart();
                            }}
                            className={classNames(styles.icon, {
                                [styles.blur]: timeIsUp,
                            })}
                            src={playIcon}
                            alt="play"
                            title="play"
                        />
                    )}
                </div>
            )} */}

            {/* {controls && (
                <img
                    onClick={() => {
                        restart(new Date(Date.now() + 1000 * time));
                        setTimeIsUp(false);
                        pause();
                        onRestart && onRestart(time);
                        onPause && onPause(time);
                    }}
                    className={classNames(styles.icon, styles.big)}
                    src={refreshIcon}
                    alt="refreshIcon"
                    title="refreshIcon"
                />
            )} */}
        </div>
    );
};

export default Timer;
