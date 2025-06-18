import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';
import { useQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { Star, Calendar, Clock, User, LogOut } from 'lucide-react';

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
  ).slice(0, 6); // Show max 6 quests

  // Get active user quests (assigned or in progress)
  const activeQuests = userQuests.filter(uq => 
    uq.status === 'assigned' || uq.status === 'in_progress'
  ).slice(0, 3);

  const totalQuests = userQuests.filter(uq => uq.status === 'completed').length;
  const progressToNextLevel = (sparkPoints % 1000) / 10;

  const handleQuestClick = async (quest: Quest) => {
    // Check if quest is already assigned
    const existingUserQuest = userQuests.find(uq => uq.quest_id === quest.id);
    
    if (existingUserQuest) {
      // Quest already assigned, go to quest detail
      onQuestSelect(quest);
    } else {
      // Assign quest to user first
      const result = await assignQuest(quest.id);
      if (!result.error) {
        onQuestSelect(quest);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {userProfile.name}! ✨
            </h1>
            <p className="text-gray-600 mt-2">Ready to continue your growth journey?</p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Spark Points</p>
                  <p className="text-2xl font-bold">{sparkPoints.toLocaleString()}</p>
                </div>
                <Star className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Quests Completed</p>
                  <p className="text-2xl font-bold">{totalQuests}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Current Streak</p>
                  <p className="text-2xl font-bold">{currentStreak} days</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Level Progress</p>
                  <p className="text-2xl font-bold">{Math.floor(sparkPoints / 1000) + 1}</p>
                </div>
                <User className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Level {Math.floor(sparkPoints / 1000) + 1} Progress</h3>
                <span className="text-sm text-gray-600">
                  {sparkPoints % 1000}/1000 points
                </span>
              </div>
              <Progress value={progressToNextLevel} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Quests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Your Active Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-gray-500">Loading your quests...</p>
                ) : activeQuests.length > 0 ? (
                  activeQuests.map((userQuest) => (
                    <motion.div
                      key={userQuest.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onQuestSelect(userQuest.quest)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{userQuest.quest.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{userQuest.quest.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{userQuest.quest.category}</Badge>
                            <Badge variant="outline">{userQuest.quest.difficulty}</Badge>
                            <Badge variant="outline">{userQuest.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-purple-600">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{userQuest.quest.points_reward}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{userQuest.quest.estimated_time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500">No active quests. Choose some new quests below!</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Available Quests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Discover New Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-gray-500">Loading available quests...</p>
                ) : availableQuests.length > 0 ? (
                  availableQuests.map((quest) => (
                    <motion.div
                      key={quest.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleQuestClick(quest)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{quest.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{quest.category}</Badge>
                            <Badge variant="outline">{quest.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-blue-600">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{quest.points_reward}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{quest.estimated_time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500">You've discovered all available quests! More coming soon.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            onClick={onShowReflection}
            variant="outline"
            className="border-purple-200 hover:bg-purple-50"
          >
            Add Reflection 📝
          </Button>
          <Button
            onClick={onNavigateToRewards}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Visit Rewards Store 🎁
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
