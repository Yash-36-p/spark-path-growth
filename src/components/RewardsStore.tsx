
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reward } from '@/types';
import { ArrowLeft, Star, Crown, Zap, Gift, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RewardsStoreProps {
  sparkPoints: number;
  onPurchase: (cost: number) => void;
  onBack: () => void;
}

const RewardsStore: React.FC<RewardsStoreProps> = ({ sparkPoints, onPurchase, onBack }) => {
  const { toast } = useToast();

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Profile Boost',
      description: 'Increase your profile visibility for 24 hours',
      cost: 250,
      category: 'profile_boost',
      icon: '🚀',
      available: true
    },
    {
      id: '2',
      title: 'Exclusive Conversation Starter',
      description: 'Unlock premium conversation prompts',
      cost: 150,
      category: 'exclusive_content',
      icon: '💬',
      available: true
    },
    {
      id: '3',
      title: 'Super Like Boost',
      description: 'Get 5 extra super likes for the week',
      cost: 300,
      category: 'special_features',
      icon: '⭐',
      available: true
    },
    {
      id: '4',
      title: 'Mystery Growth Quest',
      description: 'Unlock a special personalized quest',
      cost: 400,
      category: 'exclusive_content',
      icon: '🎯',
      available: true
    },
    {
      id: '5',
      title: 'Advanced Compatibility Insights',
      description: 'Get detailed personality match analysis',
      cost: 500,
      category: 'exclusive_content',
      icon: '🧠',
      available: true
    },
    {
      id: '6',
      title: 'VIP Status (7 days)',
      description: 'Unlock all premium features for a week',
      cost: 1000,
      category: 'special_features',
      icon: '👑',
      available: true
    },
    {
      id: '7',
      title: 'Custom Quest Creator',
      description: 'Design your own personalized quests',
      cost: 750,
      category: 'special_features',
      icon: '🎨',
      available: sparkPoints >= 750
    },
    {
      id: '8',
      title: 'Legendary Surprise Box',
      description: 'Unlock exclusive mystery rewards',
      cost: 2000,
      category: 'exclusive_content',
      icon: '🎁',
      available: sparkPoints >= 2000
    }
  ];

  const handlePurchase = (reward: Reward) => {
    if (sparkPoints >= reward.cost) {
      onPurchase(reward.cost);
      toast({
        title: "Reward Unlocked! 🎉",
        description: `You've successfully redeemed "${reward.title}"!`,
      });
    } else {
      toast({
        title: "Insufficient Spark Points",
        description: `You need ${reward.cost - sparkPoints} more points to unlock this reward.`,
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile_boost': return <Zap className="w-5 h-5" />;
      case 'exclusive_content': return <Crown className="w-5 h-5" />;
      case 'special_features': return <Gift className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'profile_boost': return 'bg-yellow-100 text-yellow-800';
      case 'exclusive_content': return 'bg-purple-100 text-purple-800';
      case 'special_features': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Rewards Store 🎁
            </h1>
            <p className="text-gray-600 mb-4">Redeem your Spark Points for amazing rewards!</p>
            
            {/* Points Display */}
            <Card className="inline-block border-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  <span className="text-2xl font-bold">{sparkPoints.toLocaleString()}</span>
                  <span>Spark Points Available</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`h-full transition-all duration-300 ${
                reward.available ? 'hover:shadow-lg border-purple-200' : 'opacity-60 border-gray-200'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    {!reward.available && (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{reward.title}</CardTitle>
                  <Badge className={`w-fit ${getCategoryColor(reward.category)}`}>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(reward.category)}
                      <span className="capitalize">
                        {reward.category.replace('_', ' ')}
                      </span>
                    </div>
                  </Badge>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {reward.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-purple-600">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{reward.cost.toLocaleString()}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(reward)}
                      disabled={!reward.available || sparkPoints < reward.cost}
                      className={`
                        ${reward.available && sparkPoints >= reward.cost
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {!reward.available ? 'Locked' : sparkPoints >= reward.cost ? 'Redeem' : 'Need More'}
                    </Button>
                  </div>
                  
                  {reward.available && sparkPoints < reward.cost && (
                    <p className="text-xs text-gray-500 mt-2">
                      Need {(reward.cost - sparkPoints).toLocaleString()} more points
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">How to Earn More Spark Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-sm">Complete daily quests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-sm">Submit reflections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-sm">Maintain streaks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsStore;
