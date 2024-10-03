import { ICategory, IFile, ISkill } from "../_types";

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
    profission: string;
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
    telegramLink?: string;
    vkLink?: string;
    skills: string[];
    profession: string;
};

export type EditCompanyDTO = {
    description: string;
    phoneVisibility: boolean;
    emailVisibility: boolean;
    telegramLink?: string;
    vkLink?: string;
    linkToCompany: string;
    skills: string[];
};

export type CreateTaskDTO = {
    title: string;
    description: string;
    deadline: string;
    file: string;
    //files: File[];
    category: ICategory[];
    filters: string;
};

export type SSEResponse = {
    event: SSEEvents;
    data: SSENotificationPayload | SSENewMessagePayload;
};

export type SSEEvents = "notification" | "newMessage";

export type SSENotificationTypes =
    | "verification"
    | "evaluation" // payload: solutionId
    | "level"
    | "review" // payload: reviewId
    | "countReset"
    | "solution"; // payload: solutionId

export type SSENotificationPayload = {
    type: SSENotificationTypes;
    id: string;
    title: string;
    message: string;
    payload: string;
};

export type SSENewMessagePayload = {
    chatId: string;
    message: string;
    createdAt: string;
    unreadCount: number;
};
