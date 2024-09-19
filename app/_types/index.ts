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

export type IFormsOfEducation =
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
    formOfEducation: IFormsOfEducation;
    telegramLink?: string;
    vkLink?: string;
    city: ICity;
    skills: ISkill[];
    profession: string;
    leadTaskCategories: ILeadTaskCategory[];
    level: ILevel;
    replyCount: number;
    replyReloadDate: string;
};

export type ICompanyProfile = {
    linkToCompany: string;
    companyName: string;
    firstName: string;
    lastName: string;
    id: string;
    verification: IVerification;
    logoImg: string;
    description: string;
    vkLink?: string;
    telegramLink?: string;
    timezone: number;
    city: ICity;
    phone: string;
    emailVisibility: boolean;
    phoneVisibility: boolean;
    skills: ISkill[];
    leadTaskCategories: ILeadTaskCategory[];
};

export type ILevel = {
    value: number;
    name: string;
};

export type ILeadTaskCategory = {
    id: string;
    name: string;
    percent: number;
};

export type IChat = {
    id: string;
    companion: ChatCompanion;
    createdAt: string;
    taskId: string;
    isSupport: boolean;
    isSuspicious: boolean;
    messages: IMessage[];
};

export type ChatCompanion = {
    name: string;
    avatar: string;
};

export type IMessage = {
    id: string;
    chatId: string;
    text: string;
    ticketId?: string;
    userId: string;
    isRead: boolean;
    createdAt: string;
    isVisible: boolean;
    changedId?: string;
};

export type ITask = {
    id: string;
    profile: ICompanyProfile;
    title: string;
    description: string;
    deadline: string;
    createdAt: string;
    category: ICategory;
    filtersId: IFilter[];
    isVerified: boolean;
    isSuspicious: boolean;
    isVisible: boolean;
    files: IFile[];
    solutions: ISolution[];
};

export type ISolution = {
    id: string;
    user: string;
    description: string;
    file: string;
    userProfile: {
        firstName: string;
        lastName: string;
        logoImg: string;
    };
    companyComment: string;
    status: "completed" | "failed" | "pending";
    createdAt: string;
    files: IFile[];
};

export type IFile = {
    name: string;
    path: string;
    extension: string;
};

export type ICategory = {
    id: string;
    name: string;
    value: string;
    filterCategories: IFilterCategory[];
};

export type IFilterCategory = {
    id: string;
    name: string;
    filters: IFilter[];
};

export type IFilter = {
    id: string;
    name: string;
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

export type IReview = {
    profile: {
        companyName: string;
        logoImg: string;
    };
    title: string;
    rating: number;
    description: string;
};

export type IVerificationStudentRequest = {
    id: string,
    createdAt: string,
    status: "pending" | "approved" | "rejected",
    comment: string,
    admin: string,
    profile: IStudentProfile,
    verificationFiles: [
        string
    ]
}

export type IVerificationCompanyRequest = {
    id: string,
    createdAt: string,
    status: "pending" | "approved" | "rejected",
    comment: string,
    admin: string,
    profile: ICompanyProfile,
    verificationFiles: [
        string
    ]
}