// Quiz Generation Utility
class QuizGenerator {
  static generateQuiz(transcript, options = {}) {
    const { numQuestions = 5 } = options;
    
    // Simple quiz generation from transcript
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const questions = [];
    
    for (let i = 0; i < Math.min(numQuestions, sentences.length); i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(' ');
      
      if (words.length > 5) {
        // Create cloze question
        const keyWordIndex = Math.floor(words.length / 2);
        const keyWord = words[keyWordIndex];
        const question = words.map((w, idx) => idx === keyWordIndex ? '____' : w).join(' ');
        
        questions.push({
          question: question + '?',
          options: [keyWord, 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: `The correct answer is "${keyWord}"`
        });
      }
    }
    
    return questions;
  }
}