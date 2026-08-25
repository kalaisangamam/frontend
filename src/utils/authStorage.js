const TOKEN_KEY = 'ks_token';
const USER_KEY = 'ks_user';

const storageTargets = [window.localStorage, window.sessionStorage];

export const getStoredToken = () =>
  window.sessionStorage.getItem(TOKEN_KEY) || window.localStorage.getItem(TOKEN_KEY);

export const clearStoredAuth = () => {
  storageTargets.forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  });
};

export const storeAuthSession = ({ token, user }) => {
  clearStoredAuth();

  const storage = user?.role === 'admin' ? window.sessionStorage : window.localStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
};
