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
    useMemo,
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
    createProfileStudent,
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
    ISpecialty,
    IStudentProfile,
    IUniversity,
} from "@/app/_types";
import SelectSkills from "@/app/_components/SelectSkills/SelectSkills";
import { AlertContext } from "@/app/_context/AlertContext";
import { formsOfEducation, timezones } from "@/app/_utils/constants";

type SettingsState = "personal_data" | "profile" | "verification";

const SettingsPage = () => {
    const { user } = useTypesSelector((state) => state.userReducer);
    const { studentProfile, companyProfile } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { showAlert } = useContext(AlertContext);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const dispatch = useTypesDispatch();
    const { updateCompanyProfile, updateStudentProfile } = userSlice.actions;

    const [cities, setCities] = useState<ICity[]>([]);

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

    const setFacultiesBySearch = async (q: string) => {
        const res = await getFaculties(q, studentProfile.university?.id);

        if (res.status === 200) {
            setFaculties(
                res.faculties!.map((item) => ({
                    ...item,
                    value: item.id,
                })),
            );
        }
    };

    const [specialities, setSpecialities] = useState<ISpecialty[]>([]);

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

    const [logo, setLogo] = useState<File | null>(null);
    const [studentCard, setStudentCard] = useState<File | null>(null);
    const [verFiles, setVerFiles] = useState<File[] | null>([]);

    useEffect(() => {
        setErrors({});
        setErrorsExist(false);
    }, [studentProfile, studentCard, companyProfile, logo, verFiles]);

    const [errors, setErrors] = useState<any>({});
    const [errorsExist, setErrorsExist] = useState<boolean>(false);

    const validateFormStudent = async () => {
        const errorsTemp: any = {};

        console.log(studentProfile);

        if (studentProfile.firstName?.length < 2) {
            errorsTemp.firstName = "Введите имя";
        }

        if (studentProfile.lastName?.length < 2) {
            errorsTemp.lastName = "Введите фамилию";
        }

        if (studentProfile.timezone === null) {
            errorsTemp.timezone = "Выберите часовой пояс";
        }

        if (!studentProfile.formOfEducation) {
            errorsTemp.formOfEducation = "Выберите форму обучения";
        }

        if (studentProfile.admissionYear === null) {
            errorsTemp.admissionYear = "Выберите год поступления";
        }

        if (!studentProfile.city) {
            errorsTemp.city = "Выберите город";
        }

        if (!studentCard) {
            errorsTemp.studentCard = "Прикрепите студенческий билет";
        }

        if (!studentProfile.university) {
            errorsTemp.university = "Выберите университет";
        }

        if (!studentProfile.specialty) {
            errorsTemp.specialty = "Выберите специальность";
        }

        if (!studentProfile.faculty) {
            errorsTemp.faculty = "Выберите факультет";
        }

        if (studentProfile.skills?.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        console.log(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const formdata = new FormData();

            formdata.append("files", studentCard!, studentCard!.name);
            formdata.append("firstName", studentProfile.firstName);
            formdata.append("lastName", studentProfile.lastName);
            formdata.append("city", studentProfile.city!.id);
            formdata.append("university", studentProfile.university!.id);
            formdata.append("timezone", String(studentProfile.timezone));
            formdata.append("faculty", studentProfile.faculty!.id);
            formdata.append("specialty", studentProfile.specialty!.id);
            formdata.append("formOfEducation", studentProfile.formOfEducation);
            formdata.append(
                "admissionYear",
                String(studentProfile.admissionYear),
            );
            formdata.append("phoneVisibility", "true");
            formdata.append("emailVisibility", "true");
            formdata.append("telegramLink", studentProfile.telegramLink ?? "");
            formdata.append("vkLink", studentProfile.vkLink ?? "");
            formdata.append("description", studentProfile.description ?? "");

            studentProfile.skills.forEach((el, i) => {
                formdata.append(`skills`, el.id);
            });

            const res = await createProfileStudent(formdata);
            console.log("createProfileStudent res", res);
        }
    };

    const validateFormCompany = async () => {
        const errorsTemp: any = {};

        console.log(companyProfile);

        if (!companyProfile.firstName) {
            errorsTemp.firstName = "Введите имя";
        }

        if (!companyProfile.lastName) {
            errorsTemp.lastName = "Введите фамилию";
        }

        if (!companyProfile.companyName) {
            errorsTemp.companyName = "Введите название компании";
        }

        if (companyProfile.timezone === null) {
            errorsTemp.timezone = "Выберите часовой пояс";
        }

        if (!companyProfile.city) {
            errorsTemp.city = "Выберите город";
        }

        if (!logo) {
            errorsTemp.logo = "Прикрепите логотип";
        }

        if (!companyProfile.skills || companyProfile.skills.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        if (!companyProfile.linkToCompany) {
            errorsTemp.linkToCompany = "Введите ссылку на сайт компании";
        }

        if (!companyProfile.description) {
            errorsTemp.description = "Введите описание компании";
        }

        if (verFiles?.length === 0) {
            errorsTemp.verFiles = "Прикрепите файлы";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        console.log(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const formdata = new FormData();

            verFiles!.forEach((el, i) => {
                formdata.append(`verFiles`, el.name);
            });
            formdata.append("companyName", companyProfile.companyName);
            formdata.append("firstName", companyProfile.firstName);
            formdata.append("lastName", companyProfile.lastName);
            formdata.append("linkToCompany", companyProfile.linkToCompany);
            formdata.append("city", companyProfile.city!.id);
            formdata.append("timezone", String(companyProfile.timezone));
            formdata.append("phoneVisibility", "true");
            formdata.append("emailVisibility", "true");
            formdata.append("telegramLink", companyProfile.telegramLink ?? "");
            formdata.append("vkLink", companyProfile.vkLink ?? "");
            formdata.append("description", companyProfile.description ?? "");

            companyProfile.skills.forEach((el, i) => {
                formdata.append(`skills`, el.id);
            });

            const res = await createProfileStudent(formdata);
            console.log("createProfileCompany res", res);
        }
    };

    const getSettingsContent = (
        activeTab: SettingsState,
    ): {
        content: ReactNode;
        ref: RefObject<HTMLDivElement>;
    } => {
        switch (activeTab) {
            case "personal_data":
                return {
                    content: (
                        <form className={styles.content}>
                            <div className={styles.settingsBlock}>
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
                                    <p
                                        className={classNames(
                                            "text fz24 blue pointer",
                                            styles.linkText,
                                        )}
                                    >
                                        {studentProfile.phone
                                            ? "Сменить"
                                            : "Указать"}{" "}
                                    </p>
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
                                        Сменить
                                    </p>
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
                                        Пароль
                                    </p>
                                    <p className="text fz24 fw500">********</p>
                                    <p
                                        className={classNames(
                                            "text fz24 blue pointer",
                                            styles.linkText,
                                        )}
                                    >
                                        Сменить
                                    </p>
                                </div>
                            </div>
                        </form>
                    ),
                    ref: createRef(),
                };
            case "verification":
                return {
                    content:
                        user.role === "student" ? (
                            <form
                                onSubmit={(e) => e.preventDefault()}
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
                                                Фамилия
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
                                            styles.hoursSettings,
                                            styles.generalSettingsBlock,
                                        )}
                                    >
                                        <p
                                            className={classNames(
                                                styles.title,
                                                "text fz24 fw500",
                                            )}
                                        >
                                            Часовой пояс
                                        </p>
                                        <CustomSearch
                                            isFirstOptionBlank
                                            onChange={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        timezone: Number(e),
                                                    }),
                                                )
                                            }
                                            value={
                                                !studentProfile?.timezone
                                                    ? undefined
                                                    : studentProfile.timezone
                                            }
                                            errorText={errors.timezone}
                                            search
                                            options={[
                                                { name: "", value: 0 },
                                                ...timezones,
                                            ]}
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
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        city: cities.find(
                                                            (item) =>
                                                                item.id === e,
                                                        )!,
                                                    }),
                                                );
                                            }}
                                            search
                                            value={studentProfile.city?.id}
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
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        university: universities.find(
                                                            (item) =>
                                                                item.id === e,
                                                        )!,
                                                    }),
                                                );
                                            }}
                                            search
                                            value={
                                                studentProfile.university?.id
                                            }
                                        />
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.specialtySettings,
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
                                            disabled={
                                                !studentProfile.university
                                            }
                                            options={faculties}
                                            onInput={(e) => {
                                                setFacultiesBySearch(e);
                                            }}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        faculty: faculties.find(
                                                            (item) =>
                                                                item.id === e,
                                                        )!,
                                                    }),
                                                );
                                            }}
                                            search
                                            value={studentProfile.faculty?.id}
                                        />
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.specialtySettings,
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
                                            errorText={errors.specialty}
                                            useFuzzySearch={false}
                                            disabled={!studentProfile.faculty}
                                            options={specialities}
                                            onInput={(e) => {
                                                setSpecialitiesBySearch(e);
                                            }}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        specialty: specialities.find(
                                                            (item) =>
                                                                item.id === e,
                                                        )!,
                                                    }),
                                                );
                                            }}
                                            search
                                            value={studentProfile.specialty?.id}
                                        />
                                    </div>

                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <p className="text fz24 fw500">
                                            Студенческий билет
                                        </p>
                                        <Input
                                            type="file"
                                            setFile={setStudentCard}
                                            file={studentCard}
                                            errorText={errors.studentCard}
                                        />
                                    </div>
                                    <div className={styles.rowSettings}>
                                        <div
                                            className={
                                                styles.generalSettingsBlock
                                            }
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
                                                errorText={
                                                    errors.formOfEducation
                                                }
                                                isFirstOptionBlank
                                                useFuzzySearch={false}
                                                options={formsOfEducation}
                                                onChange={(e) => {
                                                    dispatch(
                                                        updateStudentProfile({
                                                            ...studentProfile,
                                                            formOfEducation: e,
                                                        }),
                                                    );
                                                }}
                                                value={
                                                    studentProfile?.formOfEducation
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
                                            <CustomSearch
                                                isFirstOptionBlank
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
                                                value={
                                                    !studentProfile?.admissionYear
                                                        ? undefined
                                                        : studentProfile.admissionYear
                                                }
                                                errorText={errors.timezone}
                                                search
                                                options={[
                                                    { name: "", value: 0 },
                                                    ...Array(
                                                        new Date().getFullYear() -
                                                            1984 +
                                                            1,
                                                    )
                                                        .fill(0)
                                                        .map((_, i) => ({
                                                            name: String(
                                                                i + 1984,
                                                            ),
                                                            value: i + 1984,
                                                        })),
                                                ]}
                                            />
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
                                                        telegramLink: e.slice(
                                                            13,
                                                        ),
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
                                                studentProfile?.description ??
                                                ""
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
                                            selectValues={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        skills: e,
                                                    }),
                                                );
                                            }}
                                            values={studentProfile.skills}
                                            errorText={errors.skills}
                                        />
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
                                        onClick={() => validateFormStudent()}
                                        htmlType="submit"
                                        className={styles.saveButton}
                                        type="secondary"
                                    >
                                        Отправить на верификацию
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className={styles.content}
                            >
                                <button
                                    onClick={() => console.log(companyProfile)}
                                >
                                    test
                                </button>
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
                                        Название компании
                                    </p>
                                    <Input
                                        errorText={errors.companyName}
                                        type="text"
                                        value={companyProfile.companyName}
                                        onChange={(e) =>
                                            dispatch(
                                                updateCompanyProfile({
                                                    ...companyProfile,
                                                    companyName: e,
                                                }),
                                            )
                                        }
                                    />
                                </div>
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
                                                Имя представителя
                                            </p>
                                            <Input
                                                errorText={errors.firstName}
                                                type="text"
                                                value={companyProfile.firstName}
                                                onChange={(e) =>
                                                    dispatch(
                                                        updateCompanyProfile({
                                                            ...companyProfile,
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
                                                Фамилия представителя
                                            </p>
                                            <Input
                                                errorText={errors.lastName}
                                                type="text"
                                                value={companyProfile.lastName}
                                                onChange={(e) =>
                                                    dispatch(
                                                        updateCompanyProfile({
                                                            ...companyProfile,
                                                            lastName: e,
                                                        }),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.hoursSettings,
                                            styles.generalSettingsBlock,
                                        )}
                                    >
                                        <p
                                            className={classNames(
                                                styles.title,
                                                "text fz24 fw500",
                                            )}
                                        >
                                            Часовой пояс
                                        </p>
                                        <CustomSearch
                                            isFirstOptionBlank
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        timezone: Number(e),
                                                    }),
                                                )
                                            }
                                            value={
                                                !companyProfile?.timezone
                                                    ? undefined
                                                    : companyProfile.timezone
                                            }
                                            errorText={errors.timezone}
                                            search
                                            options={[
                                                { name: "", value: 0 },
                                                ...timezones,
                                            ]}
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
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        city: cities.find(
                                                            (item) =>
                                                                item.id === e,
                                                        )!,
                                                    }),
                                                );
                                            }}
                                            search
                                            value={companyProfile.city?.id}
                                        />
                                    </div>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <p className="text fz24 fw500">
                                            Логотип компании
                                        </p>
                                        <Input
                                            accept="image/png, image/jpeg, image/jpg"
                                            type="file"
                                            setFile={setLogo}
                                            file={logo}
                                            errorText={errors.logo}
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
                                            Ссылка на сайт компании
                                        </p>
                                        <Input
                                            errorText={errors.linkToCompany}
                                            type="text"
                                            value={companyProfile.linkToCompany}
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        linkToCompany: e,
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
                                            Telegram (не обязательно)
                                        </p>
                                        <Input
                                            type="text"
                                            placeholder="@Nickname"
                                            value={
                                                "https://t.me/" +
                                                (companyProfile?.telegramLink
                                                    ? companyProfile?.telegramLink
                                                    : "")
                                            }
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        telegramLink: e.slice(
                                                            13,
                                                        ),
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
                                                (companyProfile?.vkLink
                                                    ? companyProfile?.vkLink
                                                    : "")
                                            }
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
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
                                            О компании
                                        </p>
                                        <Input
                                            errorText={errors.description}
                                            value={
                                                companyProfile?.description ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
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
                                            title="Навыки, которые вы используете в компании"
                                            selectValues={(e) => {
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        skills: e,
                                                    }),
                                                );
                                            }}
                                            values={companyProfile.skills}
                                            errorText={errors.skills}
                                        />
                                    </div>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <p className="text fz24 fw500">
                                            Копии документов, подтверждающие
                                            регистрацию, легитимность и
                                            надежность компании
                                        </p>
                                        <Input
                                            accept="application/pdf, application/msword, .docx, image/png, image/jpeg, image/jpg"
                                            type="file_multiple"
                                            maxFiles={5}
                                            multiple
                                            setFile={setVerFiles}
                                            file={verFiles}
                                            errorText={errors.verFiles}
                                        />
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
                                        onClick={() => validateFormCompany()}
                                        htmlType="submit"
                                        className={styles.saveButton}
                                        type="secondary"
                                    >
                                        Отправить на верификацию
                                    </Button>
                                </div>
                            </form>
                        ),
                    ref: createRef(),
                };
            case "profile":
                return {
                    content: (
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className={styles.content}
                        ></form>
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

    const currentProfile = useMemo(() => {
        if (user.role === "student") {
            return studentProfile;
        }
        return companyProfile;
    }, []);

    const getInitTab = (): SettingsState => {
        console.log(currentProfile);
        
        switch (currentProfile.verification) {
            case "verified":
                return "personal_data";
            case "on_verification":
                return "verification";
            case "not_verified":
                return "verification";
            case "rejected":
                return "verification";
        }
    };

    const [activeTab, setActiveTab] = useState<SettingsState>(getInitTab());

    const getTabsContent = (): ReactNode => {
        switch (currentProfile.verification) {
            case "not_verified":
                return (
                    <Button
                        className={styles.navigationButton}
                        type={
                            activeTab === "verification"
                                ? "secondary"
                                : "primary"
                        }
                        onClick={() => handleTabChange("verification")}
                    >
                        Верификация
                    </Button>
                );
            case "on_verification":
                return null;
            case "rejected":
                return null;
            case "verified":
                return (
                    <>
                        <Button
                            className={styles.navigationButton}
                            type={
                                activeTab === "profile"
                                    ? "secondary"
                                    : "primary"
                            }
                            onClick={() => handleTabChange("profile")}
                        >
                            Профиль
                        </Button>
                        <Button
                            className={styles.navigationButton}
                            type={
                                activeTab === "personal_data"
                                    ? "secondary"
                                    : "primary"
                            }
                            onClick={() => handleTabChange("personal_data")}
                        >
                            Персональные данные
                        </Button>
                    </>
                );
        }
    };

    if (!user.email) return null;

    console.log("activeTab", activeTab);
    

    return (
        <div className={styles.container}>
            <div className={styles.navigationButtons}>{getTabsContent()}</div>
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
