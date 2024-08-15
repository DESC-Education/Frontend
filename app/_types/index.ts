export type IUser =
    | {
          id: string;
          mail: string;
          is_verified: boolean;
          role: string;
          is_online: boolean;
          is_banned: boolean;
          type: "student";
          data: IStudent;
      }
    | {
          id: string;
          mail: string;
          is_verified: boolean;
          role: string;
          is_online: boolean;
          is_banned: boolean;
          type: "company";
          data: ICompany;
      };

export type IStudent =
    | {
          id: string;
          is_verified: true;
          name: string;
          surname: string;
          logo_img: IFile;
          description: string;
          phone: string;
          speciality_id: string;
          institute_id: string;
          form_of_education_id: string;
          timezone: string;
          grade: string;
          year_of_graduation: number;
          telegram_link: string;
      }
    | {
          id: string;
          is_verified: false;
      };

export type ICompany =
    | {
          id: string;
          is_verified: true;
          name: string;
          owner_name: string;
          logo_img: IFile;
          description: string;
          phone: string;
          link_to_site: string;
          vk_link?: string;
          telegram_link?: string;
          timezone: string;
          city_id: string;
      }
    | {
          id: string;
          is_verified: false;
      };

export type IChat = {
    id: string;
    companion: IUser;
    created_at: string;
    task_id: string;
    is_support: boolean;
    is_suspicious: boolean;
    messages: IMessage[];
}

export type IMessage = {
    id: string;
    chat_id: string;
    text: string;
    ticket_id?: string;
    user_id: string;
    is_read: boolean;
    createdAt: string;
    is_visible: boolean;
    changed_id?: string;
};

export type ITask = {
    id: string;
    company_id: string;
    name: string;
    description: string;
    deadline: string;
    createdAt: string;
    catogory_id: string;
    is_verified: boolean;
    is_suspicious: boolean;
    is_visible: boolean;
    files: IFile[];
}

export type IFile = {
    id: string;
    name: string;
    path: string;
    type: string;
};