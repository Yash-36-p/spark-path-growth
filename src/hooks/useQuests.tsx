
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
        setQuests((data || []) as Quest[]);
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
        setUserQuests((data || []) as UserQuest[]);
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

      // Update user's spark points
      const { error: pointsError } = await supabase.rpc('increment', {
        table_name: 'profiles',
        row_id: user.id,
        column_name: 'spark_points',
        x: pointsReward
      });

      if (pointsError) {
        console.error('Error updating points:', pointsError);
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
