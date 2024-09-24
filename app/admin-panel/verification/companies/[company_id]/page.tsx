"use client"


import Image from 'next/image';
import styles from './page.module.scss';
import classNames from 'classnames';
import Button from '@/app/_components/ui/Button/Button';
import { link } from 'fs';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AlertContext } from '@/app/_context/AlertContext';
import { answerVerifyRequest, getRequest } from '@/app/_http/API/adminApi';
import { IVerificationCompanyRequest } from '@/app/_types';
import { profileVerifySlice } from '@/app/_store/reducers/profileVerifySlice';
import { useTypesDispatch } from '@/app/_hooks/useTypesDispatch';
import { Oval } from 'react-loader-spinner';
import Input from '@/app/_components/ui/Input/Input';


export default function CompanyPage() {

    const { company_id } = useParams();

    const { showAlert } = useContext(AlertContext);

    const { removeCompanyVerification } = profileVerifySlice.actions;
    const dispatch = useTypesDispatch();

    const router = useRouter();

    useEffect(() => {
        const asyncFunc = async () => {
            if (typeof company_id !== "string") return;

            const data = await getRequest(company_id);
            setCompanyVerificationProfile(data.request);
        };
        asyncFunc();
    }, []);

    const [companyVerificationProfile, setCompanyVerificationProfile] = useState<IVerificationCompanyRequest | null>(null);

    const handleApplyRequest = async () => {
        if (typeof company_id !== "string") return;

        const res = await answerVerifyRequest(company_id, { status: "approved", comment: "Успешная верификация!" });

        if (res.status === 200) {
            showAlert(
                "Компания успешно верефицирована!",
                "success",
            );
        }
        else {
            showAlert(
                "Ошибка верификации компании",
                "error",
            );
        }

        dispatch(profileVerifySlice.actions.removeCompanyVerification({ companyId: company_id }));
        router.push("/admin-panel/verification/companies");

    }

    const handleRejectRequest = async () => {

        if (isReasonVisible === false) {
            setIsReasonVisible(true);
            return;
        }

        if (reasonText.length < 5) {
            setReasonError("Укажите коррекнтую причину отказа");
            return;
        }

        if (typeof company_id !== "string") return;

        const res = await answerVerifyRequest(company_id, { status: "rejected", comment: reasonText });

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

        dispatch(profileVerifySlice.actions.removeCompanyVerification({ companyId: company_id }));
        router.push("/admin-panel/verification/companies");

    }

    const [isReasonVisible, setIsReasonVisible] = useState<boolean>(false);
    const [reasonText, setReasonText] = useState<string>("");
    const [reasonError, setReasonError] = useState<string>("");

    if (!companyVerificationProfile) return (<div className={styles.loading}><Oval /></div>);

    return (
        <div className={styles.companyRequest}>
            <div className={styles.info}>
                <div className={styles.header}>
                    {/* <div className={styles.avatar}>
                        <Image src="/images/userImage10.png" alt="userIcon" width={100} height={100} />
                    </div> */}
                    <div className={styles.firstInfo}>
                        <div className={styles.name}>
                            <div className="title">{companyVerificationProfile.profile.companyName}</div>
                        </div>
                        <div className={styles.location}>
                            <div className='text gray fz20'>{companyVerificationProfile.profile.city.name}, {companyVerificationProfile.profile.city.region}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Контактное лицо</p>
                        <div className={classNames('text', styles.info)}>{companyVerificationProfile.profile.firstName} {companyVerificationProfile.profile.lastName} </div>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Связь</p>

                        {companyVerificationProfile?.profile.telegramLink && <div className={classNames('text', styles.info)}>Телеграм: {<a className='text under' href={companyVerificationProfile.profile.telegramLink}>@{companyVerificationProfile?.profile.telegramLink.slice(13)}</a>}</div>}
                        {companyVerificationProfile?.profile.vkLink && <div className={classNames('text', styles.info)}>ВКонтакте: {<a className='text under' href={companyVerificationProfile.profile.vkLink}>@{companyVerificationProfile?.profile.vkLink.slice(20)}</a>}</div>}
                        {companyVerificationProfile?.profile.phone && <div className={classNames('text', styles.info)}>Телефон: {<p>{companyVerificationProfile.profile.phone}</p>}</div>}

                        {/* <div className={classNames('text', styles.info)}>Электронная почта: {<p>email@mail.com</p>}</div> */}
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={classNames('text fw500', styles.title)}>Информация</p>
                        <div className={classNames('text', styles.info)}>О компании: {<p>{companyVerificationProfile?.profile.description}</p>}</div>
                        <div className={classNames('text', styles.info)}>Ссылка на сайт: {<a className='text under' href={companyVerificationProfile.profile.linkToCompany}>{companyVerificationProfile?.profile.linkToCompany}</a>}</div>
                        <div className={classNames('text', styles.skills)}>
                            Используемые навыки:
                            {companyVerificationProfile?.profile.skills.map((skill, index) => (
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
                            {companyVerificationProfile?.verificationFiles.map((document, index) => (
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