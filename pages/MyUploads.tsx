import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { getUploads } from '@/lib/api';

const MyUploads = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUploads = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await getUploads();
      setUploads(data || []);
    } catch (err) {
      console.error('Failed to fetch uploads', err);
      setUploads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 h-full flex items-end pb-6">
          <h2 className="text-3xl font-bold text-primary-foreground">
            My Uploads
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 -mt-6 pb-10">
        <div className="rounded-2xl bg-card border border-border shadow-xl p-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading your uploads…
            </div>
          ) : uploads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No uploads yet</p>
              <p className="text-sm text-muted-foreground">
                Use the Upload button to share your study notes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploads.map((u) => (
                <div
                  key={u.id}
                  className="group rounded-xl border border-border bg-background p-5 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {u.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {u.subject} • {u.file_type}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(u.file_url, '_blank')}
                    >
                      Download
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        alert(
                          'Preview is available in Drive only. Generate Drive preview from note page.'
                        )
                      }
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your uploads are visible to other students based on visibility settings
        </p>
      </div>
    </div>
  );
};

export default MyUploads;
