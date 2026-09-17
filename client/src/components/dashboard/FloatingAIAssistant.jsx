import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, GripHorizontal } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import api from '../../services/api';
import robotVideo from '../../assets/robot.mp4';
import styles from './FloatingAIAssistant.module.css';
import Draggable from 'react-draggable';

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am Weathora AI. Ask me about your trip, outdoor activities, or the weather forecast!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Companion states
  const [companionMessages, setCompanionMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);

  const { weatherData } = useWeather();
  const messagesEndRef = useRef(null);
  const nodeRef = useRef(null);

  // Fetch companion messages
  useEffect(() => {
    const fetchCompanionMessages = async () => {
      try {
        const weatherContextString = weatherData?.current ? JSON.stringify(weatherData.current) : '';
        const { data } = await api.get(`/chat/companion${weatherContextString ? `?weatherContext=${encodeURIComponent(weatherContextString)}` : ''}`);
        if (data.success && data.messages && data.messages.length > 0) {
          setCompanionMessages(data.messages);
          setShowBubble(true);
        }
      } catch (err) {
        console.warn('Failed to fetch companion messages:', err);
      }
    };

    fetchCompanionMessages();
  }, [weatherData]);

  // Message rotation loop
  useEffect(() => {
    if (companionMessages.length === 0 || isOpen) {
      setShowBubble(false);
      return;
    }

    let isSubscribed = true;

    const cycleMessage = () => {
      if (!isSubscribed) return;
      
      setShowBubble(true);

      setTimeout(() => {
        if (!isSubscribed) return;
        setShowBubble(false);
        
        setTimeout(() => {
          if (!isSubscribed) return;
          setCurrentMessageIndex((prev) => (prev + 1) % companionMessages.length);
        }, 500); // Wait for CSS fade out
      }, 5000); // Keep bubble visible for 5 seconds
    };

    // Run first cycle
    cycleMessage();

    // Repeat every 10 seconds (5s visible, 5s hidden)
    const interval = setInterval(cycleMessage, 10000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [companionMessages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        messages: newMessages,
        weatherContext: weatherData?.current || null
      });

      if (response.data && response.data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error.response?.data?.message || 'I am sorry, I am having trouble connecting right now. Please try again later.';
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'assistant', 
        content: errorMsg 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const dragStartTime = useRef(0);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleDragStart = (e, data) => {
    dragStartTime.current = Date.now();
    dragStartPos.current = { x: data.x, y: data.y };
  };

  const handleDragStop = (e, data) => {
    const dx = data.x - dragStartPos.current.x;
    const dy = data.y - dragStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dragDuration = Date.now() - dragStartTime.current;
    
    // Treat as click if distance is very small or duration is very short
    if (distance < 5 || dragDuration < 200) {
      const target = e.target;
      // Only toggle if the target is within the robot button
      if (target && target.closest && target.closest(`.${styles.robotButton}`)) {
        handleToggle();
      }
    }
  };

  return (
    <Draggable 
      nodeRef={nodeRef} 
      handle=".drag-handle" 
      bounds="body"
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <div ref={nodeRef} className={styles.floatingContainer} style={{ position: 'fixed' }}>
        
        {isOpen && (
          <div className={styles.chatPanel}>
            <div className={`${styles.panelHeader} drag-handle`} style={{ cursor: 'grab' }}>
              <div className={styles.headerInfo}>
                <div className={styles.headerTitle}>
                  <Bot size={20} /> Weathora AI
                </div>
                <div className={styles.headerSubtitle}>
                  ✨ Context Aware: Weather • Trips • Plans
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GripHorizontal size={16} className="opacity-50" />
              </div>
            </div>

            <div className={styles.messageArea}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAI}`}
                >
                  {msg.content}
                </div>
              ))}
              
              {isLoading && (
                <div className={`${styles.message} ${styles.messageAI}`}>
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSubmit} onPointerDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question..."
                className={styles.chatInput}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className={styles.sendButton}
                disabled={!message.trim() || isLoading}
                aria-label="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Companion Speech Bubble */}
        {companionMessages.length > 0 && !isOpen && (
          <div 
            className={`${styles.speechBubble} ${showBubble ? styles.speechBubbleVisible : ''}`}
          >
            {companionMessages[currentMessageIndex]}
          </div>
        )}

        <div className="flex flex-col items-center">
          <button 
            className={`${styles.robotButton} drag-handle`} 
            aria-label="Open AI Assistant"
            title="Ask Weathora AI"
            style={{ cursor: 'grab' }}
          >
            <video 
              src={robotVideo} 
              autoPlay 
              loop 
              muted 
              playsInline
              className={styles.robotImage}
              onError={(e) => {
                // Fallback to emoji if video fails
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="font-size: 2rem;">🤖</span>';
              }}
            />
          </button>
        </div>

      </div>
    </Draggable>
  );
};

export default FloatingAIAssistant;
