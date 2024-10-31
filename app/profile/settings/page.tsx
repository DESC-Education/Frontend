"use client";

import {
    createRef,
    ReactNode,
    RefObject,
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
import {
    createProfileStudent,
    editCompanyProfile,
    editStudentProfile,
    getCities,
    getFaculties,
    getSkills,
    getSpecialities,
    getUniversities,
} from "@/app/_http/API/profileApi";
import CustomSearch from "@/app/_components/ui/CustomSearch/CustomSearch";
import Select from "react-select";
import { ICity, IFaculty, ISkill, ISpecialty, IUniversity } from "@/app/_types";
import SelectSkills from "@/app/_components/SelectSkills/SelectSkills";
import { AlertContext } from "@/app/_context/AlertContext";
import { formsOfEducation, timezones } from "@/app/_utils/constants";
import ProfileStatus from "../ProfileStatus/ProfileStatus";
import CustomOval from "@/app/_components/ui/CustomOval/CustomOval";
import { AuthRoute } from "@/app/_utils/protectedRoutes";
import ChangeCredsModal from "@/app/_components/modals/ChangeCredsModal/ChangeCredsModal";
import { ModalContext } from "@/app/_context/ModalContext";
import { getBeautifiedPhone } from "@/app/_utils/utils";
import { contentSlice } from "@/app/_store/reducers/contentSlice";

type SettingsState = "personal_data" | "profile" | "verification";

const URLRegExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const SettingsPage = () => {
    const { user } = useTypesSelector((state) => state.userReducer);
    const {
        studentProfile,
        companyProfile,
        profileVerification,
    } = useTypesSelector((state) => state.userReducer);

    const { showAlert } = useContext(AlertContext);
    const { showModal } = useContext(ModalContext);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const dispatch = useTypesDispatch();
    const {
        updateCompanyProfile,
        updateStudentProfile,
        updateProfileVerification,
    } = userSlice.actions;

    const { isProfileInfoChanged } = useTypesSelector(
        (state) => state.contentReducer,
    );
    const { updateIsProfileInfoChanged } = contentSlice.actions;

    // const [cities, setCities] = useState<ICity[]>([]);

    const [isCitiesLoading, setIsCitiesLoading] = useState<boolean>(false);

    const setCitiesBySearch = async (q: string) => {
        setIsCitiesLoading(true);

        const res = await getCities(q);

        setIsCitiesLoading(false);

        if (res.status === 200) {
            // setCities(
            return res.cities!.map((item) => ({
                ...item,
                value: item.id,
                label: `${item.name} (${item.region})`,
            }));
            // );
        } else {
            return [];
        }
    };

    const [isUniversitiesLoading, setIsUniversitiesLoading] = useState(false);
    const setUniversitiesBySearch = async (q: string) => {
        setIsUniversitiesLoading(true);

        const res = await getUniversities(q);

        setIsUniversitiesLoading(false);

        if (res.status === 200) {
            return res.universities!.map((item) => ({
                ...item,
                value: item.id,
                label: `${item.name} (${item.city.name})`,
            }));
        } else {
            return [];
        }
    };

    const [isFacultiesLoading, setIsFacultiesLoading] = useState(false);
    const setFacultiesBySearch = async (q: string) => {
        setIsFacultiesLoading(true);

        const res = await getFaculties(q, studentProfile.university?.id);

        setIsFacultiesLoading(false);

        if (res.status === 200) {
            return res.faculties!.map((item) => ({
                ...item,
                value: item.id,
                label: item.name,
            }));
        } else {
            return [];
        }
    };

    const [isSpecialitiesLoading, setIsSpecialitiesLoading] = useState(false);
    const setSpecialitiesBySearch = async (q: string) => {
        setIsSpecialitiesLoading(true);

        const res = await getSpecialities(q);

        setIsSpecialitiesLoading(false);

        if (res.status === 200) {
            return res.specialities!.map((item) => ({
                ...item,
                value: item.id,
                label: item.name,
            }));
        } else {
            return [];
        }
    };

    const [skills, setSkills] = useState<ISkill[]>([]);

    const setSkillsBySearch = async (search: string) => {
        const res = await getSkills(search);

        if (res.status === 200) {
            setSkills(
                res.skills!.map((item) => ({
                    ...item,
                    value: item.id,
                })),
            );
        }
    };

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

    const [studentCard, setStudentCard] = useState<File[] | null>([]);
    const [verFiles, setVerFiles] = useState<File[] | null>([]);

    useEffect(() => {
        setErrors({});
        setErrorsExist(false);
    }, [studentProfile, studentCard, companyProfile, verFiles]);

    const [activeTab, setActiveTab] = useState<SettingsState>("verification");

    useEffect(() => {
        if (isProfileInfoChanged?.current && activeTab === "personal_data") {
            showAlert("Изменения не сохранены!", "warning");
        }
    }, [activeTab]);

    const [errors, setErrors] = useState<any>({});
    const [errorsExist, setErrorsExist] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateFormStudent = async () => {
        setIsLoading(true);
        const errorsTemp: any = {};

        if (
            !studentProfile.profession ||
            studentProfile.profession?.length < 2
        ) {
            errorsTemp.profession = "Введите сферу деятельности";
        }

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

        if (!studentProfile.city || !Object.keys(studentProfile.city).length) {
            errorsTemp.city = "Выберите город";
        }

        if (!studentCard) {
            errorsTemp.studentCard = "Прикрепите студенческий билет";
        }

        if (studentCard?.length !== 2) {
            errorsTemp.studentCard = "Прикрепите две фотографии";
        }

        if (
            !studentProfile.university ||
            !Object.keys(studentProfile.university).length
        ) {
            errorsTemp.university = "Выберите университет";
        }

        if (
            !studentProfile.specialty ||
            !Object.keys(studentProfile.specialty).length
        ) {
            errorsTemp.specialty = "Выберите специальность";
        }

        if (
            !studentProfile.faculty ||
            !Object.keys(studentProfile.faculty).length
        ) {
            errorsTemp.faculty = "Выберите факультет";
        }

        if (studentProfile.skills?.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const formdata = new FormData();

            studentCard!.forEach((el, i) => {
                formdata.append(`files`, el, el.name);
            });
            // formdata.append("files", studentCard!, studentCard!.name);
            formdata.append("firstName", studentProfile.firstName);
            formdata.append("lastName", studentProfile.lastName);
            formdata.append("city", studentProfile.city!.id);
            formdata.append("university", studentProfile.university!.id);
            formdata.append("timezone", String(studentProfile.timezone));
            formdata.append("description", studentProfile.description);
            formdata.append("faculty", studentProfile.faculty!.id);
            formdata.append("specialty", studentProfile.specialty!.id);
            formdata.append("formOfEducation", studentProfile.formOfEducation);
            formdata.append(
                "admissionYear",
                String(studentProfile.admissionYear),
            );
            formdata.append("profession", studentProfile.profession);
            formdata.append("phoneVisibility", "true");
            formdata.append("emailVisibility", "true");
            formdata.append(
                "vkLink",
                studentProfile.vkLink
                    ? `https://vk.com/${studentProfile.vkLink}`
                    : "",
            );
            formdata.append(
                "telegramLink",
                studentProfile.telegramLink
                    ? `https://t.me/${studentProfile.telegramLink}`
                    : "",
            );

            studentProfile.skills.forEach((el, i) => {
                formdata.append(`skills`, el.id);
            });

            const res = await createProfileStudent(formdata);

            if (res.status === 200) {
                dispatch(
                    updateProfileVerification({ status: "on_verification" }),
                );
                showAlert(
                    "Заявка на верификацию успешно отправлена",
                    "success",
                );
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const validateFormCompany = async () => {
        setIsLoading(true);
        const errorsTemp: any = {};

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

        if (!companyProfile.city || !Object.keys(companyProfile.city).length) {
            errorsTemp.city = "Выберите город";
        }

        if (!companyProfile.skills || companyProfile.skills.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        if (
            !companyProfile.linkToCompany ||
            !URLRegExp.test(companyProfile.linkToCompany)
        ) {
            errorsTemp.linkToCompany =
                "Введите корректную ссылку на сайт компании";
        }

        if (!companyProfile.description) {
            errorsTemp.description = "Введите описание компании";
        }

        if (verFiles?.length === 0) {
            errorsTemp.verFiles = "Прикрепите файлы";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const formdata = new FormData();

            verFiles!.forEach((el, i) => {
                formdata.append(`files`, el, el.name);
            });
            formdata.append("companyName", companyProfile.companyName);
            formdata.append("firstName", companyProfile.firstName);
            formdata.append("lastName", companyProfile.lastName);
            formdata.append("linkToCompany", companyProfile.linkToCompany);
            formdata.append("city", companyProfile.city!.id);
            formdata.append("timezone", String(companyProfile.timezone));
            formdata.append("phoneVisibility", "true");
            formdata.append("emailVisibility", "true");
            formdata.append(
                "vkLink",
                companyProfile.vkLink
                    ? `https://vk.com/${companyProfile.vkLink}`
                    : "",
            );
            formdata.append(
                "telegramLink",
                companyProfile.telegramLink
                    ? `https://t.me/${companyProfile.telegramLink}`
                    : "",
            );
            formdata.append("description", companyProfile.description ?? "");

            companyProfile.skills.forEach((el, i) => {
                formdata.append(`skills`, el.id);
            });

            const res = await createProfileStudent(formdata);

            if (res.status === 200) {
                dispatch(
                    updateProfileVerification({ status: "on_verification" }),
                );
                showAlert(
                    "Заявка на верификацию успешно отправлена",
                    "success",
                );
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const validateEditProfileStudent = async () => {
        setIsLoading(true);
        const errorsTemp: any = {};

        if (
            studentProfile.description &&
            studentProfile.description?.length < 2
        ) {
            errorsTemp.description = "Введите описание";
        }

        if (!studentProfile.profession) {
            errorsTemp.profession = "Введите корректную сферу деятельности";
        }

        if (studentProfile.skills?.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const res = await editStudentProfile({
                description: studentProfile.description ?? "",
                telegramLink: studentProfile.telegramLink
                    ? `https://t.me/${studentProfile.telegramLink}`
                    : undefined,
                vkLink: studentProfile.vkLink
                    ? `https://vk.com/${studentProfile.vkLink}`
                    : undefined,
                emailVisibility: studentProfile.emailVisibility,
                phoneVisibility: studentProfile.phoneVisibility,
                skills: studentProfile.skills.map((i) => i.id),
                profession: studentProfile.profession,
            });

            if (res.status === 200) {
                dispatch(updateIsProfileInfoChanged(false));
                // isChanged.current = false;
                showAlert("Профиль успешно обновлен", "success");
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const validateEditProfileCompany = async () => {
        setIsLoading(true);
        const errorsTemp: any = {};

        if (
            companyProfile.description !== null &&
            companyProfile.description?.length < 2
        ) {
            errorsTemp.description = "Введите описание";
        }

        if (
            !companyProfile.linkToCompany ||
            !URLRegExp.test(companyProfile.linkToCompany)
        ) {
            errorsTemp.linkToCompany =
                "Введите корректную ссылку на сайт компании";
        }

        if (companyProfile.skills?.length === 0) {
            errorsTemp.skills = "Выберите навыки";
        }

        setErrorsExist(Object.keys(errorsTemp).length !== 0);
        setErrors(errorsTemp);

        if (Object.keys(errorsTemp).length === 0) {
            const res = await editCompanyProfile({
                description: companyProfile.description ?? "",
                linkToCompany: companyProfile.linkToCompany,
                telegramLink: companyProfile.telegramLink
                    ? `https://t.me/${companyProfile.telegramLink}`
                    : undefined,
                vkLink: companyProfile.vkLink
                    ? `https://vk.com/${companyProfile.vkLink}`
                    : undefined,
                emailVisibility: companyProfile.emailVisibility,
                phoneVisibility: companyProfile.phoneVisibility,
                skills: companyProfile.skills.map((i) => i.id),
            });

            if (res.status === 200) {
                // isChanged.current = false;
                dispatch(updateIsProfileInfoChanged(false));
                showAlert("Профиль успешно обновлен", "success");
            }

            setIsLoading(false);
        } else {
            setIsLoading(false);
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
                                            ? getBeautifiedPhone(
                                                  studentProfile.phone,
                                              )
                                            : "Телефон не указан!"}
                                    </p>
                                    <p
                                        className={classNames(
                                            "text fz24 blue pointer",
                                            styles.linkText,
                                        )}
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <ChangeCredsModal initActiveTab="phone" />
                                                ),
                                            })
                                        }
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
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <ChangeCredsModal initActiveTab="mail" />
                                                ),
                                            })
                                        }
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
                                        onClick={() =>
                                            showModal({
                                                content: (
                                                    <ChangeCredsModal initActiveTab="password" />
                                                ),
                                            })
                                        }
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
                                                Имя{" "}
                                                <span
                                                    className={styles.required}
                                                >
                                                    *
                                                </span>
                                            </p>
                                            <Input
                                                required
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
                                                Фамилия{" "}
                                                <span
                                                    className={styles.required}
                                                >
                                                    *
                                                </span>
                                            </p>
                                            <Input
                                                required
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
                                            Часовой пояс{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            onChange={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        timezone: Number(
                                                            e.value,
                                                        ),
                                                    }),
                                                )
                                            }
                                            value={
                                                !studentProfile?.timezone
                                                    ? undefined
                                                    : timezones.find(
                                                          (i) =>
                                                              i.value ===
                                                              studentProfile.timezone,
                                                      )!
                                            }
                                            errorText={errors.timezone}
                                            search
                                            options={timezones}
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
                                            Город{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            noOptionsMessage="Начните вводить название города..."
                                            asyncSelect
                                            errorText={errors.city}
                                            loadOptions={setCitiesBySearch}
                                            isLoading={isCitiesLoading}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        city: e,
                                                    }),
                                                );
                                            }}
                                            search
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
                                            ВУЗ{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            noOptionsMessage="Начните вводить название университета..."
                                            asyncSelect
                                            errorText={errors.university}
                                            loadOptions={
                                                setUniversitiesBySearch
                                            }
                                            isLoading={isUniversitiesLoading}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        university: e,
                                                    }),
                                                );
                                            }}
                                            search
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
                                            Факультет (институт){" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            cacheOptions={
                                                studentProfile.university?.id
                                            }
                                            disabled={
                                                !studentProfile.university?.id
                                            }
                                            noOptionsMessage="Начните вводить название факультета..."
                                            asyncSelect
                                            errorText={errors.faculty}
                                            loadOptions={setFacultiesBySearch}
                                            isLoading={isFacultiesLoading}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        faculty: e,
                                                    }),
                                                );
                                            }}
                                            search
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
                                            Специальность{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            cacheOptions={
                                                studentProfile.faculty?.id
                                            }
                                            disabled={
                                                !studentProfile.faculty?.id
                                            }
                                            noOptionsMessage="Начните вводить название факультета..."
                                            asyncSelect
                                            errorText={errors.specialty}
                                            loadOptions={
                                                setSpecialitiesBySearch
                                            }
                                            isLoading={isSpecialitiesLoading}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        specialty: e,
                                                    }),
                                                );
                                            }}
                                            search
                                        />
                                    </div>

                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <p className="text fz24 fw500">
                                            Студенческий билет{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <Input
                                            required
                                            multiple
                                            maxFiles={2}
                                            type="file_multiple"
                                            setFile={setStudentCard}
                                            file={studentCard}
                                            accept="image/*"
                                            acceptExtensions={[
                                                "png",
                                                "jpg",
                                                "jpeg",
                                            ]}
                                            errorText={errors.studentCard}
                                            fileTipContent={
                                                <div>
                                                    <p className="text fz16 gray">
                                                        Форматы: PNG, JPG, JPEG
                                                    </p>
                                                    <p className="text fz16 gray">
                                                        Максимальный вес: 5МБ
                                                    </p>
                                                    <p className="text fz16 gray">
                                                        Данные студенческого
                                                        билета и ваше лицо
                                                        должно быть четко
                                                        различимы
                                                    </p>
                                                </div>
                                            }
                                        />
                                        <p
                                            className={classNames(
                                                styles.title,
                                                "text fz20",
                                            )}
                                        >
                                            Прикрепите 2 фотографии: четкого
                                            изображения студенческого билета и
                                            вашу фотографию с ним
                                        </p>
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
                                                Форма обучения{" "}
                                                <span
                                                    className={styles.required}
                                                >
                                                    *
                                                </span>
                                            </p>
                                            <CustomSearch
                                                errorText={
                                                    errors.formOfEducation
                                                }
                                                options={formsOfEducation}
                                                onChange={(e) => {
                                                    dispatch(
                                                        updateStudentProfile({
                                                            ...studentProfile,
                                                            formOfEducation:
                                                                e.value,
                                                        }),
                                                    );
                                                }}
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
                                                Год поступления{" "}
                                                <span
                                                    className={styles.required}
                                                >
                                                    *
                                                </span>
                                            </p>
                                            <CustomSearch
                                                onChange={(e) =>
                                                    dispatch(
                                                        updateStudentProfile({
                                                            ...studentProfile,
                                                            admissionYear: Number(
                                                                e.value,
                                                            ),
                                                        }),
                                                    )
                                                }
                                                errorText={errors.admissionYear}
                                                search
                                                options={Array(
                                                    new Date().getFullYear() -
                                                        1984 +
                                                        1,
                                                )
                                                    .fill(0)
                                                    .map((_, i) => ({
                                                        label: String(i + 1984),
                                                        value: i + 1984,
                                                    }))}
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
                                            Сфера деятельности{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <p
                                            className={classNames(
                                                styles.title,
                                                "text fz20",
                                            )}
                                        >
                                            Введите сферу деятельности, которая
                                            Вам максимально близка. Примеры:
                                            "Веб-разработчик", "Системный
                                            администратор", "Дизайнер", "AI
                                            инженер", "React Middle разработчик"
                                            и пр. Сфера деятельности будет
                                            отображаться в шапке вашего профиля!
                                        </p>
                                        <Input
                                            required
                                            placeholder="Flask разработчик"
                                            errorText={errors.profession}
                                            type="text"
                                            value={studentProfile.profession}
                                            onChange={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        profession: e,
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
                                            required
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
                                            onInput={(search) =>
                                                setSkillsBySearch(search)
                                            }
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
                                        Название компании{" "}
                                        <span className={styles.required}>
                                            *
                                        </span>
                                    </p>
                                    <Input
                                        required
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
                                                Имя представителя{" "}
                                                <span
                                                    className={styles.required}
                                                >
                                                    *
                                                </span>
                                            </p>
                                            <Input
                                                required
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
                                                Фамилия представителя{" "}
                                                <span
                                                    className={styles.required}
                                                >
                                                    *
                                                </span>
                                            </p>
                                            <Input
                                                required
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
                                            Часовой пояс{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        timezone: Number(
                                                            e.value,
                                                        ),
                                                    }),
                                                )
                                            }
                                            value={
                                                !companyProfile?.timezone
                                                    ? undefined
                                                    : timezones.find(
                                                          (i) =>
                                                              i.value ===
                                                              studentProfile.timezone,
                                                      )!
                                            }
                                            errorText={errors.timezone}
                                            search
                                            options={timezones}
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
                                            Город{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <CustomSearch
                                            noOptionsMessage="Начните вводить название города..."
                                            asyncSelect
                                            errorText={errors.city}
                                            loadOptions={setCitiesBySearch}
                                            isLoading={isCitiesLoading}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        city: e,
                                                    }),
                                                );
                                            }}
                                            search
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
                                            Ссылка на сайт компании{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
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
                                            О компании{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
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
                                            required
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
                                            надежность компании{" "}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </p>
                                        <Input
                                            accept="application/pdf, application/msword, .docx, image/png, image/jpeg, image/jpg"
                                            type="file_multiple"
                                            maxFiles={5}
                                            multiple
                                            setFile={setVerFiles}
                                            file={verFiles}
                                            errorText={errors.verFiles}
                                            fileTipContent={
                                                <div>
                                                    <p className="text fz16 gray">
                                                        Форматы: PDF, DOCX, PNG,
                                                        JPG, JPEG
                                                    </p>
                                                    <p className="text fz16 gray">
                                                        Максимальный вес: 5МБ
                                                    </p>
                                                    <p className="text fz16 gray">
                                                        Максимальное количество
                                                        файлов: {5}
                                                    </p>
                                                </div>
                                            }
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
                    content:
                        user.role === "student" ? (
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className={styles.content}
                            >
                                <div className={styles.settingsBlock}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <Input
                                            type="textarea"
                                            title="О себе"
                                            rows={10}
                                            value={
                                                studentProfile.description ?? ""
                                            }
                                            onChange={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        description: e,
                                                    }),
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={styles.settingsBlock}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <Input
                                            checked={
                                                studentProfile.emailVisibility
                                            }
                                            onCheck={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        emailVisibility: e,
                                                    }),
                                                )
                                            }
                                            type="checkbox"
                                            labelContent="Показывать почту в профиле?"
                                        />
                                    </div>
                                </div>
                                <div className={styles.settingsBlock}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <Input
                                            checked={
                                                studentProfile.phoneVisibility
                                            }
                                            onCheck={(e) =>
                                                dispatch(
                                                    updateStudentProfile({
                                                        ...studentProfile,
                                                        phoneVisibility: e,
                                                    }),
                                                )
                                            }
                                            type="checkbox"
                                            labelContent="Показывать телефон в профиле?"
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
                                        Сфера деятельности
                                    </p>
                                    <Input
                                        type="text"
                                        value={studentProfile.profession}
                                        onChange={(e) =>
                                            dispatch(
                                                updateStudentProfile({
                                                    ...studentProfile,
                                                    profession: e,
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
                                        Telegram
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
                                        Вконтакте
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
                                <div className={styles.settingsBlock}>
                                    <SelectSkills
                                        title="Выберите навыки, которыми Вы владеете"
                                        maxItems={15}
                                        options={skills}
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
                                        onInput={(search) =>
                                            setSkillsBySearch(search)
                                        }
                                    />
                                    <p
                                        className={classNames(
                                            styles.errorText,
                                            "text fz24 fw500 red",
                                        )}
                                    >
                                        {errorsExist &&
                                            "Проверьте введенные данные"}
                                    </p>
                                </div>
                                <Button
                                    disabled={!isProfileInfoChanged?.current}
                                    onClick={() => validateEditProfileStudent()}
                                    htmlType="submit"
                                    className={styles.saveButton}
                                    type="secondary"
                                >
                                    Сохранить изменения
                                </Button>
                            </form>
                        ) : (
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className={styles.content}
                            >
                                <div className={styles.settingsBlock}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <Input
                                            type="textarea"
                                            title="О себе"
                                            rows={10}
                                            value={
                                                companyProfile.description ?? ""
                                            }
                                            onChange={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        description: e,
                                                    }),
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={styles.settingsBlock}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <Input
                                            checked={
                                                companyProfile.emailVisibility
                                            }
                                            onCheck={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        emailVisibility: e,
                                                    }),
                                                )
                                            }
                                            type="checkbox"
                                            labelContent="Показывать почту в профиле?"
                                        />
                                    </div>
                                </div>
                                <div className={styles.settingsBlock}>
                                    <div
                                        className={styles.generalSettingsBlock}
                                    >
                                        <Input
                                            checked={
                                                companyProfile.phoneVisibility
                                            }
                                            onCheck={(e) =>
                                                dispatch(
                                                    updateCompanyProfile({
                                                        ...companyProfile,
                                                        phoneVisibility: e,
                                                    }),
                                                )
                                            }
                                            type="checkbox"
                                            labelContent="Показывать телефон в профиле?"
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
                                        Ссылка на сайт компании
                                    </p>
                                    <Input
                                        type="text"
                                        placeholder="@Nickname"
                                        value={
                                            companyProfile?.linkToCompany || ""
                                        }
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
                                        Telegram
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
                                        Вконтакте
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
                                <div className={styles.settingsBlock}>
                                    <SelectSkills
                                        title="Выберите навыки, которые Вы используете в компании"
                                        maxItems={15}
                                        options={skills}
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
                                        onInput={(search) =>
                                            setSkillsBySearch(search)
                                        }
                                    />
                                    <p
                                        className={classNames(
                                            styles.errorText,
                                            "text fz24 fw500 red",
                                        )}
                                    >
                                        {errorsExist &&
                                            "Проверьте введенные данные"}
                                    </p>
                                </div>
                                <Button
                                    disabled={!isProfileInfoChanged?.current}
                                    onClick={() => validateEditProfileCompany()}
                                    htmlType="submit"
                                    className={styles.saveButton}
                                    type="secondary"
                                >
                                    Сохранить изменения
                                </Button>
                            </form>
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

    useEffect(() => {
        setActiveTab(() => {
            if (profileVerification.status === "verified") {
                return "profile";
            } else {
                return "verification";
            }
        });
    }, [profileVerification.status]);

    const getTabsContent = (): ReactNode => {
        switch (profileVerification.status) {
            case "not_verified":
                return (
                    <Button
                        className={classNames(styles.navigationButton)}
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

    if (profileVerification.status === "on_verification") {
        return <ProfileStatus profileVerification={profileVerification} />;
    }

    return (
        <AuthRoute>
            <div className={styles.container}>
                <div
                    className={classNames(styles.navigationButtons, {
                        [styles.notVerified]:
                            profileVerification.status === "not_verified",
                    })}
                >
                    {getTabsContent()}
                </div>
                <div
                    className={classNames(styles.content, {
                        [styles.exit]: isAnimating,
                        [styles.isLoading]: isLoading,
                    })}
                >
                    <div className={styles.loader}>
                        <CustomOval />
                    </div>
                    {getSettingsContent(activeTab).content}
                </div>
            </div>
        </AuthRoute>
    );
};

export default SettingsPage;
