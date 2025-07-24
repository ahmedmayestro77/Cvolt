import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  subscription_status: 'free' | 'pro' | null;
}

interface AuthContextType {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetchProfile = useCallback(async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, subscription_status')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile(data as Profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    }
  }, [user]);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, subscription_status')
            .eq('id', session.user.id)
            .single();
          if (profileError) throw profileError;
          setProfile(profileData as Profile);
        } catch (e) {
          console.error('Error fetching initial profile:', e);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !profile) {
      refetchProfile();
    } else if (!user) {
      setProfile(null);
    }
  }, [user, profile, refetchProfile]);

  const value = {
    supabase,
    session,
    user,
    profile,
    loading: loading || (!!user && !profile),
    refetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};