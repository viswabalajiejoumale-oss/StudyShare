import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getMe, banUserAdmin, unbanUserAdmin } from '@/lib/api';

const AdminUsers = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);
      try {
        const { user: me } = await getMe();
        setIsAdmin((me?.roles || []).includes('admin'));
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profiles');
      const { data } = await res.json();
      setProfiles(data || []);
    } catch (err) {
      console.error(err);
      setProfiles([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const banUser = async (targetId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return;
    try {
      await banUserAdmin(targetId);
      alert('User banned');
      fetchProfiles();
    } catch (err: any) {
      alert('Failed to ban user: ' + (err.message || err));
    }
  };

  const unbanUser = async (targetId: string) => {
    if (!confirm('Are you sure you want to unban this user?')) return;
    try {
      await unbanUserAdmin(targetId);
      alert('User unbanned');
      fetchProfiles();
    } catch (err: any) {
      alert('Failed to unban user: ' + (err.message || err));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Users</h2>
      {!isAdmin ? (
        <div>Not authorized.</div>
      ) : (
        <div>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <div className="space-y-3">
              {profiles.map(p => (
                <div key={p.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {p.avatar_url ? <img src={p.avatar_url} className="h-full w-full object-cover"/> : <span className="text-sm font-medium text-primary">{(p.display_name||'U').charAt(0)}</span>}
                      </div>
                      <div>
                        <div className="font-medium">{p.display_name}</div>
                        <div className="text-xs text-muted-foreground">{p.email}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" className="mr-2" onClick={() => banUser(p.user_id)}>Ban</Button>
                    <Button variant="ghost" onClick={() => unbanUser(p.user_id)}>Unban</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;