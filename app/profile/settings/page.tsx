"use client";

import { createRef, ReactNode, RefObject, useState } from "react";
import styles from "./page.module.scss";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import classNames from "classnames";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import SelectSearch from "react-select-search";
import { getFaculties, getUniversities } from "@/app/_http/API/profileApi";
import CustomSearch from "@/app/_components/ui/CustomSearch/CustomSearch";
import { IFaculty, IUniversity } from "@/app/_types";

type SettingsState = "general" | "profile" | "security";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsState>("general");
    const { user } = useTypesSelector((state) => state.userReducer);
    const { studentProfile, companyProfile } = useTypesSelector(
        (state) => state.userReducer,
    );

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const dispatch = useTypesDispatch();
    const { updateCompanyProfile, updateStudentProfile } = userSlice.actions;

    const [universities, setUniversities] = useState<IUniversity[]>([]);
    const [currentUniversity, setCurrentUniversity] = useState<IUniversity>();

    const setUniversitiesBySearch = async (q: string) => {
        const res = await getUniversities(q);

        if (res.status === 200) {
            setUniversities(
                res.universities!.map((item) => ({
                    ...item,
                    value: item.id,
                    name: `${item.name} (${item.city.name})`,
                })),
            );
        }
    };

    const [faculties, setFaculties] = useState<IFaculty[]>([]);
    const [currentFaculty, setCurrentFaculty] = useState<IFaculty>();

    const setFacultiesBySearch = async (q: string) => {
        const res = await getFaculties(q, currentUniversity?.id);

        if (res.status === 200) {
            setFaculties(
                res.faculties!.map((item) => ({
                    ...item,
                    value: item.id,
                })),
            );
        }
    };

    console.log("currentUniversity", currentUniversity, !!currentUniversity);

    const getSettingsContent = (
        activeTab: SettingsState,
    ): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>;
    } => {
        switch (activeTab) {
            case "general":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={styles.settingsBlock}>
                                <div
                                    className={classNames(
                                        styles.hoursSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Часовой пояс
                                    </p>
                                    <SelectSearch
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    timezone: Number(e),
                                                }),
                                            )
                                        }
                                        value={String(studentProfile?.timezone)}
                                        search
                                        options={[
                                            {
                                                name: "Калининград, UTC+2",
                                                value: 2,
                                            },
                                            {
                                                name: "Москва, UTC+3",
                                                value: 3,
                                            },
                                            {
                                                name: "Самара UTC+4",
                                                value: 4,
                                            },
                                            {
                                                name: "Екатеринбург, UTC+5",
                                                value: 5,
                                            },
                                            { name: "Омск, UTC+6", value: 6 },
                                            {
                                                name: "Красноярск, UTC+7",
                                                value: 7,
                                            },
                                            {
                                                name: "Иркутск, UTC+8",
                                                value: 8,
                                            },
                                            { name: "Чита, UTC+9", value: 9 },
                                            {
                                                name: "Хабаровск, UTC+10",
                                                value: 10,
                                            },
                                        ]}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.phoneSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Телефон
                                    </p>
                                    <p className="text fz24 fw500">
                                        {studentProfile.phone
                                            ? studentProfile.phone
                                            : "Телефон не указан!"}
                                    </p>
                                    {/* <Input type="tel" /> */}
                                    <p
                                        className={classNames(
                                            "text fz24 blue pointer",
                                            styles.linkText,
                                        )}
                                    >
                                        {studentProfile.phone
                                            ? "Сменить"
                                            : "Указать"}{" "}
                                        номер
                                    </p>
                                    <Input
                                        checked={studentProfile.phoneVisibility}
                                        onCheck={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    phoneVisibility: e,
                                                }),
                                            )
                                        }
                                        type="checkbox"
                                        labelContent={
                                            <p className="text fz20">
                                                Показывать в профиле
                                            </p>
                                        }
                                        containerClassName={styles.checkbox}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.emailSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Электронная почта
                                    </p>
                                    <p className="text fz24 fw500">
                                        {user.email}
                                    </p>
                                    <p
                                        className={classNames(
                                            "text fz24 blue pointer",
                                            styles.linkText,
                                        )}
                                    >
                                        Сменить почту
                                    </p>
                                    <Input
                                        checked={studentProfile.emailVisibility}
                                        onCheck={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    emailVisibility: e,
                                                }),
                                            )
                                        }
                                        type="checkbox"
                                        labelContent={
                                            <p className="text fz20">
                                                Показывать в профиле
                                            </p>
                                        }
                                        containerClassName={styles.checkbox}
                                    />
                                </div>
                                <Button
                                    className={styles.saveButton}
                                    type="secondary"
                                >
                                    Сохранить изменения
                                </Button>
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                };
            case "profile":
                return {
                    content: (
                        <div className={styles.content}>
                            <div className={styles.settingsBlock}>
                                <div
                                    className={classNames(
                                        styles.nameSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Имя
                                    </p>
                                    <Input
                                        type="text"
                                        value={studentProfile.firstName}
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    firstName: e,
                                                }),
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.surnameSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Фамиилия
                                    </p>
                                    <Input
                                        type="text"
                                        value={studentProfile.lastName}
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    lastName: e,
                                                }),
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.instituteSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Институт (ВУЗ)
                                    </p>
                                    <CustomSearch
                                        useFuzzySearch={false}
                                        options={universities}
                                        onInput={(e) => {
                                            setUniversitiesBySearch(e);
                                        }}
                                        onChange={(e) => {
                                            setCurrentUniversity(
                                                universities.find(
                                                    (item) => item.id === e,
                                                ),
                                            );
                                        }}
                                        search
                                        value={currentUniversity}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.specialitySettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Факультет (институт)
                                    </p>
                                    <CustomSearch
                                        useFuzzySearch={false}
                                        disabled={!currentUniversity}
                                        options={faculties}
                                        onInput={(e) => {
                                            setFacultiesBySearch(e);
                                        }}
                                        onChange={(e) => {
                                            setCurrentFaculty(
                                                faculties.find(
                                                    (item) => item.id === e,
                                                ),
                                            );
                                        }}
                                        search
                                        value={currentFaculty}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.specialitySettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Специальность
                                    </p>
                                    <CustomSearch
                                        useFuzzySearch={false}
                                        disabled={!currentFaculty}
                                        options={faculties}
                                        onInput={(e) => {
                                            setFacultiesBySearch(e);
                                        }}
                                        onChange={(e) => {
                                            setCurrentFaculty(
                                                faculties.find(
                                                    (item) => item.id === e,
                                                ),
                                            );
                                        }}
                                        search
                                        value={currentFaculty}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.yearSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Год окончания
                                    </p>
                                    <Input type="text" />
                                </div>
                                <div
                                    className={classNames(
                                        styles.yearSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Telegram (не обязательно)
                                    </p>
                                    <Input type="text" value="@Nickname" />
                                </div>
                                <div
                                    className={classNames(
                                        styles.yearSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        О себе
                                    </p>
                                    <Input
                                        type="text"
                                        containerClassName={styles.textArea}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.yearSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.title,
                                            "text fz24",
                                        )}
                                    >
                                        Навыки
                                    </p>
                                    <Input type="text" />
                                </div>
                                <Button
                                    className={styles.saveButton}
                                    type="secondary"
                                >
                                    Сохранить изменения
                                </Button>
                            </div>
                        </div>
                    ),
                    ref: createRef(),
                };
            case "security":
                return {
                    content: (
                        <div className={styles.content}>
                            <div
                                className={classNames(
                                    styles.newPasswordSettings,
                                    styles.generalSettingsBlock,
                                )}
                            >
                                <p
                                    className={classNames(
                                        styles.title,
                                        "title",
                                    )}
                                >
                                    Новый пароль
                                </p>
                                <Input type="password" />
                            </div>
                            <div
                                className={classNames(
                                    styles.repeatNewPasswordSettings,
                                    styles.generalSettingsBlock,
                                )}
                            >
                                <p
                                    className={classNames(
                                        styles.title,
                                        "title",
                                    )}
                                >
                                    Повторите пароль
                                </p>
                                <Input type="password" />
                            </div>
                            <Button
                                className={styles.saveButton}
                                type="secondary"
                            >
                                Сохранить изменения
                            </Button>
                        </div>
                    ),
                    ref: createRef(),
                };
        }
    };

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
    );
};

export default SettingsPage;
