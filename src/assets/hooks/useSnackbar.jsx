// useSnackbar.js
import { useState, useEffect } from 'react';

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState({ show: false, type: '', message: '' });

    const showSnackbar = (type, message) => {
        setSnackbar({ show: true, type, message });

        setTimeout(() => {
            setSnackbar({ show: false, type: '', message: '' });
        }, 2000);
    };

    return [snackbar, showSnackbar];
};
