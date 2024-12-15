import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
    const [popups, setPopups] = useState({});

    const openPopup = (popupName) => {
        setPopups((prev) => ({ ...prev, [popupName]: true }));
    };

    const closePopup = (popupName) => {
        setPopups((prev) => ({ ...prev, [popupName]: false }));
    };

    return (
        <PopupContext.Provider value={{ popups, openPopup, closePopup }}>
            {children}
        </PopupContext.Provider>
    );
};