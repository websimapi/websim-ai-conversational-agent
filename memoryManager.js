export class MemoryManager {
  constructor() {
    // Initialize memory storage
    this.memories = [];
    
    // Try to load memories from local storage
    this.loadMemories();
  }
  
  loadMemories() {
    const storedMemories = localStorage.getItem('ai_memories');
    if (storedMemories) {
      try {
        this.memories = JSON.parse(storedMemories);
      } catch (e) {
        console.error('Error loading memories from storage', e);
        this.memories = [];
      }
    }
  }
  
  saveMemories() {
    localStorage.setItem('ai_memories', JSON.stringify(this.memories));
  }
  
  storeMemory(memory) {
    const newMemory = {
      content: memory,
      timestamp: Date.now(),
      keywords: this.extractKeywords(memory)
    };
    
    this.memories.push(newMemory);
    this.saveMemories();
  }
  
  extractKeywords(text) {
    // Simple keyword extraction
    const stopWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by'];
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
  }
  
  getMemories(topic = '') {
    if (!topic) {
      // Return all memories content
      return this.memories.map(m => m.content);
    }
    
    // Filter memories by relevance to topic
    const topicKeywords = this.extractKeywords(topic);
    
    return this.memories
      .filter(memory => {
        // Check if any keyword from the topic matches any keyword in the memory
        return topicKeywords.some(keyword => 
          memory.keywords.includes(keyword) || memory.content.toLowerCase().includes(keyword)
        );
      })
      .map(m => m.content);
  }
  
  getRelevantMemories(input) {
    const inputKeywords = this.extractKeywords(input);
    
    if (inputKeywords.length === 0) {
      return [];
    }
    
    // Find memories that have keyword overlap with the input
    return this.memories
      .filter(memory => {
        return inputKeywords.some(keyword => 
          memory.keywords.includes(keyword) || memory.content.toLowerCase().includes(keyword)
        );
      })
      .map(m => m.content);
  }
  
  clearMemories() {
    this.memories = [];
    localStorage.removeItem('ai_memories');
  }
}

