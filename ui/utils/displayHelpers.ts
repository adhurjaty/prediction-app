export function displayMoney(amount?: number | string): string {
    if (!amount) return "";
    if (typeof amount === "string")
        amount = parseFloat(amount);
    return amount.toFixed(2);
}
