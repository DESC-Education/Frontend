// phone convert from +79999999999 to +7 (999) 999-99-99
export const getBeautifiedPhone = (phone: string): string => {
    return phone.replace(/\D/g, "").replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
};