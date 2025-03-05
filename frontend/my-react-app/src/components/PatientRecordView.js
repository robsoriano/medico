// src/components/PatientRecordView.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const PatientRecordView = ({ record, open, handleClose }) => {
  const { t } = useSimpleLanguage();

  if (!record) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('recordDetails') || "Record Details"}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          {t('recordDate')}: {new Date(record.record_date).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          {t('doctor')}: {record.doctor}
        </Typography>
        <Typography variant="body2">
          {t('notes')}: {record.notes}
        </Typography>
        {record.diagnosis && (
          <Typography variant="body2">
            {t('diagnosis')}: {record.diagnosis}
          </Typography>
        )}
        {record.prescription && (
          <Typography variant="body2">
            {t('prescription')}: {record.prescription}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('close') || "Close"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientRecordView;
