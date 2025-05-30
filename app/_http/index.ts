import axios from "axios";
import LocalStorage from "../_utils/LocalStorage";

const $host = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_PATH,
    headers: {
        "Content-Type": "application/json",
    },
});

const $authHost = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_PATH,
    headers: {
        "Content-Type": "application/json",
    },
});

$authHost.interceptors.request.use(
    (config) => {
        const token = LocalStorage.getAccessToken();
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

$authHost.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (
            err?.response?.data?.code === "user_not_found" ||
            err.response.config.url.split("/").at(-1) === "events"
        ) {
            LocalStorage.logout();
            return;
        }

        if (originalConfig.url !== "/api/v1/users/login" && err.response) {
            if (err.response.status === 401) {
                try {
                    if (
                        !LocalStorage.getRefreshToken() ||
                        !LocalStorage.getAccessToken()
                    ) {
                        return;
                    }

                    const res = await $host.post<{ access: string }>(
                        "/api/v1/users/token_refresh",
                        {
                            refresh: LocalStorage.getRefreshToken(),
                        },
                    );

                    const token = res.data.access;

                    LocalStorage.setAccessToken(token);

                    return $authHost(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    },
);

export { $host, $authHost };
