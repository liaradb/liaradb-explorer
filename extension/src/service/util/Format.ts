export function parseNumberInt(value: string, defaultValue = 0) {
    const result = parseInt(value);
    if (isNaN(result)) {
        return defaultValue;
    }
    return result;
}
