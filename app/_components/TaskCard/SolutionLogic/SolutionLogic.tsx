import { FC } from "react";
import styles from "./SolutionLogic.module.scss";

type SolutionLogicProps = {
    solutionId: string;
};

const SolutionLogic: FC<SolutionLogicProps> = ({ solutionId }) => {
    return <div className={styles.container}>{solutionId}</div>;
};

export default SolutionLogic;
