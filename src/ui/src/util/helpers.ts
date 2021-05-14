const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~.';

export function randomString(len: number) {
    const allCharLen = allChars.length;
    let str = '';

    for (let _ = 0; _ < len; _++) {
        const idx = Math.floor(Math.random() * allCharLen);
        str += allChars[idx];
    }

    return str;
}

export function base64URLEncode(str: string): string {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}