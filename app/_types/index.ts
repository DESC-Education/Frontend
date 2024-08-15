export type IUser =
    | {
          id: string;
          mail: string;
          isVerified: boolean;
          role: string;
          isOnline: boolean;
          isBanned: boolean;
          type: "student";
          data: IStudent;
      }
    | {
          id: string;
          mail: string;
          isVerified: boolean;
          role: string;
          isOnline: boolean;
          isBanned: boolean;
          type: "company";
          data: ICompany;
      };

export type IStudent =
    | {
          id: string;
          isVerified: true;
          name: string;
          surname: string;
          logoImg: IFile;
          description: string;
          phone: string;
          specialityId: string;
          instituteId: string;
          formOfEducationId: string;
          timezone: string;
          grade: string;
          yearOfGraduation: number;
          telegramLink: string;
      }
    | {
          id: string;
          isVerified: false;
      };

export type ICompany =
    | {
          id: string;
          isVerified: true;
          name: string;
          ownerName: string;
          logoImg: IFile;
          description: string;
          phone: string;
          linkToSite: string;
          vkLink?: string;
          telegramLink?: string;
          timezone: string;
          cityId: string;
      }
    | {
          id: string;
          isVerified: false;
      };

export type IChat = {
    id: string;
    companion: IUser;
    createdAt: string;
    taskId: string;
    isSupport: boolean;
    isSuspicious: boolean;
    messages: IMessage[];
}

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
}

export type IFile = {
    id: string;
    name: string;
    path: string;
    type: string;
};