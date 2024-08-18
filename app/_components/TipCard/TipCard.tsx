import classNames from "classnames";
import styles from "./TipCard.module.scss";
import Image from "next/image";

export enum TipTypeBackground {
    GREEN = "rgba(var(--green), 1)",
    YELLOW = "rgba(var(--yellow), 1)",
}


type TipCardProps = {
    title: string;
    description: string;
    image: string;
    BackgroundType?: TipTypeBackground;

};

const TipCard: React.FC<TipCardProps> = ({
    title,
    description,
    image,
    BackgroundType = TipTypeBackground.YELLOW,
}) => {
    return (
        <div className={styles.tipCard} style={{
            backgroundColor: BackgroundType,
        }}>
            <img src={image} alt="" className={styles.tipImage}/>
            
            <div className={classNames(styles.tipTitle, "title")}>{title}</div>
            <div className={classNames(styles.tipDescription, "text gray")}>{description}</div>
        </div>
    )
}

export default TipCard;