
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  name: string;
  personality_type?: string;
  current_mood?: number;
  goals?: string[];
  quest_frequency?: string;
  difficulty_level?: string;
  categories?: string[];
  spark_points: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createProfile = async (userId: string, userEmail: string) => {
    console.log('Creating profile for user:', userId);
    
    const defaultName = userEmail ? userEmail.split('@')[0] : 'New User';
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: defaultName,
          spark_points: 100
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    if (!user) {
      console.log('No user, clearing profile');
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(`Failed to fetch profile: ${error.message}`);
        setProfile(null);
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      } else {
        console.log('No profile found, creating one...');
        // Profile doesn't exist, create it
        const newProfile = await createProfile(user.id, user.email || '');
        if (newProfile) {
          setProfile(newProfile);
        } else {
          setError('Failed to create profile');
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setError('An unexpected error occurred');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      setProfile(data);
      return { data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};
