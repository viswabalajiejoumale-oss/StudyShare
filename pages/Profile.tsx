import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
    setAvatarPreview(profile?.avatar_url ?? null);
  }, [profile]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Avatar must be an image');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const res = await updateProfile({
      display_name: displayName || null,
      avatar_file: avatarFile,
    });
    setSaving(false);

    if (res.error) {
      alert('Failed to save profile: ' + res.error.message);
    } else {
      navigate('/my-uploads');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile…</div>;
  if (!user) return <div className="p-10 text-center">Please sign in to view your profile.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Card */}
      <div className="relative container mx-auto px-4 -mt-24 max-w-4xl">
        <div className="rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
          {/* Avatar Section */}
          <div className="flex flex-col items-center pt-8 pb-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full ring-4 ring-background overflow-hidden bg-primary/10 shadow-lg">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-primary">
                    {(profile?.display_name ?? user.email?.[0] ?? 'U').toUpperCase()}
                  </div>
                )}
              </div>

              <label className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-90">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {profile?.display_name || 'Your Profile'}
            </h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            <div className="grid gap-6 max-w-xl mx-auto">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/my-uploads')}
                >
                  My Uploads
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your profile helps others recognize your shared notes
        </p>
      </div>
    </div>
  );
};

export default Profile;
