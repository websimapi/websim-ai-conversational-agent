export class ConversationTopics {
  static topics = [
    // Personal questions
    "your day",
    "your hobbies",
    "your favorite music",
    "your favorite movies",
    "your dream vacation",
    "your favorite food",
    "your pets",
    "your family",
    
    // Fun topics
    "interesting facts",
    "space exploration",
    "dream interpretation",
    "time travel",
    "parallel universes",
    "artificial intelligence",
    "future technology",
    "underwater cities",
    
    // Philosophical topics
    "the meaning of life",
    "happiness",
    "success",
    "creativity",
    "consciousness",
    "human connection",
    
    // Practical topics
    "productivity tips",
    "learning new skills",
    "book recommendations",
    "travel advice",
    "cooking tips",
    "exercise habits",
    "meditation",
    "sleep improvement",
    
    // Hypothetical questions
    "superpowers",
    "living in a different era",
    "meeting any historical figure",
    "visiting other planets",
    "having a robot assistant",
    
    // Seasonal/timely topics
    "plans for the weekend",
    "upcoming holidays",
    "weather today",
    "current events",
    "seasonal activities"
  ];
  
  static getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * this.topics.length);
    return this.topics[randomIndex];
  }
  
  static getTopicsByCategory(category) {
    // Categories based on the list above
    const categories = {
      "personal": [0, 7],
      "fun": [8, 15],
      "philosophical": [16, 21],
      "practical": [22, 29],
      "hypothetical": [30, 34],
      "seasonal": [35, 39]
    };
    
    if (!categories[category]) {
      return this.getRandomTopic();
    }
    
    const [start, end] = categories[category];
    const topicsInCategory = this.topics.slice(start, end + 1);
    const randomIndex = Math.floor(Math.random() * topicsInCategory.length);
    
    return topicsInCategory[randomIndex];
  }
}

