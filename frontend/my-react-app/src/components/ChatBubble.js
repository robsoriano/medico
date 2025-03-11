// src/components/ChatBubble.js
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, List, ListItem, ListItemText } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { getMessages, sendMessage } from '../services/messagingService';
import { getUserId } from '../services/tokenService';
import { useSimpleLanguage } from '../context/SimpleLanguageContext';

const ChatBubble = () => {
  const { t } = useSimpleLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const currentUserId = getUserId();

  // For demonstration, we use a fixed conversation partner.
  // In a real scenario, you might let the user choose whom to chat with.
  const conversationPartnerId = 2; 

  const fetchMessages = async () => {
    try {
      const response = await getMessages(conversationPartnerId);
      setMessages(response.data);
      setError('');
    } catch (err) {
      setError(t('failedToFetchMessages') || 'Failed to fetch messages.');
    }
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open]);

  const handleSend = async () => {
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
    <Box>
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          <ChatIcon />
        </IconButton>
      )}
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: { xs: '90%', sm: 400 },
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            zIndex: 1300,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{t('internalMessaging') || 'Internal Messaging'}</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id}>
                  <ListItemText
                    primary={msg.content}
                    secondary={
                      msg.sender_id === currentUserId
                        ? `${t('you') || 'You'} - ${new Date(msg.created_at).toLocaleString()}`
                        : `${t('partner') || 'Partner'} - ${new Date(msg.created_at).toLocaleString()}`
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('enterMessage') || 'Type a message...'}
              fullWidth
            />
            <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>
              {t('send') || 'Send'}
            </Button>
          </Box>
          {error && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ChatBubble;
