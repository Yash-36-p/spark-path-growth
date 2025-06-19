
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';
import { useQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { Star, Calendar, Clock, User, LogOut, Sparkles, Zap, Trophy, Target } from 'lucide-react';

interface Quest {
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

interface DashboardProps {
  userProfile: UserProfile;
  sparkPoints: number;
  onQuestSelect: (quest: Quest) => void;
  onNavigateToRewards: () => void;
  onShowReflection: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  sparkPoints,
  onQuestSelect,
  onNavigateToRewards,
  onShowReflection
}) => {
  const { quests, userQuests, loading, assignQuest } = useQuests();
  const { signOut } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(7);

  // Get available quests (not yet assigned to user)
  const availableQuests = quests.filter(quest => 
    !userQuests.some(uq => uq.quest_id === quest.id)
  ).slice(0, 6);

  // Get active user quests (assigned or in progress)
  const activeQuests = userQuests.filter(uq => 
    uq.status === 'assigned' || uq.status === 'in_progress'
  ).slice(0, 3);

  const totalQuests = userQuests.filter(uq => uq.status === 'completed').length;
  const progressToNextLevel = (sparkPoints % 1000) / 10;

  const handleQuestClick = async (quest: Quest) => {
    const existingUserQuest = userQuests.find(uq => uq.quest_id === quest.id);
    
    if (existingUserQuest) {
      onQuestSelect(quest);
    } else {
      const result = await assignQuest(quest.id);
      if (!result.error) {
        onQuestSelect(quest);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header with Sign Out */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center relative"
        >
          <div className="text-center flex-1">
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Welcome back, {userProfile.name}! ✨
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-purple-200 mt-2 text-lg"
            >
              Ready to continue your growth journey?
            </motion.p>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Spark Points",
              value: sparkPoints.toLocaleString(),
              icon: Star,
              gradient: "from-purple-500 to-purple-600",
              bgPattern: "purple"
            },
            {
              title: "Quests Completed",
              value: totalQuests,
              icon: Trophy,
              gradient: "from-blue-500 to-blue-600",
              bgPattern: "blue"
            },
            {
              title: "Current Streak",
              value: `${currentStreak} days`,
              icon: Zap,
              gradient: "from-green-500 to-green-600",
              bgPattern: "green"
            },
            {
              title: "Level Progress",
              value: Math.floor(sparkPoints / 1000) + 1,
              icon: Target,
              gradient: "from-orange-500 to-orange-600",
              bgPattern: "orange"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={cardHoverVariants}
              whileHover="hover"
              className="relative"
            >
              <Card className={`bg-gradient-to-br ${stat.gradient} text-white border-0 overflow-hidden relative`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-white/10 rounded-full" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                      <motion.p
                        className="text-2xl font-bold mt-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <stat.icon className="w-8 h-8 text-white/80" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Level Progress */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </motion.div>
                  <h3 className="font-semibold text-white text-lg">
                    Level {Math.floor(sparkPoints / 1000) + 1} Progress
                  </h3>
                </div>
                <span className="text-sm text-purple-200">
                  {sparkPoints % 1000}/1000 points
                </span>
              </div>
              <div className="relative">
                <Progress value={progressToNextLevel} className="h-4 bg-white/20" />
                <motion.div
                  className="absolute top-0 left-0 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Quests */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Your Active Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
                    />
                  </div>
                ) : activeQuests.length > 0 ? (
                  activeQuests.map((userQuest, index) => (
                    <motion.div
                      key={userQuest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                      onClick={() => onQuestSelect(userQuest.quest)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-purple-200 transition-colors">
                            {userQuest.quest.title}
                          </h4>
                          <p className="text-sm text-purple-200 mt-1 line-clamp-2">
                            {userQuest.quest.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                              {userQuest.quest.category}
                            </Badge>
                            <Badge variant="outline" className="border-blue-400/30 text-blue-200">
                              {userQuest.quest.difficulty}
                            </Badge>
                            <Badge variant="outline" className="border-green-400/30 text-green-200">
                              {userQuest.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-1 text-purple-300">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{userQuest.quest.points_reward}</span>
                          </div>
                          <p className="text-xs text-purple-200 mt-1">{userQuest.quest.estimated_time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-purple-200"
                  >
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No active quests. Choose some new quests below!</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Available Quests */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Discover New Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                    />
                  </div>
                ) : availableQuests.length > 0 ? (
                  availableQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      className="p-4 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                      onClick={() => handleQuestClick(quest)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-blue-200 transition-colors">
                            {quest.title}
                          </h4>
                          <p className="text-sm text-blue-200 mt-1 line-clamp-2">
                            {quest.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                              {quest.category}
                            </Badge>
                            <Badge variant="outline" className="border-purple-400/30 text-purple-200">
                              {quest.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-1 text-blue-300">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{quest.points_reward}</span>
                          </div>
                          <p className="text-xs text-blue-200 mt-1">{quest.estimated_time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-blue-200"
                  >
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>You've discovered all available quests! More coming soon.</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onShowReflection}
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              Add Reflection 📝
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onNavigateToRewards}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-2"
              >
                🎁
              </motion.span>
              Visit Rewards Store
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
