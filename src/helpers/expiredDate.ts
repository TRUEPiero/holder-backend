export function getExpiredDate() {
    return new Date(Date.now() + 10 * 60 * 1000);
}