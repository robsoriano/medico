// src/components/PatientRecords.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import { getPatientRecords, deletePatientRecord } from '../services/patientService';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';
import PatientRecordForm from './PatientRecordForm';
import PatientRecordView from './PatientRecordView';
import { getUserRole } from '../services/tokenService';
import { useNotification } from '../context/NotificationContext';

const PatientRecords = ({ patientId }) => {
  const { t } = useSimpleLanguage();
  const { showNotification } = useNotification();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  
  const role = getUserRole();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await getPatientRecords(patientId);
      setRecords(response.data);
      setError('');
    } catch (err) {
      setError(t('failedToFetchRecords') || 'Failed to fetch records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [patientId, t]);

  const handleRecordAdded = () => {
    fetchRecords();
    setEditingRecord(null);
    setViewingRecord(null);
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await deletePatientRecord(patientId, recordId);
      showNotification(t('recordDeletedSuccessfully') || "Record deleted successfully", "success");
      fetchRecords();
    } catch (err) {
      showNotification(t('failedToDeleteRecord') || "Failed to delete record", "error");
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleViewRecord = (record) => {
    setViewingRecord(record);
  };

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
            <Box sx={{ mt: 1 }}>
              {role === 'doctor' && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditRecord(record)}
                  >
                    {t('editRecord') || "Edit"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    {t('deleteRecord') || "Delete"}
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewRecord(record)}
              >
                {t('viewRecord') || "View"}
              </Button>
            </Box>
          </Paper>
        ))
      )}
      {role === 'doctor' && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => { setEditingRecord(null); setFormOpen(true); }}>
          {t('addRecord')}
        </Button>
      )}
      <PatientRecordForm
        patientId={patientId}
        open={formOpen}
        handleClose={() => { setFormOpen(false); setEditingRecord(null); }}
        onRecordAdded={handleRecordAdded}
        initialRecord={editingRecord}
      />
      <PatientRecordView
        record={viewingRecord}
        open={Boolean(viewingRecord)}
        handleClose={() => setViewingRecord(null)}
      />
    </Box>
  );
};

export default PatientRecords;
