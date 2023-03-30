// Snackbar.js
import React from 'react';


const Snackbar = ({ show, type, message }) => {
    return (
        <div className={`snackbar ${show ? 'show' : ''} ${type}`}>
            {message}
        </div>
    );
};

export default Snackbar;
