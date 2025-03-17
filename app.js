// Main application logic
import { ConversationAgent } from './conversationAgent.js';
import { SpeechManager } from './speechManager.js';
import { UIManager } from './uiManager.js';
import { ConversationTopics } from './conversationTopics.js';
import { MemoryManager } from './memoryManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize components
  const memoryManager = new MemoryManager();
  const speechManager = new SpeechManager();
  const conversationAgent = new ConversationAgent(memoryManager);
  const uiManager = new UIManager(
    document.getElementById('conversation-container'),
    document.getElementById('user-input'),
    document.getElementById('send-button'),
    document.getElementById('mic-button')
  );

  // Set up event handlers
  uiManager.onSendMessage(async (message) => {
    if (!message.trim()) return;
    
    // Display user message
    uiManager.addUserMessage(message);
    
    // Show thinking indicator
    uiManager.showThinking();
    
    try {
      // Get AI response
      const response = await conversationAgent.processUserInput(message);
      
      // Hide thinking indicator
      uiManager.hideThinking();
      
      // Display and speak AI response
      uiManager.addAIMessage(response);
      await speechManager.speak(response).catch(err => {
        console.error('Speech error caught:', err);
      });
      
      // Check if we should start a new topic after a pause
      setTimeout(() => {
        checkForNewConversationTopic();
      }, 10000); // 10 second pause
    } catch (error) {
      console.error('Error processing message:', error);
      uiManager.hideThinking();
      uiManager.addAIMessage("I'm sorry, I encountered an error processing your message.");
    }
  });
  
  // Set up voice input
  uiManager.onMicButtonClick(async () => {
    try {
      uiManager.setStatus('Listening...');
      const transcript = await speechManager.startListening();
      uiManager.setUserInput(transcript);
      uiManager.setStatus('');
    } catch (error) {
      console.error('Voice recognition error:', error);
      uiManager.setStatus('Could not understand. Please try again.');
      setTimeout(() => uiManager.setStatus(''), 3000);
    }
  });
  
  // Function to start a new conversation topic when there's silence
  const checkForNewConversationTopic = async () => {
    // Only suggest a new topic if no conversation in the last few seconds
    if (conversationAgent.getTimeSinceLastMessage() > 10000) {
      const newTopic = ConversationTopics.getRandomTopic();
      uiManager.showThinking();
      const response = await conversationAgent.initiateConversation(newTopic);
      uiManager.hideThinking();
      uiManager.addAIMessage(response);
      await speechManager.speak(response);
    }
  };

  // Start with an initial greeting
  uiManager.showThinking();
  try {
    const initialGreeting = await conversationAgent.initiateConversation('greeting');
    uiManager.hideThinking();
    uiManager.addAIMessage(initialGreeting);
    await speechManager.speak(initialGreeting).catch(err => {
      console.error('Initial greeting speech error:', err);
    });
  } catch (error) {
    console.error('Error with initial greeting:', error);
    uiManager.hideThinking();
    uiManager.addAIMessage("Hello! How can I help you today?");
  }
});