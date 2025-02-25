// src/pages/PatientList.js 
import React from 'react';
import { deletePatient } from '../services/patientService';
import { getUserRole } from '../services/tokenService';
import { Link } from 'react-router-dom';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PatientList = ({ patients, setPatients }) => {
  const role = getUserRole();
  const allowedRoles = ['doctor', 'secretary'];

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (err) {
      alert('Failed to delete patient.');
    }
  };

  return (
    <div>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <List>
          {patients.map((patient) => (
            <ListItem key={patient.id} divider>
              <ListItemText
                primary={`${patient.first_name} ${patient.last_name}`}
                secondary={patient.email}
              />
              <ListItemSecondaryAction>
                {allowedRoles.includes(role) && (
                  <>
                    <IconButton 
                      edge="end" 
                      component={Link} 
                      to={`/patients/${patient.id}/edit`} 
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDelete(patient.id)} 
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
                <IconButton
                  edge="end"
                  component={Link}
                  to={`/patients/${patient.id}`}
                  color="secondary"
                >
                  <VisibilityIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default PatientList;
