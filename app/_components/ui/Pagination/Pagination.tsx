import { FC } from "react";
import styles from "./Pagination.module.scss";
import classNames from "classnames";

type PaginationProps = {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
};

const Pagination: FC<PaginationProps> = ({ page, setPage, totalPages }) => {
    return (
        <div className={styles.pagination}>
            {Array(totalPages)
                .fill(0)
                .map((i, ind) => (
                    <div
                        className={classNames(styles.paginationItem, {
                            [styles.active]: page === ind + 1,
                        })}
                        key={ind}
                        onClick={() => setPage(ind + 1)}
                    >
                        <div>{ind + 1}</div>
                    </div>
                ))}
        </div>
    );
};

export default Pagination;
