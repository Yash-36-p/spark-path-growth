
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import QuestDetail from '@/components/QuestDetail';
import ReflectionModal from '@/components/ReflectionModal';
import RewardsStore from '@/components/RewardsStore';
import { UserProfile, Quest } from '@/types';
import { generatePersonalizedQuests } from '@/utils/questEngine';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'quest' | 'rewards'>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [sparkPoints, setSparkPoints] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setCurrentView('dashboard');
      setSparkPoints(parseInt(localStorage.getItem('sparkPoints') || '0'));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setCurrentView('dashboard');
    setSparkPoints(100); // Welcome bonus
    localStorage.setItem('sparkPoints', '100');
    toast({
      title: "Welcome to SparkGrow! ✨",
      description: "You've earned 100 Spark Points as a welcome bonus!",
    });
  };

  const handleQuestSelect = (quest: Quest) => {
    setSelectedQuest(quest);
    setCurrentView('quest');
  };

  const handleQuestComplete = (points: number) => {
    const newPoints = sparkPoints + points;
    setSparkPoints(newPoints);
    localStorage.setItem('sparkPoints', newPoints.toString());
    setCurrentView('dashboard');
    toast({
      title: "Quest Completed! 🎉",
      description: `You earned ${points} Spark Points!`,
    });
  };

  const handleRewardPurchase = (cost: number) => {
    const newPoints = sparkPoints - cost;
    setSparkPoints(newPoints);
    localStorage.setItem('sparkPoints', newPoints.toString());
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

        {currentView === 'dashboard' && userProfile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard
              userProfile={userProfile}
              sparkPoints={sparkPoints}
              onQuestSelect={handleQuestSelect}
              onNavigateToRewards={() => setCurrentView('rewards')}
              onShowReflection={() => setShowReflection(true)}
            />
          </motion.div>
        )}

        {currentView === 'quest' && selectedQuest && userProfile && (
          <motion.div
            key="quest"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <QuestDetail
              quest={selectedQuest}
              userProfile={userProfile}
              onComplete={handleQuestComplete}
              onBack={() => setCurrentView('dashboard')}
            />
          </motion.div>
        )}

        {currentView === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <RewardsStore
              sparkPoints={sparkPoints}
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
