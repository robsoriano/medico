// src/components/PatientRecordView.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const PatientRecordView = ({ record, open, handleClose }) => {
  const { t } = useSimpleLanguage();

  if (!record) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('recordDetails')}</DialogTitle>
      <DialogContent dividers>
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
        {record.updated_by ? (
  <Typography variant="body2" sx={{ mt: 1 }}>
    {t('updatedBy')}: {record.updated_by}
  </Typography>
) : (
  <Typography variant="body2" sx={{ mt: 1 }}>
    {t('neverUpdated') || "Never updated"}
  </Typography>
)}
{record.updated_at ? (
  <Typography variant="body2">
    {t('updatedAt')}: {new Date(record.updated_at).toLocaleString()}
  </Typography>
) : (
  <Typography variant="body2">
    {t('noUpdateDate') || "No update date"}
  </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientRecordView;
