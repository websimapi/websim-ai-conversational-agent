export class ConversationAgent {
  constructor(memoryManager) {
    this.conversationHistory = [];
    this.memoryManager = memoryManager;
    this.lastMessageTime = Date.now();
    
    // Load conversation history from local storage
    this.loadConversationHistory();
  }
  
  loadConversationHistory() {
    const storedHistory = localStorage.getItem('ai_conversation_history');
    if (storedHistory) {
      try {
        this.conversationHistory = JSON.parse(storedHistory);
      } catch (e) {
        console.error('Error loading conversation history from storage', e);
        this.conversationHistory = [];
      }
    }
  }
  
  saveConversationHistory() {
    // Save only the last 20 messages to prevent storage issues
    const historyToSave = this.conversationHistory.slice(-20);
    localStorage.setItem('ai_conversation_history', JSON.stringify(historyToSave));
  }
  
  async processUserInput(userInput) {
    this.lastMessageTime = Date.now();
    
    // Check for memory-related commands
    if (userInput.toLowerCase().includes('remember') || 
        userInput.toLowerCase().includes('store') || 
        userInput.toLowerCase().includes('memorize')) {
      // Extract what to remember
      const memory = this.extractMemoryFromInput(userInput);
      if (memory) {
        this.memoryManager.storeMemory(memory);
        this.addToConversationHistory('user', userInput);
        return `I'll remember that ${memory}`;
      }
    } else if (userInput.toLowerCase().includes('recall') || 
               userInput.toLowerCase().includes('what do you remember') ||
               userInput.toLowerCase().includes('what did I tell you about')) {
      // Extract what to recall
      const topic = this.extractRecallTopicFromInput(userInput);
      const memories = this.memoryManager.getMemories(topic);
      
      this.addToConversationHistory('user', userInput);
      
      if (memories.length > 0) {
        return `I remember: ${memories.join('; ')}`;
      } else {
        return "I don't have any memories about that yet.";
      }
    }
    
    // Regular conversation processing
    this.addToConversationHistory('user', userInput);
    
    // Create the LLM prompt
    const formattedHistory = this.conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');
    
    // Get memories that might be relevant to this input
    const relevantMemories = this.memoryManager.getRelevantMemories(userInput);
    const memoryContext = relevantMemories.length > 0 
      ? `Relevant information I remember: ${relevantMemories.join('; ')}`
      : '';
    
    // Prepare the LLM call
    const messages = [
      {
        role: "system",
        content: `You are a friendly, helpful, and engaging conversational AI. 
        Your responses should be natural, concise, and personable.
        ${memoryContext}`
      },
      ...this.conversationHistory.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    try {
      // Get AI response
      const completion = await websim.chat.completions.create({ messages });
      const response = completion.content || "I'm not sure how to respond to that.";
      
      // Add to conversation history
      this.addToConversationHistory('assistant', response);
      
      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm having trouble thinking right now. Can we try again?";
    }
  }
  
  async initiateConversation(topic) {
    this.lastMessageTime = Date.now();
    
    // Create a prompt for the LLM to generate an opener about the topic
    const messages = [
      {
        role: "system",
        content: `You are a friendly, engaging conversational AI. You are initiating a conversation about ${topic}. 
        Keep your response brief (1-2 sentences), natural, and inviting to encourage the user to respond.`
      }
    ];
    
    try {
      const completion = await websim.chat.completions.create({ messages });
      const response = completion.content || "Hello there! How are you doing today?";
      
      // Add to conversation history
      this.addToConversationHistory('assistant', response);
      
      return response;
    } catch (error) {
      console.error('Error initiating conversation:', error);
      return "Hello there! How are you doing today?";
    }
  }
  
  extractMemoryFromInput(input) {
    // Use a simple heuristic to extract what to remember
    const prefixes = ['remember that', 'remember', 'please remember', 'store', 'memorize'];
    
    for (const prefix of prefixes) {
      if (input.toLowerCase().includes(prefix)) {
        const startIndex = input.toLowerCase().indexOf(prefix) + prefix.length;
        return input.slice(startIndex).trim();
      }
    }
    
    return null;
  }
  
  extractRecallTopicFromInput(input) {
    // Extract topic to recall
    const prefixes = ['recall', 'what do you remember about', 'what did I tell you about'];
    
    for (const prefix of prefixes) {
      if (input.toLowerCase().includes(prefix)) {
        const startIndex = input.toLowerCase().indexOf(prefix) + prefix.length;
        return input.slice(startIndex).trim();
      }
    }
    
    return '';
  }
  
  addToConversationHistory(role, content) {
    this.conversationHistory.push({ role, content });
    
    // Limit history size
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
    
    // Save to localStorage
    this.saveConversationHistory();
  }
  
  getTimeSinceLastMessage() {
    return Date.now() - this.lastMessageTime;
  }
}