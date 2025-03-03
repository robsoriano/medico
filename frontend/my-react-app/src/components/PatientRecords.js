// src/components/PatientRecords.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import { getPatientRecords } from '../services/patientService'; // Ensure you have a function for this
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const PatientRecords = ({ patientId }) => {
  const { t } = useSimpleLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await getPatientRecords(patientId);
        setRecords(response.data);
      } catch (err) {
        setError(t('failedToFetchRecords') || 'Failed to fetch records.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId, t]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('patientRecords')}
      </Typography>
      {loading ? (
        <Typography>{t('loadingRecords')}</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : records.length === 0 ? (
        <Typography>{t('noRecordsFound')}</Typography>
      ) : (
        records.map((record) => (
          <Paper key={record.id} sx={{ p: 2, mb: 2 }}>
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
          </Paper>
        ))
      )}
      {/* For now, the Add Record button is just a placeholder */}
      <Button variant="contained" sx={{ mt: 2 }}>
        {t('addRecord')}
      </Button>
    </Box>
  );
};

export default PatientRecords;
