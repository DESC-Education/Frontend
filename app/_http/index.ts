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

let times: number = 0;

$authHost.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/api/v1/users/login" && err.response) {
            if (err.response.status === 401) {
                try {
                    times++;

                    if (
                        !LocalStorage.getRefreshToken() ||
                        !LocalStorage.getAccessToken() ||
                        times >= 3
                    ) {
                        // || times >= 3
                        return;
                    }

                    const res = await $host.post<{ access: string }>(
                        "/api/v1/users/token_refresh",
                        {
                            refresh: LocalStorage.getRefreshToken(),
                        },
                    );

                    const token = res.data.access;
                    console.log(
                        "in http index.ts __ local_refresh_token __",
                        LocalStorage.getRefreshToken(),
                        " __ local_access_token __ ",
                        LocalStorage.getAccessToken(),
                        " __ res given as a response from /refresh __",
                        res,
                        " __ originalConfig __",
                        originalConfig,
                        " __ err.response __",
                        err.response,
                    );

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
