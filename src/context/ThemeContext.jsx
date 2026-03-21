import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('appPrimaryColor') || 'indigo');
  const [scale, setScale] = useState(parseInt(localStorage.getItem('appScale') || '14', 10));
  const [menuType, setMenuType] = useState(localStorage.getItem('appMenuType') || 'static');
  const [menuTheme, setMenuTheme] = useState(localStorage.getItem('appMenuTheme') || 'colorScheme');
  const [inputStyle, setInputStyle] = useState(localStorage.getItem('appInputStyle') || 'outlined');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    localStorage.setItem('appPrimaryColor', primaryColor);
    localStorage.setItem('appScale', scale);
    localStorage.setItem('appMenuType', menuType);
    localStorage.setItem('appMenuTheme', menuTheme);
    localStorage.setItem('appInputStyle', inputStyle);

    // Apply classes to document root
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-primary', primaryColor);
    root.setAttribute('data-menu-type', menuType);
    root.setAttribute('data-menu-theme', menuTheme);
    root.setAttribute('data-input-style', inputStyle);
    root.style.fontSize = `${scale}px`;
  }, [theme, primaryColor, scale, menuType, menuTheme, inputStyle]);

  const value = {
    theme, setTheme,
    primaryColor, setPrimaryColor,
    scale, setScale,
    menuType, setMenuType,
    menuTheme, setMenuTheme,
    inputStyle, setInputStyle,
    isSettingsOpen, setIsSettingsOpen
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
