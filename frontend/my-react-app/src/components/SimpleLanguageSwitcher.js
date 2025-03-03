// src/components/SimpleLanguageSwitcher.js
import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const SimpleLanguageSwitcher = () => {
  const { language, setLanguage } = useSimpleLanguage();

  return (
    <ButtonGroup variant="text" sx={{ mr: 2 }}>
      <Button 
        onClick={() => setLanguage('en')}
        disabled={language === 'en'}
        sx={{
          color: 'white',
          textTransform: 'none'
        }}
      >
        English
      </Button>
      <Button 
        onClick={() => setLanguage('es')}
        disabled={language === 'es'}
        sx={{
          color: 'white',
          textTransform: 'none'
        }}
      >
        Español
      </Button>
    </ButtonGroup>
  );
};

export default SimpleLanguageSwitcher;
