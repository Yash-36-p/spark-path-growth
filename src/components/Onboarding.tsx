
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile } from '@/types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    personalityType: '',
    currentMood: 5,
    goals: [] as string[],
    questFrequency: 'daily',
    difficultyLevel: 'medium',
    categories: [] as string[]
  });

  const personalityTypes = [
    { value: 'adventurous', label: 'Adventurous Explorer', description: 'Love trying new experiences and pushing boundaries' },
    { value: 'introspective', label: 'Thoughtful Reflector', description: 'Enjoy deep thinking and self-examination' },
    { value: 'social', label: 'Social Connector', description: 'Thrive on meaningful relationships and connections' },
    { value: 'creative', label: 'Creative Innovator', description: 'Express yourself through art, writing, or imagination' },
    { value: 'analytical', label: 'Analytical Thinker', description: 'Approach growth through logic and systematic improvement' }
  ];

  const availableGoals = [
    'Improve self-confidence',
    'Develop better communication skills',
    'Build healthier relationships',
    'Reduce anxiety and stress',
    'Discover new passions',
    'Enhance emotional intelligence',
    'Practice mindfulness',
    'Overcome limiting beliefs'
  ];

  const questCategories = [
    'Self-Reflection',
    'Social Skills',
    'Creativity',
    'Physical Wellness',
    'Mental Health',
    'Relationships',
    'Career Growth',
    'Spiritual Growth'
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      personalityType: formData.personalityType as any,
      currentMood: formData.currentMood,
      goals: formData.goals,
      preferences: {
        questFrequency: formData.questFrequency as any,
        difficultyLevel: formData.difficultyLevel as any,
        categories: formData.categories
      },
      completedQuests: [],
      createdAt: new Date()
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to SparkGrow ✨
            </CardTitle>
            <p className="text-gray-600 mt-2">Let's personalize your growth journey</p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      stepNumber <= step ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="name">What's your name?</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>How are you feeling today? (1-10)</Label>
                  <div className="mt-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.currentMood}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentMood: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Low</span>
                      <span className="font-semibold text-purple-600">{formData.currentMood}/10</span>
                      <span>Great</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Label>Which personality type resonates with you most?</Label>
                <RadioGroup
                  value={formData.personalityType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, personalityType: value }))}
                >
                  {personalityTypes.map((type) => (
                    <div key={type.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={type.value} className="font-semibold cursor-pointer">
                          {type.label}
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Label>What are your main growth goals? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <Label htmlFor={goal} className="cursor-pointer text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label>How often would you like new quests?</Label>
                  <RadioGroup
                    value={formData.questFrequency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, questFrequency: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily challenges</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly quests</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible">Flexible schedule</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>What quest categories interest you most?</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {questCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                        <Checkbox
                          id={category}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={category} className="cursor-pointer text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !formData.name) ||
                    (step === 2 && !formData.personalityType) ||
                    (step === 3 && formData.goals.length === 0)
                  }
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={formData.categories.length === 0}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Start My Journey ✨
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;
