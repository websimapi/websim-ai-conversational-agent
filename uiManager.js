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
  }
  
  onSendMessage(callback) {
    this.sendMessageCallback = callback;
  }
  
  onMicButtonClick(callback) {
    this.micButton.addEventListener('click', callback);
  }
  
  handleSendMessage() {
    const message = this.userInput.value.trim();
    if (message && this.sendMessageCallback) {
      this.sendMessageCallback(message);
      this.userInput.value = '';
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

