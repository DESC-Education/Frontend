export type IUser = {

}

export type IMessage = { 
    id: string; 
    chat_id: string; 
    text: string; 
    ticket_id?: string; 
    user_id: string; 
    createdAt: string; 
    is_visible: boolean; 
    changed_id?: string; 
};