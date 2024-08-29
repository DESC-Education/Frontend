import { FC } from "react";
import styles from "./ProjectsList.module.scss";
import ProjectCard from "./ProjectCard/ProjectCard";
import { IProject } from "@/app/_types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./swiper.scss";

type ProjectListProps = {
    projects: IProject[];
};

const ProjectsList: FC<ProjectListProps> = ({ projects }) => {
    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={15}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Pagination]}
            className={styles.swiper}
        >
            {projects.map((project, index) => (
                <SwiperSlide className={styles.swiperSlide} key={index}>
                    <ProjectCard project={project} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ProjectsList;
