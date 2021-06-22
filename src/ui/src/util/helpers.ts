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

export function redirectToLoginOnError<T>(fn: () => Promise<T>): () => Promise<T | null> {
    return async function() {
        try {
            return await fn();
        } catch (e) {
            if(e instanceof Error && e.message.includes('Unauthorized')) {
                window.location.href = `/login?origin=${window.location.pathname}`;
                return null;
            }
            throw e;
        }
    }
}