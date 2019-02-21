export function parse(str: string): Array<string> {
    return str.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, "%SPLIT%").split("%SPLIT%");
}