import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { fetchComments as apiFetchComments, postComment as apiPostComment, deleteComment as apiDeleteComment } from '@/lib/api';

export interface Comment {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useComments = (noteId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!noteId) return;
    try {
      setLoading(true);
      const { data } = await apiFetchComments(noteId);
      setComments(data as any || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load comments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    const handler = () => fetchComments();
    window.addEventListener('comments-changed', handler);
    return () => window.removeEventListener('comments-changed', handler);
  }, [noteId]);

  const addComment = async (content: string) => {
    if (!noteId) {
      toast({ title: 'Error', description: 'No note selected', variant: 'destructive' });
      return { success: false };
    }
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to comment', variant: 'destructive' });
      return { success: false };
    }
    try {
      const { data } = await apiPostComment(noteId, content);
      toast({ title: 'Comment added' });
      // notify front-end listeners
      window.dispatchEvent(new CustomEvent('comments-changed'));
      return { success: true };
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err.message ?? 'Failed to add comment', variant: 'destructive' });
      return { success: false };
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await apiDeleteComment(id);
      toast({ title: 'Comment deleted' });
      window.dispatchEvent(new CustomEvent('comments-changed'));
      return { success: true };
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to delete comment', variant: 'destructive' });
      return { success: false };
    }
  };

  return { comments, loading, fetchComments, addComment, deleteComment };
};