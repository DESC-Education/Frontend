import axios from "axios";
import { $authHost } from "..";

export const readNotification = async (id: string) => {
    try {
        const { data } = await $authHost.get<{ status: number }>(
            `/api/v1/notifications/notification/read/${id}`,
        );

        return {
            status: 200,
            message: "Успешно",
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response!.status,
                message: error.response!.data.message,
            };
        } else {
            return {
                status: 500,
                message: "Ошибка сервера",
            };
        }
    }
};
