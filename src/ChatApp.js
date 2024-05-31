import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import "./ChatApp.css";
import ReactMarkdown from 'react-markdown';

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.REACT_APP_API_KEY;
// const prompts = process.env.REACT_APP_PROMPTS;

// const PROMPTS_01A = process.env.REACT_APP_PROMPTS_01A;
// const PROMPTS_01B = process.env.REACT_APP_PROMPTS_01B;

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const userInputRef = useRef(null);

  const sendMessage = async () => {
    const userMessage = userInputRef.current.value.trim();

    if (userMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', message: userMessage },
      ]);

      userInputRef.current.value = '';

      const aiResponse = await generateAiResponse(userMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', message: aiResponse },
      ]);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    const conversation = document.getElementById('conversation');
    if (conversation) {
      conversation.scrollTop = conversation.scrollHeight;
    }
  }, [messages]);

  const generateAiResponse = async (userMessage) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 0,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      { text: process.env.REACT_APP_PROMPTS_01A },
      { text: process.env.REACT_APP_PROMPTS_01B },
      { text: userMessage }
    ];
    
    // const parts = [{ text: userMessage }]; // Use this for testing if you have your own API access

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    return response.text();
  };

  return (
    <div id="chat-container">
        <div id="chat-container-background">gitNarrator</div>
      <div id="conversation">
        {messages.map((message, index) => (
          <div key={index} className={message.sender}>
              <ReactMarkdown>
              {(message.message)}
              </ReactMarkdown>
          </div>
        ))}
      </div>
      <div id="input-container">
        <input
          type="text"
          id="user-input"
          ref={userInputRef}
          onKeyUp={handleKeyUp}
          style={{fontSize: 20}}
          placeholder="What GitHub project would you like Brian to write about?"
        />
        <button id="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
