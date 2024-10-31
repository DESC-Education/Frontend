import { IReview } from "@/app/_types";
import styles from "./ReviewsItem.module.scss";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

type ReviewsItemProps = {
    review: IReview;
};

const ReviewsItem: FC<ReviewsItemProps> = ({ review }) => {

    return (
        <div onClick={() => console.log(review)} className={styles.container}>
            <div className={styles.reviewContent}>
                <div className={styles.reviewProfile}>
                    <Link
                        href={`/profile/company/${review.companyProfile?.id}`}
                        className={styles.avatar}
                    >
                        <img
                            className={styles.logo}
                            src={
                                review.companyProfile?.logoImg
                                    ? process.env.NEXT_PUBLIC_SERVER_PATH +
                                      review.companyProfile.logoImg
                                    : "/images/avatar.png"
                            }
                            alt="logo"
                        />
                        <p className="text fw500">
                            {review.companyProfile?.companyName}
                        </p>
                    </Link>
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
                    <p className="text gray">{review.text}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewsItem;
