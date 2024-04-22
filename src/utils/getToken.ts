import { LocalStorageKeys } from '@/configs';

/**
 * @description returns token if exists else returns empty string
 */
export const getToken = () => {
    let token = '';
    const headerData = localStorage.getItem(LocalStorageKeys.TOKEN);
    if (headerData) {
        token = headerData;
    }

    return token;
};
