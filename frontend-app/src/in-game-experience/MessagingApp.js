import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './MessagingApp.css';

const MessagingApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const user_id = localStorage.getItem('user_id');

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    try {
      // Use axios to send the message to the Lambda function
      await axios.post('https://1u6nw0va81.execute-api.us-east-1.amazonaws.com/dev/sendmessage', {
        message: message,
      });
      console.log('Message sent:', message); // Add a log to check if message is sent
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`https://sutk92e3qc.execute-api.us-east-1.amazonaws.com/dev/user_info?user_id=${user_id}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  const fetchMessages = async () => {
    try {
      // Use axios to fetch messages from the Lambda function
      const response = await axios.get('https://y0lqhm1s50.execute-api.us-east-1.amazonaws.com/dev/receivemessage');

      // Check if the API response status is 200 and if the response data has the 'body' field
      if (response && response.status === 200 && response.data.body) {
        const data = JSON.parse(response.data.body); // Parse the JSON string in the 'body' field
        console.log('Received message:', data.message); // Add a log to check received message

        // Check if the received message is not null before adding it to the messages state
        if (data.message !== null) {
          // Remove the quotes from the received message
          const formattedMessage = data.message.replace(/"/g, '');

          // Add the formatted message to the messages state if it's not empty after removing quotes
          if (formattedMessage.trim() !== '') {
            // Fetch user details based on user_id
            const userDetails = await fetchUserDetails();
            if (userDetails) {
              console.log(userDetails)
              // Combine user details with the message content
              const messageContent = `${userDetails.name}: ${formattedMessage}`;
              // const messageContent = `"Vinayak Abhinav": ${formattedMessage}`;

              // Add the message to the messages state along with user_id
              setMessages(prevMessages => [
                ...prevMessages,
                { content: messageContent, user_id: userDetails.user_id, isSentByCurrentUser: true }
                // { content: messageContent, isSentByCurrentUser: true }
              ]);
              scrollToBottom(); // Scroll to the bottom when new messages arrive
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Fetch messages when the component mounts
    fetchMessages();

    // Set up interval to fetch messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when new messages are added
  }, [messages]);

  return (
    <Container className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isSentByCurrentUser ? 'sent-by-current-user' : 'received'}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* To scroll to the bottom */}
      </div>
      <div className="chat-input">
        <Form>
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
            </Col>
            <Col xs={3}>
              <Button onClick={sendMessage} disabled={!message} variant="primary">
                Send
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

export default MessagingApp;