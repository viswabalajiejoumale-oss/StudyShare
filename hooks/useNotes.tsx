import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { fetchNotes as apiFetchNotes, likeNote, unlikeNote, rateNote as apiRateNote, getLikes, getRatings } from '@/lib/api';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject: string;
  course: string | null;
  file_url: string;
  file_type: string;
  file_name: string;
  google_drive_id?: string | null;
  thumbnail_url: string | null;
  download_count: number;
  is_approved: boolean;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  likes_count?: number;
  avg_rating?: number;
  user_has_liked?: boolean;
  user_rating?: number;
}

export const useNotes = (subject?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const { data: notesData } = await apiFetchNotes(subject ? { subject } : undefined);

      // If user is logged in, fetch their likes and ratings
      let userLikes: string[] = [];
      let userRatings: Record<string, number> = {};

      if (user) {
        const likesRes = await getLikes({ userId: user.id });
        userLikes = (likesRes.data || []).map((l: any) => l.note) || [];

        const ratingsRes = await getRatings({ userId: user.id });
        userRatings = (ratingsRes.data || []).reduce((acc: any, r: any) => { acc[r.note] = r.rating; return acc; }, {});
      }

      const processedNotes: Note[] = (notesData || []).map((note: any) => ({
        ...note,
        user_has_liked: userLikes.includes(note._id),
        user_rating: userRatings[note._id] || 0,
      }));

      setNotes(processedNotes as Note[]);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [subject, user]);

  // Also refresh when a global notes-changed event is dispatched (e.g., after upload)
  useEffect(() => {
    const handler = () => fetchNotes();
    window.addEventListener('notes-changed', handler);
    return () => window.removeEventListener('notes-changed', handler);
  }, []);


  const toggleLike = async (noteId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like notes',
        variant: 'destructive',
      });
      return;
    }

    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    try {
      if (note.user_has_liked) {
        await unlikeNote(noteId);
      } else {
        await likeNote(noteId);
      }
      // refresh notes
      fetchNotes();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const rateNote = async (noteId: string, rating: number) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to rate notes',
        variant: 'destructive',
      });
      return;
    }

    try {
      await apiRateNote(noteId, rating);
      toast({
        title: 'Rating saved',
        description: `You rated this note ${rating} stars`,
      });
      fetchNotes();
    } catch (error) {
      console.error('Error rating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save rating',
        variant: 'destructive',
      });
    }
  };

  return { notes, loading, fetchNotes, toggleLike, rateNote };
};
