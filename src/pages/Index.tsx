
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

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'quest' | 'rewards'>('dashboard');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const { toast } = useToast();

  // Show loading while checking auth status
  if (authLoading || profileLoading) {
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

  // Show onboarding if profile is incomplete
  if (profile && !profile.personality_type) {
    setCurrentView('onboarding');
  }

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    await updateProfile({
      name: userProfile.name,
      personality_type: userProfile.personalityType,
      current_mood: userProfile.currentMood,
      goals: userProfile.goals,
      quest_frequency: userProfile.preferences.questFrequency,
      difficulty_level: userProfile.preferences.difficultyLevel,
      categories: userProfile.preferences.categories
    });
    
    setCurrentView('dashboard');
    toast({
      title: "Profile Complete! ✨",
      description: "Your personalized growth journey begins now!",
    });
  };

  const handleQuestSelect = (quest: Quest) => {
    setSelectedQuest(quest);
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
                personalityType: profile.personality_type as any,
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
                personalityType: profile.personality_type as any,
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
