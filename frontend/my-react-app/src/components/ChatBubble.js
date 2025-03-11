// src/components/ChatBubble.js
import React, { useState, useEffect } from 'react';
import {
  Fab,
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { getMessages, sendMessage, getConversationPartners } from '../services/messagingService';
import { getUserRole, getUserId } from '../services/tokenService';

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [conversationPartners, setConversationPartners] = useState([]);
  const [partnerId, setPartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userRole = getUserRole();
  const userId = getUserId();

  // When the chat bubble is opened, fetch the conversation partners list
  useEffect(() => {
    if (open) {
      const fetchPartners = async () => {
        try {
          const partners = await getConversationPartners();
          setConversationPartners(partners);
          if (partners && partners.length > 0 && !partnerId) {
            setPartnerId(partners[0].id);
          }
        } catch (err) {
          setError('Failed to load conversation partners.');
        }
      };
      fetchPartners();
    }
  }, [open, partnerId]);

  // Function to fetch messages
  const fetchMessages = async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const response = await getMessages(partnerId);
      setMessages(response);
      setError('');
    } catch (err) {
      setError('Failed to load messages.');
    }
    setLoading(false);
  };

  // Fetch messages when the chat is opened or partner changes
  useEffect(() => {
    if (open && partnerId) {
      fetchMessages();
    }
  }, [open, partnerId]);

  // Set up auto-refresh to poll for new messages every 10 seconds
  useEffect(() => {
    let interval;
    if (open && partnerId) {
      interval = setInterval(() => {
        fetchMessages();
      }, 10000); // 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, partnerId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !partnerId) return;
    try {
      await sendMessage(partnerId, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  const handlePartnerChange = (event) => {
    setPartnerId(event.target.value);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(!open)}
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {open && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 120,
            right: 16,
            width: 320,
            height: 450,
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chat
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="partner-select-label">Partner</InputLabel>
            <Select
              labelId="partner-select-label"
              value={partnerId || ''}
              label="Partner"
              onChange={handlePartnerChange}
            >
              {conversationPartners.map((partner) => (
                <MenuItem key={partner.id} value={partner.id}>
                  {partner.username} ({partner.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider />
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading ? (
              <Typography variant="body2">Loading messages...</Typography>
            ) : error ? (
              <Typography variant="body2" color="error">{error}</Typography>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender_id === userId ? 'flex-end' : 'flex-start' }}>
                  <Paper
                    sx={{
                      p: 1,
                      backgroundColor: msg.sender_id === userId ? '#1976d2' : '#e0e0e0',
                      color: msg.sender_id === userId ? '#fff' : '#000'
                    }}
                  >
                    <ListItemText
                      primary={msg.content}
                      secondary={new Date(msg.created_at).toLocaleTimeString()}
                    />
                  </Paper>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2">No messages yet.</Typography>
            )}
          </List>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatBubble;
