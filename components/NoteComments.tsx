import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  noteId: string;
}

const NoteComments = ({ noteId }: Props) => {
  const { comments, loading, addComment, deleteComment } = useComments(noteId);
  const { profile, user } = useAuth();
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await addComment(text.trim());
    if (res.success) setText('');
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      <div className="space-y-3 max-h-40 overflow-y-auto">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-muted-foreground">No comments yet.</div>
        ) : (
          comments.map(c => (
            <div key={c.id} className="text-sm border-b py-2">
              <div className="flex items-center justify-between">
                <div>
                  <b>{c.profiles?.display_name ?? 'Anonymous'}</b>
                  <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                {user && user.id === c.user_id && (
                  <button className="text-xs text-destructive" onClick={() => deleteComment(c.id)}>Delete</button>
                )}
              </div>
              <p className="mt-1">{c.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
};

export default NoteComments;