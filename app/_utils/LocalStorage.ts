export default class LocalStorage {
    static isAuth(): boolean {
        return Boolean(localStorage.getItem("accessToken"));
    }

    static getAccessToken(): string {
        return localStorage.getItem("accessToken") || "";
    }

    static getRefreshToken(): string {
        return localStorage.getItem("refreshToken") || "";
    }

    static setAccessToken(access: string) {
        localStorage.setItem("accessToken", access);
    }

    static setTokens(access: string, refresh: string): void {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
    }

    static setShipmentsPerPage(val: number) {
        localStorage.setItem("shipmentsPerPage", String(val));
    }

    static getShipmentsPerPage(): string | null {
        return localStorage.getItem("shipmentsPerPage");
    }

    static logout(): void {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}
