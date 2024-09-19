import { IReview } from "@/app/_types";
import styles from "./ReviewsItem.module.scss";
import { FC } from "react";
import Image from "next/image";

type ReviewsItemProps = {
    review: IReview;
};

const ReviewsItem: FC<ReviewsItemProps> = ({ review }) => {
    return (
        <div className={styles.container}>
            <div className={styles.reviewContent}>
                <div className={styles.reviewProfile}>
                    <Image
                        src={review.profile.logoImg}
                        alt="logo"
                        width={40}
                        height={40}
                    />
                    <p className="text fw500">{review.profile.companyName}</p>
                    <p className={styles.rating}>
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <img
                                    key={index}
                                    src={`/icons/star${
                                        index < review.rating ? "" : "_inactive"
                                    }.svg`}
                                    alt="star"
                                />
                            ))}
                    </p>
                </div>
                <div className={styles.reviewText}>
                    <p className="text fw500">{review.title}</p>
                    <p className="text gray">{review.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewsItem;
