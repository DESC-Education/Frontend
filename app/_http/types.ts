import { IFile, ISkill } from "../_types";

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export type CreateStudentProfileDTO = {
    firstName: string;
    lastName: string;
    description: string;
    phone: string; // "+7XXXXXXXXXX"
    phoneVisibility: boolean;
    emailVisibility: boolean;
    telegramLink: "https://t.me/example";
    vkLink: "https://vk.com/example";
    timezone: number; // from -12 to 12
    formOfEducation: "full_time" | "part_time" | "full_part_time";
    speciality: string;
    admissionYear: string;
    university: string; // "uuid"
    studentCard: IFile;
};

export type CreateCompanyProfileDTO = {
    name: string;
    contact_name: string;
    timezone: number; // from -12 to 12,
    show_phone: true;
    show_mail: true;
    city: string;
    about: string;
    site_link: string;
    telegram_link: string;
    vk_link: string;
    skills: string[];
    registration_files: File[];
    other_files: File[];
};

export type EditStudentDTO = {
    description: string;
    phoneVisibility: boolean;
    emailVisibility: boolean;
    telegramLink: string;
    vkLink: string;
    skills: ISkill[];
};

export type EditCompanyDTO = {
    description: string;
    phoneVisibility: boolean;
    emailVisibility: boolean;
    telegramLink: string;
    vkLink: string;
    linkToCompany: string;
    skills: ISkill[];
};
