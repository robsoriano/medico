// src/components/LanguageSwitcher.js
import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng); // persist language selection if needed
  };

  return (
    <ButtonGroup variant="text" color="inherit">
      <Button onClick={() => changeLanguage('en')}>English</Button>
      <Button onClick={() => changeLanguage('es')}>Español</Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
