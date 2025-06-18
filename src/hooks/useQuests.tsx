
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

interface UserQuest {
  id: string;
  quest_id: string;
  status: 'assigned' | 'in_progress' | 'completed';
  assigned_at: string;
  completed_at?: string;
  reflection_text?: string;
  reflection_mood?: number;
  insights?: string;
  quest: Quest;
}

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchQuests = async () => {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quests:', error);
      } else {
        // Convert database format to frontend format
        const convertedQuests: Quest[] = (data || []).map(quest => ({
          id: quest.id,
          title: quest.title,
          description: quest.description,
          category: quest.category,
          difficulty: quest.difficulty as 'easy' | 'medium' | 'hard',
          points_reward: quest.points_reward,
          estimated_time: quest.estimated_time,
          instructions: quest.instructions,
          reflection_prompts: quest.reflection_prompts,
          personality_match: quest.personality_match,
          tags: quest.tags
        }));
        setQuests(convertedQuests);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const fetchUserQuests = async () => {
    if (!user) {
      setUserQuests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_quests')
        .select(`
          *,
          quest:quests(*)
        `)
        .eq('user_id', user.id)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching user quests:', error);
      } else {
        // Convert database format to frontend format
        const convertedUserQuests: UserQuest[] = (data || []).map(userQuest => ({
          id: userQuest.id,
          quest_id: userQuest.quest_id,
          status: userQuest.status as 'assigned' | 'in_progress' | 'completed',
          assigned_at: userQuest.assigned_at,
          completed_at: userQuest.completed_at,
          reflection_text: userQuest.reflection_text,
          reflection_mood: userQuest.reflection_mood,
          insights: userQuest.insights,
          quest: {
            id: userQuest.quest.id,
            title: userQuest.quest.title,
            description: userQuest.quest.description,
            category: userQuest.quest.category,
            difficulty: userQuest.quest.difficulty as 'easy' | 'medium' | 'hard',
            points_reward: userQuest.quest.points_reward,
            estimated_time: userQuest.quest.estimated_time,
            instructions: userQuest.quest.instructions,
            reflection_prompts: userQuest.quest.reflection_prompts,
            personality_match: userQuest.quest.personality_match,
            tags: userQuest.quest.tags
          }
        }));
        setUserQuests(convertedUserQuests);
      }
    } catch (error) {
      console.error('Error fetching user quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignQuest = async (questId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_quests')
        .insert({
          user_id: user.id,
          quest_id: questId,
          status: 'assigned'
        })
        .select()
        .single();

      if (error) {
        console.error('Error assigning quest:', error);
        return { error };
      }

      await fetchUserQuests();
      return { data };
    } catch (error) {
      console.error('Error assigning quest:', error);
      return { error };
    }
  };

  const completeQuest = async (userQuestId: string, pointsReward: number) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Update quest status
      const { error: questError } = await supabase
        .from('user_quests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', userQuestId);

      if (questError) {
        console.error('Error completing quest:', questError);
        return { error: questError };
      }

      // Update user's spark points using a direct update query
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('spark_points')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching current points:', fetchError);
        return { error: fetchError };
      }

      const newPoints = (currentProfile?.spark_points || 0) + pointsReward;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ spark_points: newPoints })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating points:', updateError);
        // Continue anyway, quest completion is more important
      }

      await fetchUserQuests();
      return { data: { pointsReward } };
    } catch (error) {
      console.error('Error completing quest:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchQuests();
    fetchUserQuests();
  }, [user]);

  return {
    quests,
    userQuests,
    loading,
    assignQuest,
    completeQuest,
    refetch: () => {
      fetchQuests();
      fetchUserQuests();
    }
  };
};
