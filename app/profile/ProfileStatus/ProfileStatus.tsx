import { IVerification, VerificationStatuses } from "@/app/_types";
import styles from "./ProfileStatus.module.scss";
import { FC } from "react";
import Link from "next/link";
import Button from "@/app/_components/ui/Button/Button";

type ProfileStatusProps = {
    profileVerification: IVerification;
};

const ProfileStatus: FC<ProfileStatusProps> = ({ profileVerification }) => {
    if (profileVerification.status === "not_verified")
        return (
            <div className={styles.emptyProfile}>
                <img src="/images/questions.png" alt="questions" />
                <p className="text fz24 fw500">Ваш профиль не верифицирован!</p>
                <Link href="/profile/settings">
                    <Button type="secondary">Исправить!</Button>
                </Link>
            </div>
        );

    if (profileVerification.status === "on_verification")
        return (
            <div className={styles.emptyProfile}>
                <img src="/images/pending.png" alt="questions" />
                <p className="text fz24 fw500">
                    Ваш профиль находится на верификации!
                </p>
                <p className="text fz20">Пожалуйста, подождите немного</p>
            </div>
        );

    if (profileVerification.status === "rejected")
        return (
            <div className={styles.emptyProfile}>
                <img src="/images/questions.png" alt="questions" />
                <p className="text fz24 fw500">
                    Заявка не верификацию была отклонена!
                </p>
                <p className="text fz20">{profileVerification.comment}</p>
                <Link href="/profile/settings">
                    <Button type="secondary">Исправить!</Button>
                </Link>
            </div>
        );
};

export default ProfileStatus;
