
export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
  tags?: string[];
}

// Enhanced AI-generated content with more natural sounding responses
export const generateDiaryEntry = async (userInput: string): Promise<string> => {
  // This would be replaced with an actual API call to an AI service
  console.log("Processing user input:", userInput);
  
  // Simulate API delay - in a real implementation, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For now, return a more natural-sounding response with some user input to simulate AI
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Enhanced responses that sound more natural and conversational
  const responses = [
    `${currentDate}\n\nToday I ${extractActionFromInput(userInput)}. ${generateReflection(userInput)} ${generateClosingThought(userInput)}`,
    
    `Dear Diary,\n\n${currentDate} - ${capitalizeFirstLetter(userInput.trim())}. ${generateReflection(userInput)} As I reflect on this experience, ${generateClosingThought(userInput)}`,
    
    `${currentDate}\n\nI wanted to write about how ${userInput.trim().toLowerCase()}. ${generateReflection(userInput)} I'm grateful I took the time to document this feeling because ${generateClosingThought(userInput)}`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Helper functions to create more natural diary entries
function extractActionFromInput(input: string): string {
  // Simple function to try to extract an action from the user input
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("went to") || lowerInput.includes("visited")) {
    return "went out today" + (lowerInput.includes("with") ? " with friends" : "");
  } else if (lowerInput.includes("work") || lowerInput.includes("meeting")) {
    return "had a busy day at work";
  } else if (lowerInput.includes("tired") || lowerInput.includes("exhausted")) {
    return "had a tiring day";
  } else if (lowerInput.includes("happy") || lowerInput.includes("great")) {
    return "had a wonderful day";
  } else {
    return "experienced something meaningful";
  }
}

function generateReflection(input: string): string {
  // Generate a reflection based on the input
  const lowerInput = input.toLowerCase();
  const reflections = [
    "This made me think about how important it is to appreciate the little things in life.",
    "I realized that taking time for myself is essential for my wellbeing.",
    "It reminded me that every experience, good or bad, shapes who I am.",
    "This moment was a good reminder of what truly matters to me."
  ];
  
  // Add some simple sentiment-based reflections
  if (lowerInput.includes("happy") || lowerInput.includes("joy") || lowerInput.includes("great")) {
    reflections.push("It's moments like these that fill me with joy and gratitude.");
    reflections.push("I want to remember this feeling of happiness and carry it forward.");
  } else if (lowerInput.includes("sad") || lowerInput.includes("upset") || lowerInput.includes("disappointed")) {
    reflections.push("Even in difficult moments, there's always something to learn and grow from.");
    reflections.push("I know these feelings won't last forever, and tomorrow is a new day.");
  } else if (lowerInput.includes("stress") || lowerInput.includes("anxiety") || lowerInput.includes("worried")) {
    reflections.push("Taking a moment to write has helped me process some of these difficult feelings.");
    reflections.push("I should remember to breathe and take things one step at a time.");
  }
  
  return reflections[Math.floor(Math.random() * reflections.length)];
}

function generateClosingThought(input: string): string {
  // Generate a closing thought
  const closingThoughts = [
    "I'm looking forward to what tomorrow will bring.",
    "I'll try to carry this perspective with me in the days ahead.",
    "Writing this down has helped me process my thoughts more clearly.",
    "This is something I want to remember in the future.",
    "I'm grateful for having this journal to capture these moments."
  ];
  
  return closingThoughts[Math.floor(Math.random() * closingThoughts.length)];
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get diary entries from local storage
export const getDiaryEntries = (): DiaryEntry[] => {
  const entries = localStorage.getItem('diaryEntries');
  return entries ? JSON.parse(entries) : [];
};

// Save a diary entry to local storage
export const saveDiaryEntry = (entry: DiaryEntry): void => {
  const entries = getDiaryEntries();
  entries.push(entry);
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
};

// Update an existing diary entry
export const updateDiaryEntry = (updatedEntry: DiaryEntry): void => {
  const entries = getDiaryEntries();
  const index = entries.findIndex(entry => entry.id === updatedEntry.id);
  
  if (index !== -1) {
    entries[index] = updatedEntry;
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }
};

// Delete a diary entry
export const deleteDiaryEntry = (id: string): void => {
  const entries = getDiaryEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
};

// Get a single diary entry by ID
export const getDiaryEntryById = (id: string): DiaryEntry | undefined => {
  const entries = getDiaryEntries();
  return entries.find(entry => entry.id === id);
};

// Enhanced mood detection based on keywords (this would be replaced with actual sentiment analysis)
export const detectMood = (text: string): string => {
  const lowerText = text.toLowerCase();
  if (lowerText.match(/happy|joy|excited|great|wonderful|amazing|good|love|smile|delighted|pleased|thrilled|overjoyed/)) {
    return "happy";
  } else if (lowerText.match(/sad|upset|depressed|unhappy|terrible|angry|annoyed|bad|hate|gloomy|miserable|disappointed/)) {
    return "sad";
  } else if (lowerText.match(/tired|exhausted|sleepy|drained|fatigued|weary/)) {
    return "tired";
  } else if (lowerText.match(/nervous|anxious|worried|stress|tense|afraid|scared|concerned|uneasy/)) {
    return "nervous";
  } else if (lowerText.match(/relaxed|calm|peaceful|tranquil|serene|content|at ease/)) {
    return "relaxed";
  } else {
    return "neutral";
  }
};
