const TOKEN_KEY = 'patyodklima_auth_token';
const REMEMBER_KEY = 'patyodklima_remember_me';


export function getToken() {
    const rememberedToken = localStorage.getItem(TOKEN_KEY);
    if (rememberedToken) {
        return rememberedToken;
    }

    return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, rememberMe = false) {
    clearToken();

    if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REMEMBER_KEY, 'true');
        return;
    }

    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(REMEMBER_KEY);
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
}

export function isRememberMeEnabled() {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
}