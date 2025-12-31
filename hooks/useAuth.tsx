import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { Database } from '@/integrations/types';
import { signup, login, getMe, uploadFiles, updateProfile as apiUpdateProfile, getStoredToken, setAuthToken, fetchProfile as fetchProfileApi } from '@/lib/api';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { display_name?: string | null; avatar_file?: File | null; email?: string | null }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user/profile
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    (async () => {
      try {
        const { user, profile } = await getMe();
        setUser(user ?? null);
        setProfile(profile ?? null);
      } catch (err) {
        console.error('Failed to fetch session', err);
        setAuthToken(undefined);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let mounted = true;
    const fetchProfile = async () => {
      try {
        const { data } = await fetchProfileApi(user.id);
        if (mounted) setProfile(data as Profile);
      } catch (err) {
        // ignore
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [user]);

  const signUp = async (email: string, password: string, displayName?: string) => {
    // start fresh
    setAuthToken(undefined);
    setUser(null);
    setProfile(null);

    try {
      const { token, user: u } = await signup({ email, password, displayName });
      setAuthToken(token);
      setUser(u);

      try {
        const { user, profile } = await getMe();
        setUser(user ?? null);
        setProfile(profile ?? null);
      } catch (meErr: any) {
        // couldn't fetch session after signup - clear state and surfaced error
        setAuthToken(undefined);
        setUser(null);
        setProfile(null);
        return { error: new Error(meErr?.message || 'Failed to fetch user session after signup') };
      }

      return { error: null };
    } catch (err: any) {
      // clear state on failure
      setAuthToken(undefined);
      setUser(null);
      setProfile(null);

      const message = err?.message || String(err);
      if (message === 'Failed to fetch' || message.toLowerCase().includes('network')) {
        return { error: new Error(`Network error: could not reach backend at ${(import.meta.env.VITE_API_URL || 'http://localhost:4000')}. ${message}`) };
      }

      return { error: new Error(message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    // start fresh
    setAuthToken(undefined);
    setUser(null);
    setProfile(null);

    try {
      const { token, user: u } = await login({ email, password });
      setAuthToken(token);
      setUser(u);

      try {
        const { user, profile } = await getMe();
        setUser(user ?? null);
        setProfile(profile ?? null);
      } catch (meErr: any) {
        setAuthToken(undefined);
        setUser(null);
        setProfile(null);
        return { error: new Error(meErr?.message || 'Failed to fetch user session after sign in') };
      }

      return { error: null };
    } catch (err: any) {
      setAuthToken(undefined);
      setUser(null);
      setProfile(null);

      const message = err?.message || String(err);
      if (message === 'Failed to fetch' || message.toLowerCase().includes('network')) {
        return { error: new Error(`Network error: could not reach backend at ${(import.meta.env.VITE_API_URL || 'http://localhost:4000')}. ${message}`) };
      }

      return { error: new Error(message) };
    }
  };

  const signInWithGoogle = async () => {
    // start fresh
    setAuthToken(undefined);
    setUser(null);
    setProfile(null);

    try {
      const popupUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/auth/google';
      const width = 500;
      const height = 680;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(popupUrl, 'google_oauth', `width=${width},height=${height},left=${left},top=${top}`);
      if (!popup) {
        setAuthToken(undefined);
        return { error: new Error('Popup blocked. Please allow popups for this site.') };
      }

      return await new Promise<{ error: Error | null }>((resolve) => {
        const expectedOrigin = new URL(import.meta.env.VITE_API_URL || 'http://localhost:4000').origin;

        const cleanup = () => {
          window.removeEventListener('message', messageHandler);
          try { popup.close(); } catch (e) {
            // ignore
          }
          clearInterval(poll);
          clearTimeout(timeout);
        };

        const messageHandler = async (e: MessageEvent) => {
          if (e.origin !== expectedOrigin) return;
          try {
            if (e.data?.type === 'oauth' && e.data?.token) {
              cleanup();
              setAuthToken(e.data.token);
              try {
                const { user, profile } = await getMe();
                setUser(user ?? null);
                setProfile(profile ?? null);
                resolve({ error: null });
              } catch (err: any) {
                setAuthToken(undefined);
                setUser(null);
                setProfile(null);
                resolve({ error: err });
              }
            }
          } catch (err: any) {
            setAuthToken(undefined);
            setUser(null);
            setProfile(null);
            resolve({ error: err });
          }
        };

        window.addEventListener('message', messageHandler);

        const poll = setInterval(async () => {
          try {
            if (popup.closed) {
              cleanup();
              setAuthToken(undefined);
              setUser(null);
              setProfile(null);
              resolve({ error: new Error('Popup closed before completing sign in') });
              return;
            }
            // If the server redirected the popup back to the client origin with token in query
            try {
              const href = popup.location.href;
              const url = new URL(href);
              if (url.origin === window.location.origin) {
                const token = url.searchParams.get('token');
                if (token) {
                  cleanup();
                  setAuthToken(token);
                  const { user, profile } = await getMe();
                  setUser(user ?? null);
                  setProfile(profile ?? null);
                  resolve({ error: null });
                }
              }
            } catch (err) {
              // cross-origin while consent page is open - ignore
            }
          } catch (err: any) {
            cleanup();
            setAuthToken(undefined);
            setUser(null);
            setProfile(null);
            resolve({ error: err });
          }
        }, 500);

        const timeout = setTimeout(() => {
          cleanup();
          setAuthToken(undefined);
          setUser(null);
          setProfile(null);
          resolve({ error: new Error('Sign in timed out') });
        }, 60_000);
      });
    } catch (err: any) {
      setAuthToken(undefined);
      setUser(null);
      setProfile(null);
      return { error: err };
    }
  };

  const signOut = async () => {
    setAuthToken(undefined);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: { display_name?: string | null; avatar_file?: File | null; email?: string | null }) => {
    if (!user) return { error: new Error('Not signed in') };

    try {
      let avatar_url: string | null = profile?.avatar_url || null;

      if (updates.avatar_file) {
        const fd = new FormData();
        fd.append('file', updates.avatar_file);
        const { data } = await uploadFiles(fd);
        // assume first file returned
        avatar_url = data.fileUrl || data.thumbnailUrl || null;
      }

      const { data } = await apiUpdateProfile(user.id, {
        displayName: updates.display_name ?? profile?.display_name,
        avatarUrl: avatar_url,
        email: updates.email ?? profile?.email,
      });

      setProfile(data as Profile);

      return { error: null };
    } catch (err: any) {
      console.error('Failed to update profile', err);
      return { error: err }; 
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
