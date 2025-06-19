
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Auth from '@/components/Auth';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import QuestDetail from '@/components/QuestDetail';
import ReflectionModal from '@/components/ReflectionModal';
import RewardsStore from '@/components/RewardsStore';
import { UserProfile, Quest } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Database Quest interface
interface DbQuest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points_reward: number;
  estimated_time: string;
  instructions: string[];
  reflection_prompts: string[];
  personality_match: string[];
  tags: string[];
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useProfile();
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'quest' | 'rewards'>('dashboard');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const { toast } = useToast();

  console.log('Index render - user:', !!user, 'profile:', !!profile, 'authLoading:', authLoading, 'profileLoading:', profileLoading, 'profileError:', profileError);

  // Determine current view based on profile state
  useEffect(() => {
    if (profile && !profile.personality_type && currentView !== 'onboarding') {
      setCurrentView('onboarding');
    } else if (profile && profile.personality_type && currentView === 'onboarding') {
      setCurrentView('dashboard');
    }
  }, [profile, currentView]);

  // Show loading while checking auth status or profile
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-purple-600 font-medium">Loading your growth journey...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <Auth />;
  }

  // Show error if profile failed to load
  if (profileError && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-8">
          <div className="text-red-600 text-xl mb-4">⚠️ Profile Error</div>
          <p className="text-gray-600 mb-4">{profileError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading if we have a user but no profile yet (should be temporary due to trigger)
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-purple-600 font-medium">Setting up your profile...</p>
          <p className="text-gray-500 text-sm mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    const result = await updateProfile({
      name: userProfile.name,
      personality_type: userProfile.personalityType,
      current_mood: userProfile.currentMood,
      goals: userProfile.goals,
      quest_frequency: userProfile.preferences.questFrequency,
      difficulty_level: userProfile.preferences.difficultyLevel,
      categories: userProfile.preferences.categories
    });
    
    if (result.error) {
      toast({
        title: "Error updating profile",
        description: "Please try again.",
        variant: "destructive"
      });
    } else {
      setCurrentView('dashboard');
      toast({
        title: "Profile Complete! ✨",
        description: "Your personalized growth journey begins now!",
      });
    }
  };

  const handleQuestSelect = (quest: DbQuest | Quest) => {
    // Convert database quest to frontend quest format
    const frontendQuest: Quest = {
      id: quest.id,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty: quest.difficulty,
      pointsReward: 'points_reward' in quest ? quest.points_reward : quest.pointsReward,
      estimatedTime: 'estimated_time' in quest ? quest.estimated_time : quest.estimatedTime,
      instructions: quest.instructions,
      reflectionPrompts: 'reflection_prompts' in quest ? quest.reflection_prompts : quest.reflectionPrompts,
      personalityMatch: 'personality_match' in quest ? quest.personality_match : quest.personalityMatch,
      tags: quest.tags
    };
    
    setSelectedQuest(frontendQuest);
    setCurrentView('quest');
  };

  const handleQuestComplete = (points: number) => {
    setCurrentView('dashboard');
    toast({
      title: "Quest Completed! 🎉",
      description: `You earned ${points} Spark Points!`,
    });
  };

  const handleRewardPurchase = (cost: number) => {
    toast({
      title: "Reward Unlocked! 🎁",
      description: `You spent ${cost} Spark Points on a reward!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AnimatePresence mode="wait">
        {currentView === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {currentView === 'dashboard' && profile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard
              userProfile={{
                id: profile.id,
                name: profile.name,
                personalityType: profile.personality_type as any || 'introspective',
                currentMood: profile.current_mood || 5,
                goals: profile.goals || [],
                preferences: {
                  questFrequency: profile.quest_frequency as any || 'daily',
                  difficultyLevel: profile.difficulty_level as any || 'medium',
                  categories: profile.categories || []
                },
                completedQuests: [],
                createdAt: new Date()
              }}
              sparkPoints={profile.spark_points}
              onQuestSelect={handleQuestSelect}
              onNavigateToRewards={() => setCurrentView('rewards')}
              onShowReflection={() => setShowReflection(true)}
            />
          </motion.div>
        )}

        {currentView === 'quest' && selectedQuest && profile && (
          <motion.div
            key="quest"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <QuestDetail
              quest={selectedQuest}
              userProfile={{
                id: profile.id,
                name: profile.name,
                personalityType: profile.personality_type as any || 'introspective',
                currentMood: profile.current_mood || 5,
                goals: profile.goals || [],
                preferences: {
                  questFrequency: profile.quest_frequency as any || 'daily',
                  difficultyLevel: profile.difficulty_level as any || 'medium',
                  categories: profile.categories || []
                },
                completedQuests: [],
                createdAt: new Date()
              }}
              onComplete={handleQuestComplete}
              onBack={() => setCurrentView('dashboard')}
            />
          </motion.div>
        )}

        {currentView === 'rewards' && profile && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <RewardsStore
              sparkPoints={profile.spark_points}
              onPurchase={handleRewardPurchase}
              onBack={() => setCurrentView('dashboard')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showReflection && (
        <ReflectionModal
          onClose={() => setShowReflection(false)}
          onSubmit={(reflection) => {
            console.log('Reflection submitted:', reflection);
            setShowReflection(false);
            toast({
              title: "Reflection Saved! 📝",
              description: "Your thoughts have been recorded for your growth journey.",
            });
          }}
        />
      )}
    </div>
  );
};

export default Index;
