import jwtDecode from 'jwt-decode';

export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.usuario_id;
    } catch (error) {
        console.log('Error decoding token:', error);
        return null;
    }
};

export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
            removeToken();
            return true;
        }
        return false;
    } catch (error) {
        console.log('Error decoding token:', error);
        return true;
    }
};
