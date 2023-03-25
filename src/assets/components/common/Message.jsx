import React, { useState, useEffect } from 'react';
// import './FadeInOut.css';

export const Message = ({ resultado, setResultado }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
            setResultado("No enviado");
        }, 2000);
    }, [resultado]);

    return (
        <div
            className={`fade-in-out ${isVisible ? 'visible' : 'hidden'}`}
        >
            {resultado}
        </div>
    );
};

