export class UIManager {
  constructor(conversationContainer, userInput, sendButton, micButton) {
    this.conversationContainer = conversationContainer;
    this.userInput = userInput;
    this.sendButton = sendButton;
    this.micButton = micButton;
    this.thinkingElement = null;
    this.statusElement = document.createElement('div');
    this.statusElement.className = 'status-indicator';
    this.conversationContainer.after(this.statusElement);
    
    // Add clear memory button
    this.clearButton = document.createElement('button');
    this.clearButton.id = 'clear-button';
    this.clearButton.className = 'clear-button';
    this.clearButton.title = 'Clear conversation history';
    this.clearButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    document.body.appendChild(this.clearButton);
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSendMessage();
      }
    });
    
    this.sendButton.addEventListener('click', () => {
      this.handleSendMessage();
    });
    
    this.clearButton.addEventListener('click', () => {
      this.handleClearMemory();
    });
  }
  
  onSendMessage(callback) {
    this.sendMessageCallback = callback;
  }
  
  onMicButtonClick(callback) {
    this.micButton.addEventListener('click', callback);
  }
  
  onClearMemory(callback) {
    this.clearMemoryCallback = callback;
  }
  
  handleSendMessage() {
    const message = this.userInput.value.trim();
    if (message && this.sendMessageCallback) {
      this.sendMessageCallback(message);
      this.userInput.value = '';
    }
  }
  
  handleClearMemory() {
    if (confirm('Are you sure you want to clear all conversation history and memories? This cannot be undone.')) {
      if (this.clearMemoryCallback) {
        this.clearMemoryCallback();
        this.conversationContainer.innerHTML = ''; // Clear the UI
        this.addAIMessage("Hello! I've cleared my memory. How can I help you today?");
      }
    }
  }
  
  addUserMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = text;
    this.conversationContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  addAIMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    messageElement.textContent = text;
    this.conversationContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  showThinking() {
    if (this.thinkingElement) return;
    
    this.thinkingElement = document.createElement('div');
    this.thinkingElement.className = 'thinking';
    
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'thinking-dots';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'thinking-dot';
      dotsContainer.appendChild(dot);
    }
    
    this.thinkingElement.appendChild(dotsContainer);
    this.conversationContainer.appendChild(this.thinkingElement);
    this.scrollToBottom();
  }
  
  hideThinking() {
    if (this.thinkingElement) {
      this.thinkingElement.remove();
      this.thinkingElement = null;
    }
  }
  
  setStatus(message) {
    this.statusElement.textContent = message;
  }
  
  setUserInput(text) {
    this.userInput.value = text;
  }
  
  scrollToBottom() {
    this.conversationContainer.scrollTop = this.conversationContainer.scrollHeight;
  }
}