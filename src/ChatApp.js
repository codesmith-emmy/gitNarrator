import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import "./ChatApp.css";
import ReactMarkdown from 'react-markdown';
import defaultUserIcon from './default-user-icon.svg';
import aiAvatarIcon from './ai-avatar.svg';

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.REACT_APP_API_KEY;

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const userInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const userMessageAreaRef = useRef(null);
  const aiResponseAreaRef = useRef(null);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    const userMessage = userInputRef.current.value.trim();

    if (userMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', content: userMessage },
      ]);

      userInputRef.current.value = '';

      const aiResponse = await generateAiResponse(userMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', content: aiResponse },
      ]);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAiResponse = async (userMessage) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
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
      { text: process.env.REACT_APP_PROMPTS_02A },
      { text: process.env.REACT_APP_PROMPTS_02B },
      { text: process.env.REACT_APP_PROMPTS_03A },
      { text: process.env.REACT_APP_PROMPTS_03B },
      { text: process.env.REACT_APP_PROMPTS_04A },
      { text: process.env.REACT_APP_PROMPTS_04B },
      { text: process.env.REACT_APP_PROMPTS_05A },
      { text: process.env.REACT_APP_PROMPTS_05B },
      { text: process.env.REACT_APP_PROMPTS_06A },
      { text: process.env.REACT_APP_PROMPTS_06B },
      { text: process.env.REACT_APP_PROMPTS_07A },
      { text: process.env.REACT_APP_PROMPTS_07B },
      { text: process.env.REACT_APP_PROMPTS_08A },
      { text: process.env.REACT_APP_PROMPTS_08B },
      { text: process.env.REACT_APP_PROMPTS_09A },
      { text: process.env.REACT_APP_PROMPTS_09B },
      { text: process.env.REACT_APP_PROMPTS_10A },
      { text: process.env.REACT_APP_PROMPTS_10B },
      { text: process.env.REACT_APP_PROMPTS_11A },
      { text: process.env.REACT_APP_PROMPTS_11B },
      { text: process.env.REACT_APP_PROMPTS_12A },
      { text: process.env.REACT_APP_PROMPTS_12B },
      { text: process.env.REACT_APP_PROMPTS_13A },
      { text: process.env.REACT_APP_PROMPTS_13B },
      { text: process.env.REACT_APP_PROMPTS_14A },
      { text: process.env.REACT_APP_PROMPTS_14B },
      { text: process.env.REACT_APP_PROMPTS_15A },
      { text: process.env.REACT_APP_PROMPTS_15B },
      { text: process.env.REACT_APP_PROMPTS_16A },
      { text: process.env.REACT_APP_PROMPTS_16B },
      { text: userMessage },
      { text: "output: " }
    ];
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    return response.text();
  };

  const syncScroll = (source, target) => {
    const ratio = source.scrollTop / (source.scrollHeight - source.clientHeight);
    target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
  };

  useEffect(() => {
    const userMessageArea = userMessageAreaRef.current;
    const aiResponseArea = aiResponseAreaRef.current;

    const handleUserScroll = () => syncScroll(userMessageArea, aiResponseArea);
    const handleAiScroll = () => syncScroll(aiResponseArea, userMessageArea);

    if (userMessageArea && aiResponseArea) {
      userMessageArea.addEventListener('scroll', handleUserScroll);
      aiResponseArea.addEventListener('scroll', handleAiScroll);
    }

    return () => {
      if (userMessageArea && aiResponseArea) {
        userMessageArea.removeEventListener('scroll', handleUserScroll);
        aiResponseArea.removeEventListener('scroll', handleAiScroll);
      }
    };
  }, []);

  return (
    <div id="chat-container">
      <div id="header">
        <h1>gitNarrator</h1>
      </div>
      <div id="message-areas">
        <div id="user-message-area" className="message-area">
          <h2>User Messages</h2>
          <div className="message-content-area" ref={userMessageAreaRef}>
            {messages.map((message, index) => (
              message.sender === 'user' && (
                <div key={index} className="message user">
                  <div className="avatar">
                    <img src={defaultUserIcon} alt="User Avatar" />
                  </div>
                  <div className="message-content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              )
            ))}
            <div ref={conversationEndRef}></div>
          </div>
        </div>
        <div id="response-area" className="message-area">
          <h2>AI Responses</h2>
          <div className="message-content-area" ref={aiResponseAreaRef}>
            {messages.map((message, index) => (
              message.sender === 'ai' && (
                <div key={index} className="message ai">
                  <div className="avatar">
                    <img src={aiAvatarIcon} alt="AI Avatar" />
                  </div>
                  <div className="message-content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              )
            ))}
            <div ref={conversationEndRef}></div>
          </div>
        </div>
      </div>
      <div id="input-container">
        <input
          type="text"
          id="user-input"
          ref={userInputRef}
          onKeyUp={handleKeyUp}
          style={{ fontSize: 20 }}
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
  