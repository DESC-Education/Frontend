"use client"

import Button from '@/app/_components/ui/Button/Button';
import styles from './page.module.scss';
import classNames from 'classnames';
import { useTypesSelector } from '@/app/_hooks/useTypesSelector';
import { use, useContext, useEffect, useState } from 'react';
import { answerVerifyRequest, getRequest } from '@/app/_http/API/adminApi';
import { useParams, useRouter } from 'next/navigation';
import { useTypesDispatch } from '@/app/_hooks/useTypesDispatch';
import { profileVerifySlice } from '@/app/_store/reducers/profileVerifySlice';
import { Oval } from 'react-loader-spinner';
import { IVerificationStudentRequest } from '@/app/_types';
import { formsOfEducation, typeOfSpeciality, yearsOfEducation } from '@/app/_utils/constants';
import { AlertContext } from '@/app/_context/AlertContext';
import Input from '@/app/_components/ui/Input/Input';

export default function StudentPage() {

    const { student_id } = useParams();

    const { showAlert } = useContext(AlertContext);

    const { removeStudentVerification } = profileVerifySlice.actions;
    const dispatch = useTypesDispatch();

    const router = useRouter();

    useEffect(() => {
        const asyncFunc = async () => {
            if (typeof student_id !== "string") return;

            const data = await getRequest(student_id);
            setStudentVerificationProfile(data.request);
        };
        asyncFunc();
    }, []);

    const [studentVerificationProfile, setStudentVerificationProfile] = useState<IVerificationStudentRequest | null>(null);

    const handleApplyRequest = async () => {
        if (typeof student_id !== "string") return;

        const res = await answerVerifyRequest(student_id, { status: "approved", comment: "Успешная верификация!" });

        if (res.status === 200) {
            showAlert(
                "Студент успешно верефицирован!",
                "success",
            );
        }
        else {
            showAlert(
                "Ошибка верификации студента",
                "error",
            );
        }

        dispatch(profileVerifySlice.actions.removeStudentVerification({ studentId: student_id }));
        router.push("/admin-panel/verification/students");

    }

    const [isReasonVisible, setIsReasonVisible] = useState<boolean>(false);
    const [reasonText, setReasonText] = useState<string>("");
    const [reasonError, setReasonError] = useState<string>("");

    const handleRejectRequest = async () => {

        if (isReasonVisible === false) {
            setIsReasonVisible(true);
            return;
        }

        if (reasonText.length < 5) {
            setReasonError("Укажите коррекнтую причину отказа");
            return;
        }

        if (typeof student_id !== "string") return;

        const res = await answerVerifyRequest(student_id, { status: "rejected", comment: reasonText });

        if (res.status === 200) {
            showAlert(
                "Отказ в верификации стдунта!",
                "error",
            );
        }
        else {
            showAlert(
                "Ошибка отказа студента",
                "error",
            );
        }

        dispatch(profileVerifySlice.actions.removeStudentVerification({ studentId: student_id }));
        router.push("/admin-panel/verification/students");

    }


    if (!studentVerificationProfile) return (<div className={styles.loading}><Oval /></div>);

    return (
        <div className={classNames(styles.studentRequest)}>
            <div className={styles.info}>
                <div className={styles.header}>
                    {/* <div className={styles.avatar}>
                        <Image src={""} alt="userIcon" width={100} height={100} />
                    </div> */}
                    <div className={styles.firstInfo}>
                        <div className={styles.name}>
                            <div className="title">{studentVerificationProfile?.profile?.firstName}</div>
                            <div className="title">{studentVerificationProfile?.profile?.lastName},</div>
                            <div className='title'>"{studentVerificationProfile?.profile?.profession}"</div>
                        </div>
                        <div className={styles.location}>
                            <div className='text gray fz20'>{studentVerificationProfile.profile.city.name}, {studentVerificationProfile.profile.city.region}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Образование</p>
                        <div className={classNames('text', styles.info)}>Университет: {<p>{studentVerificationProfile.profile.university.name}</p>}</div>
                        <div className={classNames('text', styles.info)}>Специализация: {<p>{studentVerificationProfile.profile.specialty.name}</p>}</div>
                        <div className={classNames('text', styles.info)}>Факультет: {<p>{studentVerificationProfile.profile.faculty.name}</p>}</div>
                        <div className={classNames('text', styles.info)}>Год поступления: {<p>{studentVerificationProfile.profile.admissionYear} год</p>}</div>
                        <div className={classNames('text', styles.info)}>Выпускная программа: {<p>{typeOfSpeciality.find((item) => item.value === studentVerificationProfile.profile.specialty.type)?.name}, {formsOfEducation.find((item) => item.value === studentVerificationProfile.profile.formOfEducation)?.label}</p>}</div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Связь</p>
                        {studentVerificationProfile.profile.telegramLink && <div className={classNames('text', styles.info)}>Телеграм: {<a className='text under' href={studentVerificationProfile.profile.telegramLink}>@{studentVerificationProfile.profile.telegramLink.slice(13)}</a>}</div>}
                        {studentVerificationProfile.profile.vkLink && <div className={classNames('text', styles.info)}>ВКонтакте: {<a className='text under' href={studentVerificationProfile.profile.vkLink}>@{studentVerificationProfile.profile.vkLink.slice(24)}</a>}</div>}
                        {studentVerificationProfile.profile.phone && <div className={classNames('text', styles.info)}>Телефон: {<p>{studentVerificationProfile.profile.phone}</p>}</div>}
                        {/* <div className={classNames('text', styles.info)}>Электронная почта: {studentVerificationProfile.profile.}</div> */}
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Информация</p>
                        <div className={classNames('text', styles.info)}>О студенте: {<p>{studentVerificationProfile.profile.description}</p>}</div>
                        <div className={classNames('text', styles.skills)}>
                            Навыки:
                            {studentVerificationProfile.profile.skills.map((skill, index) => (
                                <div key={index} className={styles.skill}>
                                    <p className="text fw500">
                                        {skill.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Документы</p>
                        <div className={classNames('text', styles.documents)}>
                            {studentVerificationProfile.verificationFiles.map((document, index) => (
                                <div className={styles.documentItem} key={index}>
                                    <img src={process.env.NEXT_PUBLIC_SERVER_PATH + document} alt="document" className={styles.documentImage} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <div className={classNames(styles.reason, { [styles.hidden]: !isReasonVisible })}>
                    <div className={styles.reasonHeader}>
                        <p className="text fw500">Причина отказа</p>
                        <div className={styles.closeButton} onClick={() => setIsReasonVisible(false)}></div>
                    </div>
                    <Input type="textarea"
                        placeholder="Опишите причину отказа"
                        containerClassName={styles.textarea}
                        value={reasonText}
                        onChange={(e) => (setReasonText(e), setReasonError(""))}
                        errorText={reasonError}
                    />
                </div>
                <Button type="primary" className={styles.button} onClick={handleRejectRequest}>Отклонить</Button>
                <Button type="secondary" className={classNames(styles.button, { [styles.open]: isReasonVisible })} onClick={handleApplyRequest}>Принять</Button>
            </div>
        </div>
    );
}