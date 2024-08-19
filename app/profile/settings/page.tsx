"use client";


import { createRef, ReactNode, RefObject, useState } from "react";
import styles from "./page.module.scss";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import classNames from "classnames";


type SettingsState = "general" | "profile" | "security";



const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsState>("general");

    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const getSettingsContent = (activeTab: SettingsState,): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>
    } => {
        switch (activeTab) {
            case "general":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={styles.settingsBlock}>
                                <div className={classNames(styles.themeSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.themeTitle, "title")}>Тема сайта</p>
                                    <Input type="checkbox" labelContent={<p className="title">Светлая</p>} containerClassName={styles.checkbox} />
                                    <Input type="checkbox" labelContent={<p className={classNames(styles.checkbox, "title")}>Темная</p>} />
                                </div>
                                <div className={classNames(styles.loginSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Логин</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.hoursSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Часовой пояс</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.phoneSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Телефон</p>
                                    <Input type="tel" />
                                    <Input type="checkbox" labelContent={<p className="title">Показывать в профиле</p>} containerClassName={styles.checkbox} />
                                </div>
                                <div className={classNames(styles.emailSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Электронная почта</p>
                                    <Input type="email" />
                                    <Input type="checkbox" labelContent={<p className="title">Показывать в профиле</p>} containerClassName={styles.checkbox} />
                                </div>
                                <Button className={styles.saveButton} type="secondary">Сохранить изменения</Button>
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                }
            case "profile":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={styles.settingsBlock}>
                                <div className={classNames(styles.nameSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Имя</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.surnameSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Фамиилия</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.instituteSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Институт (ВУЗ)</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.specialitySettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Специальность</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.yearSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Год окончания</p>
                                    <Input type="text" />
                                </div>
                                <div className={classNames(styles.yearSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Telegram (не обязательно)</p>
                                    <Input type="text" value="@Nickname" />
                                </div>
                                <div className={classNames(styles.yearSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>О себе</p>
                                    <Input type="text" containerClassName={styles.textArea} />
                                </div>
                                <div className={classNames(styles.yearSettings, styles.generalSettingsBlock)}>
                                    <p className={classNames(styles.title, "title")}>Навыки</p>
                                    <Input type="text" />
                                </div>
                                <Button className={styles.saveButton} type="secondary">Сохранить изменения</Button>
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                }
            case "security":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={classNames(styles.newPasswordSettings, styles.generalSettingsBlock)}>
                                <p className={classNames(styles.title, "title")}>Новый пароль</p>
                                <Input type="password" />
                            </div>
                            <div className={classNames(styles.repeatNewPasswordSettings, styles.generalSettingsBlock)}>
                                <p className={classNames(styles.title, "title")}>Повторите пароль</p>
                                <Input type="password" />
                            </div>
                            <Button className={styles.saveButton} type="secondary">Сохранить изменения</Button>
                        </div>
                    ),
                    ref: createRef(),
                }

        }

    }

    const handleTabChange = (newTab: SettingsState) => {
        if (activeTab === newTab) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(newTab);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <div className={styles.container}>
            <div className={styles.navigationButtons}>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "general" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("general")}
                >
                    Общие
                </Button>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "profile" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("profile")}
                >
                    Профиль
                </Button>
                <Button
                    className={styles.navigationButton}
                    type={activeTab === "security" ? "secondary" : "primary"}
                    onClick={() => handleTabChange("security")}
                >
                    Безопасность
                </Button>
            </div>
            <div
                className={classNames(styles.content, {
                    [styles.exit]: isAnimating,
                })}
            >
                {getSettingsContent(activeTab).content}
            </div>
        </div>
    )
}

export default SettingsPage;
