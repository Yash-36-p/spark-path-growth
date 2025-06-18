
export interface UserProfile {
  id: string;
  name: string;
  personalityType: 'adventurous' | 'introspective' | 'social' | 'creative' | 'analytical';
  currentMood: number; // 1-10 scale
  goals: string[];
  preferences: {
    questFrequency: 'daily' | 'weekly' | 'flexible';
    difficultyLevel: 'easy' | 'medium' | 'hard';
    categories: string[];
  };
  completedQuests: string[];
  createdAt: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pointsReward: number;
  estimatedTime: string;
  instructions: string[];
  reflectionPrompts: string[];
  personalityMatch: string[];
  tags: string[];
}

export interface Reflection {
  id: string;
  questId: string;
  type: 'text' | 'photo' | 'audio';
  content: string | File;
  mood: number;
  insights: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'profile_boost' | 'exclusive_content' | 'special_features';
  icon: string;
  available: boolean;
}
