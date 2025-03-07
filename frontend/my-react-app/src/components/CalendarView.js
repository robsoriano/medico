// src/components/CalendarView.js
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAppointments } from '../services/appointmentService';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Dark mode CSS overrides
const darkModeOverrides = `
  .rbc-calendar {
    background-color: #212121 !important;
    color: #ffffff !important;
  }
  .rbc-month-view {
    background-color: #212121 !important;
  }
  .rbc-header {
    background-color: #212121 !important;
    color: #ffffff !important;
  }
  .rbc-day-bg, .rbc-day-slot {
    background-color: #212121 !important;
  }
  .rbc-off-range {
    color: #aaaaaa !important;
  }
  .rbc-today {
    background-color: #333333 !important;
  }
  .rbc-event {
    background-color: #424242 !important;
    color: #ffffff !important;
  }
  .rbc-show-more {
    background-color: #424242 !important;
    color: #ffffff !important;
  }
  .rbc-overlay {
    background-color: #333333 !important;
    color: #ffffff !important;
  }
`;

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        // Transform the appointments data to calendar events using patient_name for the title
        const events = response.data.map((appointment) => ({
          id: appointment.id,
          title: appointment.patient_name,
          start: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`),
          end: new Date(
            new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() +
              30 * 60000
          ), // assume 30 minute duration
          allDay: false,
        }));
        setAppointments(events);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointments.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ margin: '20px' }}>
      {isDarkMode && <style>{darkModeOverrides}</style>}
      <Button variant="outlined" component={Link} to="/dashboard" sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <div style={{ height: '80vh' }}>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event) => navigate(`/appointments/${event.id}`)}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
