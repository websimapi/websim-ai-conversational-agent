export class SpeechManager {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.speechRecognition = this.initSpeechRecognition();
    this.voices = [];
    this.selectedVoice = null;
    
    // Load available voices
    if (this.speechSynthesis) {
      // Get voices - in some browsers this might be asynchronous
      this.loadVoices();
      this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }
  
  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();
    // Find a good voice - prefer female voices when available
    this.selectedVoice = this.voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google UK English Female')
    ) || this.voices[0];
  }
  
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported by this browser');
      return null;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    return recognition;
  }
  
  async speak(text) {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        console.warn('Speech synthesis not supported');
        return resolve();
      }
      
      // Cancel any ongoing speech
      this.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (err) => {
        console.error('Speech synthesis error:', err);
        reject(err);
      };
      
      this.speechSynthesis.speak(utterance);
    });
  }
  
  async startListening() {
    if (!this.speechRecognition) {
      throw new Error('Speech recognition not supported');
    }
    
    return new Promise((resolve, reject) => {
      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };
      
      this.speechRecognition.onerror = (event) => {
        reject(event.error);
      };
      
      this.speechRecognition.start();
    });
  }
  
  stopListening() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}

