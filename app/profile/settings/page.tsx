"use client";

import {
    ChangeEvent,
    createRef,
    Dispatch,
    ReactNode,
    RefObject,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import styles from "./page.module.scss";
import Button from "@/app/_components/ui/Button/Button";
import Input from "@/app/_components/ui/Input/Input";
import classNames from "classnames";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { userSlice } from "@/app/_store/reducers/userSlice";
import SelectSearch from "react-select-search";
import {
    getCities,
    getFaculties,
    getSkills,
    getSpecialities,
    getUniversities,
} from "@/app/_http/API/profileApi";
import CustomSearch from "@/app/_components/ui/CustomSearch/CustomSearch";
import {
    ICity,
    IFaculty,
    ISkill,
    ISpeciality,
    IStudentProfile,
    IUniversity,
} from "@/app/_types";
import SelectSkills from "@/app/_components/SelectSkills/SelectSkills";
import { AlertContext } from "@/app/_context/AlertContext";

type SettingsState = "general" | "profile" | "security";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsState>("general");
    const { user } = useTypesSelector((state) => state.userReducer);
    const { studentProfile, companyProfile } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { showAlert } = useContext(AlertContext);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const dispatch = useTypesDispatch();
    const { updateCompanyProfile, updateStudentProfile } = userSlice.actions;

    const [cities, setCities] = useState<ICity[]>([]);
    const [currentCity, setCurrentCity] = useState<ICity>();

    const setCitiesBySearch = async (q: string) => {
        const res = await getCities(q);

        if (res.status === 200) {
            setCities(
                res.cities!.map((item) => ({
                    ...item,
                    value: item.id,
                    name: `${item.name} (${item.region})`,
                })),
            );
        }
    };

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

    const [specialities, setSpecialities] = useState<ISpeciality[]>([]);
    const [currentSpeciality, setCurrentSpeciality] = useState<ISpeciality>();

    const setSpecialitiesBySearch = async (q: string) => {
        const res = await getSpecialities(q);

        if (res.status === 200) {
            setSpecialities(
                res.specialities!.map((item) => ({
                    ...item,
                    value: item.id,
                })),
            );
        }
    };

    const [skills, setSkills] = useState<ISkill[]>([]);
    const [currentSkills, setCurrentSkills] = useState<ISkill[]>([]);

    useEffect(() => {
        const asyncFunc = async () => {
            const res = await getSkills("");

            if (res.status === 200) {
                setSkills(
                    res.skills!.map((item) => ({
                        ...item,
                        value: item.id,
                    })),
                );
            }
        };

        asyncFunc();
    }, []);

    const [errors, setErrors] = useState<any>({});
    const [errorsExist, setErrorsExist] = useState<boolean>(false);

    const validateForm = (e: any) => {
        e.preventDefault();

        const errorsTemp: any = {};

        if (studentProfile.firstName?.length <= 3) {
            errorsTemp.firstName = "Введите имя";
        }

        if (studentProfile.lastName?.length <= 3) {
            errorsTemp.lastName = "Введите фамилию";
        }

        if (!studentProfile.city) {
            errorsTemp.city = "Выберите город";
        }

        if (!studentProfile.university) {
            errorsTemp.university = "Выберите университет";
        }

        if (!studentProfile.speciality) {
            errorsTemp.speciality = "Выберите специальность";
        }

        if (!studentProfile.faculty) {
            errorsTemp.faculty = "Выберите факультет";
        }

        if (studentProfile.skills?.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        console.log("errorsTemp", errorsTemp, studentProfile);

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            alert("ok");
        }
    };

    const [logo, setLogo] = useState<File | null>(null);
    const [studentCard, setStudentCard] = useState<File | null>(null);

    const addFileHandler = async (
        file: File,
        fileSetter: Dispatch<SetStateAction<File | null>>,
    ) => {
        if (!file) {
            fileSetter(null);
            return;
        }

        if (!["png", "jpg", "jpeg"].includes(file.type.split("/")[1])) {
            showAlert("Формат файла не поддерживается");
            return;
        }

        fileSetter(file);
    };

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
                        <form
                            onSubmit={validateForm}
                            className={styles.content}
                        >
                            <div className={styles.settingsBlock}>
                                <div className={styles.rowSettings}>
                                    <div
                                        className={classNames(
                                            styles.nameSettings,
                                            styles.generalSettingsBlock,
                                        )}
                                    >
                                        <p
                                            className={classNames(
                                                styles.title,
                                                "text fz24 fw500",
                                            )}
                                        >
                                            Имя
                                        </p>
                                        <Input
                                            errorText={errors.firstName}
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
                                                "text fz24 fw500",
                                            )}
                                        >
                                            Фамиилия
                                        </p>
                                        <Input
                                            errorText={errors.lastName}
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        Город
                                    </p>
                                    <CustomSearch
                                        errorText={errors.city}
                                        useFuzzySearch={false}
                                        options={cities}
                                        onInput={(e) => {
                                            setCitiesBySearch(e);
                                        }}
                                        onChange={(e) => {
                                            {
                                                setCurrentCity(
                                                    cities.find(
                                                        (item) => item.id === e,
                                                    ),
                                                );
                                            }
                                        }}
                                        search
                                        value={currentCity?.id}
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        ВУЗ
                                    </p>
                                    <CustomSearch
                                        errorText={errors.university}
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
                                        value={currentUniversity?.id}
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        Факультет (институт)
                                    </p>
                                    <CustomSearch
                                        errorText={errors.faculty}
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
                                        value={currentFaculty?.id}
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        Специальность
                                    </p>
                                    <CustomSearch
                                        errorText={errors.speciality}
                                        useFuzzySearch={false}
                                        disabled={!currentFaculty}
                                        options={specialities}
                                        onInput={(e) => {
                                            setSpecialitiesBySearch(e);
                                        }}
                                        onChange={(e) => {
                                            setCurrentSpeciality(
                                                specialities.find(
                                                    (item) => item.id === e,
                                                ),
                                            );
                                        }}
                                        search
                                        value={currentSpeciality?.id}
                                    />
                                </div>
                                
                                <div className={styles.generalSettingsBlock}>
                                    <p className="text fz24 fw500">Студенческий билет</p>
                                    <label className={styles.fileInput}>
                                        <input
                                            type="file"
                                            onChange={async (e) => {
                                                if (!e.target.files) return;

                                                addFileHandler(
                                                    e.target.files[0],
                                                    setStudentCard,
                                                );
                                            }}
                                        />
                                        {studentCard ? (
                                            <img
                                                className={styles.userImage}
                                                src={URL.createObjectURL(studentCard)}
                                                alt="logo"
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    src="/icons/add_file.svg"
                                                    alt="add"
                                                />
                                                <div>
                                                    <p className="text fz16 gray">
                                                        Форматы: PNG, JPG, JPEG
                                                    </p>
                                                    <p className="text fz16 gray">
                                                        Максимальный вес: 5МБ
                                                    </p>
                                                    <p className="text fz16 gray">
                                                        Ваше имя, лицо и институт должны быть четко различимы 
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                                <div className={styles.rowSettings}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <p
                                            className={classNames(
                                                styles.title,
                                                "text fz24 fw500",
                                            )}
                                        >
                                            Форма обучения
                                        </p>
                                        <CustomSearch
                                            useFuzzySearch={false}
                                            options={[
                                                {
                                                    name: "Очное",
                                                    value: "full_time",
                                                },
                                                {
                                                    name: "Очно-заочное",
                                                    value: "part_full_time",
                                                },
                                                {
                                                    name: "Заочное",
                                                    value: "part_time",
                                                },
                                            ]}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        formOfEducation: e,
                                                    }),
                                                );
                                            }}
                                            value={
                                                studentProfile?.formOfEducation ??
                                                "full_time"
                                            }
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
                                                "text fz24 fw500",
                                            )}
                                        >
                                            Год поступления
                                        </p>
                                        <SelectSearch
                                            options={Array(
                                                new Date().getFullYear() -
                                                    1984 +
                                                    1,
                                            )
                                                .fill(0)
                                                .map((_, i) => ({
                                                    name: String(i + 1984),
                                                    value: i + 1984,
                                                }))}
                                            onChange={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        admissionYear: Number(
                                                            e,
                                                        ),
                                                    }),
                                                )
                                            }
                                            value={String(
                                                studentProfile?.admissionYear,
                                            )}
                                        />
                                        {/* <Input
                                        max={2024}
                                        type="number"
                                        value={String(
                                            studentProfile?.admissionYear,
                                        )}
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    admissionYear: Number(e),
                                                }),
                                            )
                                        }
                                    /> */}
                                    </div>
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        Telegram (не обязательно)
                                    </p>
                                    <Input
                                        type="text"
                                        placeholder="@Nickname"
                                        value={
                                            "https://t.me/" +
                                            (studentProfile?.telegramLink
                                                ? studentProfile?.telegramLink
                                                : "")
                                        }
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    telegramLink: e.slice(13),
                                                }),
                                            )
                                        }
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        Вконтакте (не обязательно)
                                    </p>
                                    <Input
                                        type="text"
                                        placeholder="@Nickname"
                                        value={
                                            "https://vk.com/" +
                                            (studentProfile?.vkLink
                                                ? studentProfile?.vkLink
                                                : "")
                                        }
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    vkLink: e.slice(15),
                                                }),
                                            )
                                        }
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
                                            "text fz24 fw500",
                                        )}
                                    >
                                        О себе (не обязательно)
                                    </p>
                                    <Input
                                        value={
                                            studentProfile?.description ?? ""
                                        }
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    description: e,
                                                }),
                                            )
                                        }
                                        type="textarea"
                                        containerClassName={styles.textArea}
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.yearSettings,
                                        styles.generalSettingsBlock,
                                    )}
                                >
                                    <SelectSkills
                                        maxItems={15}
                                        options={skills}
                                        title="Выберите навыки"
                                        selectValues={(e) =>
                                            setCurrentSkills(e)
                                        }
                                        values={currentSkills}
                                        errorText={errors.skills}
                                    />
                                    {/* <p className={classNames(styles.errorText, "text fz20 red")}>{errors.skills}</p> */}
                                </div>
                                <p
                                    className={classNames(
                                        styles.errorText,
                                        "text fz24 fw500 red",
                                    )}
                                >
                                    {errorsExist &&
                                        "Проверьте введенные данные"}
                                </p>
                                <Button
                                    // disabled={errorsExist}
                                    htmlType="submit"
                                    className={styles.saveButton}
                                    type="secondary"
                                >
                                    Сохранить изменения
                                </Button>
                            </div>
                        </form>
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

    if (!user.email) return null;

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
