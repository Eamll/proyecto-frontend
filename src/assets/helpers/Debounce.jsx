// debounce.js
export const debounce = (func, wait) => {
    let timeout;

    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
