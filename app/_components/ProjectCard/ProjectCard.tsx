import classNames from "classnames";
import React, { FC } from "react";
import styles from "./ProjectCard.module.scss";

type ProjectCardProps = {
    nickName: string;
    image: string;
    userIcon: string;
    onClick?: () => void;
};

const ProjectCard: FC<ProjectCardProps> = ({ nickName, image, userIcon, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={styles.projectCard}
        >
            {image && <img src={image} alt="icon" className={styles.image}/>}
            <div className={styles.content}>
                <img src={userIcon} alt="" />
                <p className="text">{nickName}</p>
            </div>
        </div>
    );
};

export default ProjectCard;