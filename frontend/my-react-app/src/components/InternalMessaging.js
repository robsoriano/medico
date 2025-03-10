import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { getMessages, sendMessage } from '../services/messagingService';
import { getUserId } from '../services/tokenService';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const InternalMessaging = ({ conversationPartnerId }) => {
  const { t } = useSimpleLanguage();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUserId = getUserId(); // Function to get current user id from token

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getMessages(conversationPartnerId);
      setMessages(response.data);
      setError('');
    } catch (err) {
      setError(t('failedToFetchMessages') || 'Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationPartnerId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(conversationPartnerId, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError(t('failedToSendMessage') || 'Failed to send message.');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('internalMessaging') || 'Internal Messaging'}
      </Typography>
      {loading ? (
        <Typography>{t('loadingMessages') || 'Loading messages...'}</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText
                primary={msg.content}
                secondary={
                  msg.sender_id === currentUserId
                    ? `${t('you')} - ${new Date(msg.created_at).toLocaleString()}`
                    : `${t('partner')} - ${new Date(msg.created_at).toLocaleString()}`
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          label={t('enterMessage') || 'Enter your message'}
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleSendMessage}>
          {t('send') || 'Send'}
        </Button>
      </Box>
    </Paper>
  );
};

export default InternalMessaging;
