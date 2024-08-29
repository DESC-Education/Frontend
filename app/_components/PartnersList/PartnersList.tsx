import { IPartner } from "@/app/_types";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./PartnersList.module.scss";
import classNames from "classnames";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

type PartnersListProps = {
    partners: IPartner[];
};

const PartnersList: FC<PartnersListProps> = ({ partners }) => {
    const swiperRef = useRef<SwiperRef>(null);

    const handlePrev = useCallback(() => {
        if (!swiperRef.current) return;
        swiperRef.current.swiper?.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!swiperRef.current) return;
        swiperRef.current.swiper?.slideNext();
    }, []);

    const [activeSlide, setActiveSlide] = useState(0);

    console.log(partners.length, activeSlide);

    return (
        <div className={styles.partners}>
            <div className={styles.carousel}>
                <button
                    onClick={handlePrev}
                    className={classNames(styles.arrowButton, {
                        [styles.disabled]: activeSlide === 0,
                    })}
                >
                    <img
                        src="icons/arrow.svg"
                        alt="arrow"
                        className={classNames(styles.arrow, styles.arrowPrev)}
                    />
                </button>
                <Swiper
                    onSlideChange={(sw) => setActiveSlide(sw.activeIndex)}
                    ref={swiperRef}
                    className={styles.swiper}
                    slidesPerView={1}
                >
                    {partners.map((partner, index) => (
                        <SwiperSlide
                            className={styles.partnerDetails}
                            key={index}
                        >
                            <div className={styles.partnerLogo}>
                                <img src={partner.logo} alt={partner.name} />
                            </div>
                            <div className={styles.partnerInfo}>
                                <h3 className="title fz48">{partner.name}</h3>
                                <p className="text">{partner.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button
                    onClick={handleNext}
                    className={classNames(styles.arrowButton, {
                        [styles.disabled]: activeSlide === partners.length - 1,
                    })}
                >
                    <img
                        src="icons/arrow.svg"
                        alt="arrow"
                        className={classNames(styles.arrow, styles.arrowNext)}
                    />
                </button>
            </div>
            <div className={styles.partnerLogos}>
                {partners.map((partner, index) => (
                    <img
                        onClick={() =>
                            swiperRef.current?.swiper?.slideTo(index)
                        }
                        key={partner.id}
                        src={partner.logo}
                        alt={partner.name}
                        className={classNames(styles.smallLogo, {
                            [styles.active]: index === activeSlide,
                        })}
                    />
                ))}
            </div>
        </div>
    );
};

export default PartnersList;
