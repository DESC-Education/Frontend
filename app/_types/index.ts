export type IUser = {
    id: string;
    email: string;
    isVerified: boolean;
    isOnline: boolean;
    isBanned: boolean;
    role: IRole;
};

export type IRole =
    | "student"
    | "company"
    | "institute_moderator"
    | "moderator"
    | "admin";

export type RoleStudent = { role: "student" };
export type RoleCompany = { role: "company" };

export type IProfile<T> = T extends RoleStudent
    ? IStudentProfile
    : ICompanyProfile;

export type IStudentProfile = {
    id: string;
    isVerified: boolean;
    admissionYear: number;
    description: string;
    firstName: string;
    lastName: string;
    logoImg: string;
    phone: string;
    emailVisibility: boolean;
    phoneVisibility: boolean;
    timezone: number;
    university: IUniversity;
    speciality: ISpeciality;
    faculty: IFaculty;
    formOfEducation: "part_time" | "full_time" | "part_full_time";
    telegramLink?: string;
    vkLink?: string;
    city: ICity;
    skills: ISkill[];
};

export type ICompanyProfile = {
    linkToCompany: string;
    companyName: string;
    firstName: string;
    lastName: string;
    id: string;
    isVerified: boolean;
    logoImg: IFile;
    description: string;
    vkLink?: string;
    telegramLink?: string;
    timezone: number;
    city: ICity;
    phone: string;
    emailVisibility: boolean;
    phoneVisibility: boolean;
};

export type IChat = {
    id: string;
    companion: IUser;
    createdAt: string;
    taskId: string;
    isSupport: boolean;
    isSuspicious: boolean;
    messages: IMessage[];
};

export type IMessage = {
    id: string;
    chatId: string;
    text: string;
    ticketId?: string;
    userId: string;
    isRead: boolean;
    createdat: string;
    isVisible: boolean;
    changedId?: string;
};

export type ITask = {
    id: string;
    companyId: string;
    name: string;
    description: string;
    deadline: string;
    createdat: string;
    catogoryId: string;
    isVerified: boolean;
    isSuspicious: boolean;
    isVisible: boolean;
    files: IFile[];
};

export type IFile = {
    id: string;
    name: string;
    path: string;
    type: string;
};

export type ISpeciality = {
    id: string;
    name: string;
    type: "bachelor" | "speciality" | "magister";
    code: string;
};

export type ISkill = {
    id: string;
    name: string;
    percent: number;
};

export type ICity = {
    id: string;
    name: string;
    region: string;
};

export type IUniversity = {
    id: string;
    name: string;
    city: ICity;
};

export type IFaculty = {
    id: string;
    name: string;
    university: string
};
