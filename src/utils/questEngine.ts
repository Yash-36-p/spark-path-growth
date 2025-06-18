
import { UserProfile, Quest } from '@/types';

export const generatePersonalizedQuests = (
  userProfile: UserProfile,
  type: 'daily' | 'weekly'
): Quest[] => {
  const questDatabase = {
    daily: {
      adventurous: [
        {
          id: 'adv_daily_1',
          title: 'Step Outside Your Comfort Zone',
          description: 'Try something new that challenges you today',
          category: 'Personal Growth',
          difficulty: 'medium' as const,
          pointsReward: 75,
          estimatedTime: '30 minutes',
          instructions: [
            'Think of something you\'ve been wanting to try but haven\'t yet',
            'Choose one small action you can take today toward that goal',
            'Take that action, no matter how small',
            'Reflect on how it felt to push your boundaries'
          ],
          reflectionPrompts: ['How did stepping outside your comfort zone make you feel?'],
          personalityMatch: ['adventurous'],
          tags: ['growth', 'challenge', 'courage']
        },
        {
          id: 'adv_daily_2',
          title: 'Random Act of Adventure',
          description: 'Choose a spontaneous activity and embrace the unexpected',
          category: 'Adventure',
          difficulty: 'easy' as const,
          pointsReward: 50,
          estimatedTime: '20 minutes',
          instructions: [
            'Close your eyes and point to a location on a map',
            'Visit that location or research it if it\'s far away',
            'Find one interesting thing about that place',
            'Plan a future adventure there'
          ],
          reflectionPrompts: ['What did you discover that surprised you?'],
          personalityMatch: ['adventurous'],
          tags: ['spontaneity', 'exploration', 'discovery']
        }
      ],
      introspective: [
        {
          id: 'intro_daily_1',
          title: 'Morning Mindfulness Practice',
          description: 'Start your day with intentional reflection and awareness',
          category: 'Self-Reflection',
          difficulty: 'easy' as const,
          pointsReward: 60,
          estimatedTime: '15 minutes',
          instructions: [
            'Find a quiet space where you won\'t be disturbed',
            'Sit comfortably and focus on your breathing for 5 minutes',
            'Ask yourself: "What am I feeling right now?" and listen',
            'Write down three things you\'re grateful for today'
          ],
          reflectionPrompts: ['What insights came up during your mindfulness practice?'],
          personalityMatch: ['introspective'],
          tags: ['mindfulness', 'gratitude', 'self-awareness']
        },
        {
          id: 'intro_daily_2',
          title: 'Values Reflection',
          description: 'Explore what truly matters to you in this moment',
          category: 'Self-Discovery',
          difficulty: 'medium' as const,
          pointsReward: 80,
          estimatedTime: '25 minutes',
          instructions: [
            'List your top 5 personal values',
            'Think about how you honored these values yesterday',
            'Identify one value you want to focus on more',
            'Plan one specific action to align with that value today'
          ],
          reflectionPrompts: ['Which value feels most important to focus on right now and why?'],
          personalityMatch: ['introspective'],
          tags: ['values', 'purpose', 'alignment']
        }
      ],
      social: [
        {
          id: 'social_daily_1',
          title: 'Meaningful Connection',
          description: 'Reach out to someone important to you',
          category: 'Relationships',
          difficulty: 'easy' as const,
          pointsReward: 65,
          estimatedTime: '20 minutes',
          instructions: [
            'Think of someone you haven\'t spoken to in a while',
            'Send them a thoughtful message asking how they\'re doing',
            'Share something genuine about your current life',
            'Ask them a meaningful question about their life'
          ],
          reflectionPrompts: ['How did reaching out make you feel? What did you learn about your friend?'],
          personalityMatch: ['social'],
          tags: ['connection', 'friendship', 'communication']
        }
      ],
      creative: [
        {
          id: 'creative_daily_1',
          title: 'Creative Expression Challenge',
          description: 'Express yourself through any creative medium',
          category: 'Creativity',
          difficulty: 'medium' as const,
          pointsReward: 70,
          estimatedTime: '30 minutes',
          instructions: [
            'Choose a creative medium (drawing, writing, music, etc.)',
            'Set a timer for 15 minutes',
            'Create something without worrying about perfection',
            'Focus on the process, not the outcome'
          ],
          reflectionPrompts: ['What did this creative session reveal about your current state of mind?'],
          personalityMatch: ['creative'],
          tags: ['creativity', 'expression', 'flow']
        }
      ],
      analytical: [
        {
          id: 'analytical_daily_1',
          title: 'Daily Optimization',
          description: 'Analyze and improve one aspect of your daily routine',
          category: 'Self-Improvement',
          difficulty: 'medium' as const,
          pointsReward: 75,
          estimatedTime: '25 minutes',
          instructions: [
            'Identify one daily habit or routine you want to improve',
            'Track this habit for today and note when/how you do it',
            'Analyze what works well and what could be better',
            'Design one small improvement to implement tomorrow'
          ],
          reflectionPrompts: ['What patterns did you notice? How might this small change impact your overall well-being?'],
          personalityMatch: ['analytical'],
          tags: ['optimization', 'habits', 'data']
        }
      ]
    },
    weekly: {
      adventurous: [
        {
          id: 'adv_weekly_1',
          title: 'Adventure Planning Challenge',
          description: 'Plan and execute a mini-adventure this week',
          category: 'Adventure',
          difficulty: 'hard' as const,
          pointsReward: 200,
          estimatedTime: '2-3 hours',
          instructions: [
            'Research three new activities available in your area',
            'Choose one that excites and slightly intimidates you',
            'Plan the logistics (when, where, what you need)',
            'Execute your adventure and document the experience'
          ],
          reflectionPrompts: ['What did you learn about yourself through this adventure?'],
          personalityMatch: ['adventurous'],
          tags: ['adventure', 'planning', 'courage']
        }
      ],
      introspective: [
        {
          id: 'intro_weekly_1',
          title: 'Weekly Life Review',
          description: 'Conduct a deep reflection on your week',
          category: 'Self-Reflection',
          difficulty: 'medium' as const,
          pointsReward: 150,
          estimatedTime: '1 hour',
          instructions: [
            'Set aside quiet time for uninterrupted reflection',
            'Review each day of the week and note significant moments',
            'Identify patterns in your emotions, behaviors, and thoughts',
            'Set intentions for the coming week based on your insights'
          ],
          reflectionPrompts: ['What themes emerged from this week? What would you like to change or continue?'],
          personalityMatch: ['introspective'],
          tags: ['reflection', 'patterns', 'growth']
        }
      ],
      social: [
        {
          id: 'social_weekly_1',
          title: 'Community Connection Project',
          description: 'Engage with your community in a meaningful way',
          category: 'Social Impact',
          difficulty: 'medium' as const,
          pointsReward: 175,
          estimatedTime: '2 hours',
          instructions: [
            'Research local community organizations or volunteer opportunities',
            'Choose one that aligns with your values',
            'Reach out and offer your time or skills',
            'Participate in at least one activity or event'
          ],
          reflectionPrompts: ['How did contributing to your community make you feel? What connections did you make?'],
          personalityMatch: ['social'],
          tags: ['community', 'service', 'impact']
        }
      ],
      creative: [
        {
          id: 'creative_weekly_1',
          title: 'Creative Project Week',
          description: 'Start and complete a creative project this week',
          category: 'Creativity',
          difficulty: 'hard' as const,
          pointsReward: 250,
          estimatedTime: '3-4 hours',
          instructions: [
            'Choose a creative project you can complete in a week',
            'Break it down into daily tasks',
            'Work on it a little each day',
            'Share your completed project with someone'
          ],
          reflectionPrompts: ['What did the creative process teach you about persistence and expression?'],
          personalityMatch: ['creative'],
          tags: ['creativity', 'project', 'completion']
        }
      ],
      analytical: [
        {
          id: 'analytical_weekly_1',
          title: 'Personal Metrics Analysis',
          description: 'Track and analyze personal data for insights',
          category: 'Self-Analysis',
          difficulty: 'hard' as const,
          pointsReward: 200,
          estimatedTime: '2 hours',
          instructions: [
            'Choose 3-5 personal metrics to track (mood, productivity, exercise, etc.)',
            'Track these metrics for the entire week',
            'Create a simple visualization of your data',
            'Identify correlations and patterns'
          ],
          reflectionPrompts: ['What surprising patterns did you discover? How can you use this data to improve your life?'],
          personalityMatch: ['analytical'],
          tags: ['data', 'analysis', 'insights']
        }
      ]
    }
  };

  // Get quests based on personality type and type (daily/weekly)
  const personalityQuests = questDatabase[type][userProfile.personalityType] || [];
  
  // Add some variety by including quests from preferred categories
  const categoryQuests = Object.values(questDatabase[type])
    .flat()
    .filter(quest => 
      userProfile.preferences.categories.some(cat => 
        quest.category.toLowerCase().includes(cat.toLowerCase()) ||
        quest.tags.some(tag => cat.toLowerCase().includes(tag.toLowerCase()))
      )
    );

  // Combine and deduplicate
  const allQuests = [...personalityQuests, ...categoryQuests];
  const uniqueQuests = allQuests.filter((quest, index, self) => 
    index === self.findIndex(q => q.id === quest.id)
  );

  // Filter by difficulty preference if specified
  const filteredQuests = uniqueQuests.filter(quest => {
    if (userProfile.preferences.difficultyLevel === 'easy') {
      return quest.difficulty === 'easy';
    } else if (userProfile.preferences.difficultyLevel === 'hard') {
      return quest.difficulty === 'hard';
    }
    return true; // medium accepts all
  });

  // Return appropriate number of quests
  const questCount = type === 'daily' ? 3 : 2;
  return filteredQuests.slice(0, questCount);
};
