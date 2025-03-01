// src/components/CurrentTime.js
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute

    // Update immediately on mount
    setCurrentTime(new Date());

    return () => clearInterval(timerId);
  }, []);

  return (
    <Typography variant="body2" color="text.secondary">
      {`Current Time: ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${currentTime.toLocaleDateString()}`}
    </Typography>
  );
};

export default CurrentTime;
