
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProfile, Quest } from '@/types';
import { generatePersonalizedQuests } from '@/utils/questEngine';
import { Star, Calendar, Clock, User } from 'lucide-react';

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
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);
  const [currentStreak, setCurrentStreak] = useState(7);

  useEffect(() => {
    const daily = generatePersonalizedQuests(userProfile, 'daily');
    const weekly = generatePersonalizedQuests(userProfile, 'weekly');
    setDailyQuests(daily);
    setWeeklyQuests(weekly);
  }, [userProfile]);

  const totalQuests = userProfile.completedQuests.length;
  const progressToNextLevel = (sparkPoints % 1000) / 10; // Progress bar percentage

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {userProfile.name}! ✨
          </h1>
          <p className="text-gray-600 mt-2">Ready to continue your growth journey?</p>
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
          {/* Daily Quests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Today's Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyQuests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onQuestSelect(quest)}
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
                        <div className="flex items-center gap-1 text-purple-600">
                          <Star className="w-4 h-4" />
                          <span className="font-medium">{quest.pointsReward}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{quest.estimatedTime}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Quests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Weekly Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyQuests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onQuestSelect(quest)}
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
                          <span className="font-medium">{quest.pointsReward}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{quest.estimatedTime}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
