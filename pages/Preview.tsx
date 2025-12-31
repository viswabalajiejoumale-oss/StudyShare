import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPreviewUrl, getDownloadUrl } from '@/lib/googleDrive';
import { fetchNote, likeNote, unlikeNote, rateNote, driveUpload, updateNote } from '@/lib/api';
import { Button } from "@/components/ui/button";
import NoteComments from '@/components/NoteComments';
import { useAuth } from '@/hooks/useAuth';

const Preview = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [note, setNote] = useState<any | null>(location.state || null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!note && id) {
      (async () => {
        try {
          setLoading(true);
          const { data } = await fetchNote(id);
          setNote(data || null);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, note]);

  if (loading) return <div className="p-6">Loading preview…</div>;
  if (!note) return <div className="p-6">Note not found.</div>;

  const previewUrl = getPreviewUrl({ google_drive_id: note.google_drive_id, file_url: note.file_url, file_type: note.file_type });
  const downloadUrl = getDownloadUrl({ google_drive_id: note.google_drive_id, file_url: note.file_url });

  const handleLike = async () => {
    if (!user) return alert('Please sign in to like notes');
    try {
      // Toggle like: try removing first, if fails, create
      try {
        await unlikeNote(note._id ?? note.id);
      } catch {
        await likeNote(note._id ?? note.id);
      }
      // refresh note data
      const { data: refreshed } = await fetchNote(note._id ?? note.id);
      setNote(refreshed || note);
    } catch (err) { console.error(err); alert('Failed to update like.'); }
  };

  const handleRate = async (rating: number) => {
    if (!user) return alert('Please sign in to rate');
    try {
      await rateNote(note._id ?? note.id, rating);
      const { data: refreshed } = await fetchNote(note._id ?? note.id);
      setNote(refreshed || note);
    } catch (err) { console.error(err); alert('Failed to save rating.'); }
  };

  const generateDrivePreview = async () => {
    // Only allow generating Drive preview for DB-backed notes (UUID id)
    if (!note.id || !/^[0-9a-fA-F-]{8,}$/.test(note.id)) {
      alert('Cannot generate Drive preview for demo notes. Please upload the file to create a real note.');
      return;
    }

    try {
      const payload = { noteId: note._id ?? note.id, fileUrl: note.file_url, fileName: note.file_name };
      const fnData = await driveUpload(payload);
      if (fnData?.google_drive_id) {
        await updateNote(note._id ?? note.id, { google_drive_id: fnData.google_drive_id });
        const { data: refreshed } = await fetchNote(note._id ?? note.id);
        setNote(refreshed || note);
        alert('Drive preview generated.');
      } else {
        alert('Drive function did not return a Drive id. Check function configuration.');
      }
    } catch (err) { console.error(err); alert('Failed to generate Drive preview.'); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p className="text-sm text-muted-foreground">{note.subject} • {note.file_type}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noreferrer" className="inline-block">
                <Button>Download</Button>
              </a>
            )}
          </div>
        </div>

        <div className="border rounded-lg bg-muted overflow-hidden" style={{ minHeight: 600 }}>
          {previewUrl ? (
            /\.(jpg|jpeg|png|gif)$/.test(previewUrl) ? (
              <img src={previewUrl} alt={note.title} className="w-full h-full object-contain" />
            ) : (
              <iframe src={previewUrl} title="Preview" className="w-full h-[80vh] border-0" />
            )
          ) : (
            <div className="p-6">
              <p className="mb-2">Preview is available only through Google Drive. No Drive preview generated yet.</p>
              <Button onClick={generateDrivePreview}>Generate Drive preview</Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <Button onClick={handleLike}>Like</Button>
          <Button variant="secondary" onClick={() => handleRate(5)}>Rate 5</Button>
        </div>

        <div className="mt-6">
          <NoteComments noteId={note.id} />
        </div>
      </div>
    </div>
  );
};

export default Preview;