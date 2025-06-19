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
    if (profile) {
      if (!profile.personality_type && currentView !== 'onboarding') {
        console.log('Profile exists but no personality type, showing onboarding');
        setCurrentView('onboarding');
      } else if (profile.personality_type && currentView === 'onboarding') {
        console.log('Profile complete, showing dashboard');
        setCurrentView('dashboard');
      }
    }
  }, [profile, currentView]);

  // Enhanced loading component with particles effect
  const LoadingComponent = ({ message, subtitle }: { message: string; subtitle?: string }) => (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-30"
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: '100%',
          }}
        />
      ))}

      <div className="text-center z-10 backdrop-blur-sm bg-white/10 p-8 rounded-3xl border border-white/20">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative mx-auto mb-6"
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full" />
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
        >
          {message}
        </motion.h2>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-200 text-sm"
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Pulsing dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Show loading while checking auth status
  if (authLoading) {
    return <LoadingComponent message="Initializing your journey..." subtitle="Preparing the magical experience" />;
  }

  // Show auth page if not logged in
  if (!user) {
    return <Auth />;
  }

  // Show loading while profile is being fetched/created
  if (profileLoading) {
    return <LoadingComponent message="Crafting your profile..." subtitle="Setting up your personal growth space" />;
  }

  // Show error if profile failed to load/create
  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-purple-900 to-blue-900" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 backdrop-blur-sm bg-white/10 rounded-3xl border border-red-300/20 relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-200 mb-6">{profileError || 'Failed to load profile'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            Try Again ✨
          </motion.button>
        </motion.div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)"/%3E%3C/svg%3E')] opacity-20" />
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {currentView === 'dashboard' && profile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
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
