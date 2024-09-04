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

export type FormsOfEducation =
    | ""
    | "part_time"
    | "full_time"
    | "part_full_time";

export type IVerification = {
    status: VerificationStatuses;
    comment?: string;
};

export type VerificationStatuses =
    | "verified"
    | "on_verification"
    | "not_verified"
    | "rejected";

export type IStudentProfile = {
    id: string;
    verification: IVerification;
    admissionYear: number | null;
    description: string;
    firstName: string;
    lastName: string;
    logoImg: string;
    phone: string;
    emailVisibility: boolean;
    phoneVisibility: boolean;
    timezone: number | null;
    university: IUniversity;
    specialty: ISpecialty;
    faculty: IFaculty;
    formOfEducation: FormsOfEducation;
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
    verification: IVerification;
    logoImg: IFile;
    description: string;
    vkLink?: string;
    telegramLink?: string;
    timezone: number;
    city: ICity;
    phone: string;
    emailVisibility: boolean;
    phoneVisibility: boolean;
    skills: ISkill[];
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
    company: ICompanyProfile;
    name: string;
    description: string;
    deadline: string;
    createdAt: string;
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

export type ISpecialty = {
    id: string;
    name: string;
    type: "bachelor" | "specialty" | "magister";
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
    university: string;
};

export type IPartner = {
    id: string;
    logo: string;
    name: string;
    description: string;
};

export type IProject = {
    id: string;
    img: string;
    name: string;
    avatar: string;
};
