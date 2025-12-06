import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSubscription {
  id: string;
  email: string;
  name: string | null;
  is_paid: boolean;
  subscription_tier: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserSubscription() {
  const [user, setUser] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.email) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { data, error: queryError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (queryError && queryError.code !== 'PGRST116') {
          throw queryError;
        }

        if (data) {
          setUser(data as UserSubscription);
        } else {
          setUser(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription';
        setError(errorMessage);
        console.error('Subscription fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscription();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserSubscription();
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading, error };
}
