
export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
  tags?: string[];
}

// Placeholder for simulating AI-generated content
export const generateDiaryEntry = async (userInput: string): Promise<string> => {
  // This would be replaced with an actual API call to an AI service
  console.log("Processing user input:", userInput);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For now, return a fixed response with some user input to simulate AI
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const responses = [
    `Today, ${currentDate}, I felt like sharing: ${userInput}. It was a meaningful experience that made me reflect on my day.`,
    `Dear Diary, on this ${currentDate}, I wanted to note that ${userInput}. This was a significant moment worth remembering.`,
    `${currentDate} - ${userInput}. This experience has shaped my thoughts throughout the day.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

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

// Simple mood detection based on keywords (this would be replaced with actual sentiment analysis)
export const detectMood = (text: string): string => {
  const lowerText = text.toLowerCase();
  if (lowerText.match(/happy|joy|excited|great|wonderful|amazing|good|love|smile/)) {
    return "happy";
  } else if (lowerText.match(/sad|upset|depressed|unhappy|terrible|angry|annoyed|bad|hate/)) {
    return "sad";
  } else if (lowerText.match(/tired|exhausted|sleepy|drained/)) {
    return "tired";
  } else if (lowerText.match(/nervous|anxious|worried|stress/)) {
    return "nervous";
  } else {
    return "neutral";
  }
};
