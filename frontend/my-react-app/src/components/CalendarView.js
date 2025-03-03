// src/components/CalendarView.js
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAppointments } from '../services/appointmentService';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

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

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        // Transform the appointments data to calendar events
        const events = response.data.map((appointment) => ({
          id: appointment.id,
          title: `Dr. ${appointment.doctor}`,
          start: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`),
          end: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 30 * 60000), // assume 30 minute duration
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
      <Button variant="outlined" component={Link} to="/dashboard" sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <div style={{ height: '80vh' }}>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
