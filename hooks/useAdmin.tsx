import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { getBanned, banUserAdmin, unbanUserAdmin, deleteNoteAdmin, getMe } from '@/lib/api';

interface BannedUser {
  id: string;
  user_id: string;
  reason: string | null;
  banned_at: string;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkRoles = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsModerator(false);
        setLoading(false);
        return;
      }

      try {
        const { user: me } = await getMe();
        const roleNames = me?.roles || [];
        setIsAdmin(roleNames.includes('admin'));
        setIsModerator(roleNames.includes('moderator') || roleNames.includes('admin'));
      } catch (error) {
        console.error('Error checking roles:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRoles();
  }, [user]);

  const fetchBannedUsers = async () => {
    if (!isAdmin) return;

    try {
      const { data } = await getBanned();
      setBannedUsers(data || []);
    } catch (error) {
      console.error('Error fetching banned users:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchBannedUsers();
    }
  }, [isAdmin]);

  const banUser = async (userId: string, reason?: string) => {
    if (!isAdmin || !user) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can ban users',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      const { data } = await banUserAdmin(userId);

      toast({
        title: 'User banned',
        description: 'The user has been banned from the platform',
      });

      await fetchBannedUsers();
      return { success: true };
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to ban user',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const unbanUser = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can unban users',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      const { data } = await unbanUserAdmin(userId);

      toast({
        title: 'User unbanned',
        description: 'The user has been unbanned',
      });

      await fetchBannedUsers();
      return { success: true };
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to unban user',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!isModerator) {
      toast({
        title: 'Unauthorized',
        description: 'Only moderators can delete notes',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      await deleteNoteAdmin(noteId);

      toast({
        title: 'Note deleted',
        description: 'The note has been removed',
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const flagNote = async (noteId: string, flagged: boolean) => {
    if (!isModerator) return { success: false };

    try {
      await fetch(`/api/notes/${noteId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_flagged: flagged }) });
      return { success: true };
    } catch (error) {
      console.error('Error flagging note:', error);
      return { success: false };
    }
  };

  return {
    isAdmin,
    isModerator,
    loading,
    bannedUsers,
    banUser,
    unbanUser,
    deleteNote,
    flagNote,
  };
};
