import API from './api';

export const getMessages = (partnerId) => {
  // Retrieves all messages between the current user and the conversation partner
  return API.get(`/api/messages?user_id=${partnerId}`);
};

export const sendMessage = (partnerId, content) => {
  // Sends a new message to the conversation partner
  return API.post('/api/messages', { recipient_id: partnerId, content });
};
