// src/services/messagingService.js
import API from './api';

export const getMessages = async (partnerId) => {
  try {
    const response = await API.get(`/messages?user_id=${partnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (partnerId, content) => {
  try {
    const response = await API.post('/messages', { recipient_id: partnerId, content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getConversationPartners = async () => {
  try {
    const response = await API.get('/users/conversation-partners');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation partners:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await API.put(`/messages/${messageId}`, { read: true });
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};