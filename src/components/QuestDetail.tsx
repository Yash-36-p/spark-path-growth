
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, Quest } from '@/types';
import { ArrowLeft, Star, Clock, CheckCircle } from 'lucide-react';

interface QuestDetailProps {
  quest: Quest;
  userProfile: UserProfile;
  onComplete: (points: number) => void;
  onBack: () => void;
}

const QuestDetail: React.FC<QuestDetailProps> = ({
  quest,
  userProfile,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNextStep = () => {
    if (currentStep < quest.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleComplete = () => {
    // Save quest completion
    const completedQuests = [...userProfile.completedQuests, quest.id];
    const updatedProfile = { ...userProfile, completedQuests };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Award points
    onComplete(quest.pointsReward);
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
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
          
          <Card className="border-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{quest.title}</h1>
                  <p className="text-purple-100 mb-4">{quest.description}</p>
                  <div className="flex items-center gap-3">
                    <Badge className={`${difficultyColors[quest.difficulty]} border-0`}>
                      {quest.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {quest.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-5 h-5" />
                    <span className="text-xl font-bold">{quest.pointsReward}</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-100">
                    <Clock className="w-4 h-4" />
                    <span>{quest.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {!isCompleted ? (
          <>
            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Progress</h3>
                    <span className="text-sm text-gray-600">
                      Step {currentStep + 1} of {quest.instructions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / quest.instructions.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Instruction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Step {currentStep + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{quest.instructions[currentStep]}</p>
                  
                  {currentStep === quest.instructions.length - 1 && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Reflection Prompt:</h4>
                      <p className="text-gray-700 mb-4">
                        {quest.reflectionPrompts[0] || "How did this exercise make you feel? What insights did you gain?"}
                      </p>
                      <Textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Share your thoughts and insights..."
                        className="min-h-[120px]"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Button
                onClick={handleNextStep}
                disabled={currentStep === quest.instructions.length - 1 && reflection.trim().length < 10}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentStep < quest.instructions.length - 1 ? 'Next Step' : 'Complete Quest'}
              </Button>
              {currentStep === quest.instructions.length - 1 && reflection.trim().length < 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Please share your reflection to complete the quest (minimum 10 characters)
                </p>
              )}
            </motion.div>
          </>
        ) : (
          // Completion Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Quest Completed! 🎉</h2>
                <p className="text-green-100 mb-6">
                  Congratulations on completing "{quest.title}"!
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star className="w-6 h-6" />
                  <span className="text-2xl font-bold">+{quest.pointsReward} Spark Points</span>
                </div>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-50"
                >
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestDetail;
