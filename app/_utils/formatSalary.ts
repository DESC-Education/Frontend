export const formatSalary = (min: number, max: number, currency: string): string => {
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('ru-RU').format(num);
    };

    const getCurrencySymbol = (curr: string): string => {
        switch (curr.toLowerCase()) {
            case 'rub':
            case 'rur':
                return '₽';
            case 'usd':
                return '$';
            case 'eur':
                return '€';
            default:
                return curr.toUpperCase();
        }
    };

    const currencySymbol = getCurrencySymbol(currency);
    
    if (min === max) {
        return `${formatNumber(min)} ${currencySymbol}`;
    }
    
    return `${formatNumber(min)} - ${formatNumber(max)} ${currencySymbol}`;
}; 