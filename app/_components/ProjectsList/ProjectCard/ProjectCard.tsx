import classNames from "classnames";
import React, { FC } from "react";
import styles from "./ProjectCard.module.scss";
import { IProject } from "@/app/_types";
import Link from "next/link";

type ProjectCardProps = {
    project: IProject;
};

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
    return (
        <Link href={project.id} className={styles.projectCard}>
            {project.img && (
                <img src={project.img} alt="icon" className={styles.image} />
            )}
            <div className={styles.content}>
                <img src={project.avatar} alt="avatar" />
                <p className="text">{project.name}</p>
            </div>
        </Link>
    );
};

export default ProjectCard;
