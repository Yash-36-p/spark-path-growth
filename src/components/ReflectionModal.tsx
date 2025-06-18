
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReflectionModalProps {
  onClose: () => void;
  onSubmit: (reflection: any) => void;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [textReflection, setTextReflection] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mood, setMood] = useState(5);
  const [insights, setInsights] = useState('');

  const handleSubmit = () => {
    const reflection = {
      type: activeTab,
      content: activeTab === 'text' ? textReflection : activeTab === 'audio' ? audioFile : photoFile,
      mood,
      insights,
      createdAt: new Date()
    };
    onSubmit(reflection);
  };

  const canSubmit = () => {
    if (activeTab === 'text') return textReflection.trim().length > 0;
    if (activeTab === 'audio') return audioFile !== null;
    if (activeTab === 'photo') return photoFile !== null;
    return false;
  };

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Share Your Reflection ✨
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Mood Slider */}
            <div>
              <Label>How are you feeling right now?</Label>
              <div className="mt-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>😔 Low</span>
                  <span className="font-semibold text-purple-600">{mood}/10</span>
                  <span>😊 Great</span>
                </div>
              </div>
            </div>

            {/* Reflection Type Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">📝 Text</TabsTrigger>
                <TabsTrigger value="photo">📸 Photo</TabsTrigger>
                <TabsTrigger value="audio">🎙️ Audio</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Label htmlFor="text-reflection">Share your thoughts</Label>
                  <Textarea
                    id="text-reflection"
                    value={textReflection}
                    onChange={(e) => setTextReflection(e.target.value)}
                    placeholder="What's on your mind? How are you feeling about your growth journey today?"
                    className="min-h-[150px] mt-2"
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="photo" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Label htmlFor="photo-upload">Upload a meaningful photo</Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  {photoFile && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">✓ Photo selected: {photoFile.name}</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Label htmlFor="audio-upload">Upload an audio reflection</Label>
                  <Input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  {audioFile && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">✓ Audio selected: {audioFile.name}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Record a voice memo or upload an existing audio file to capture your thoughts.
                  </p>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Insights */}
            <div>
              <Label htmlFor="insights">Key insights or learnings (optional)</Label>
              <Textarea
                id="insights"
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                placeholder="What did you learn about yourself today?"
                className="mt-2"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Save Reflection
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default ReflectionModal;
