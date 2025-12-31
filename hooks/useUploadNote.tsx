import { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { uploadFiles, createNote, driveUpload, updateNote } from '@/lib/api';

interface UploadNoteData {
  title: string;
  description?: string;
  subject: string;
  course?: string;
  file: File;
  thumbnail?: File | null;
}

export const useUploadNote = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadNote = async (data: UploadNoteData) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to upload notes',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      setUploading(true);

      // Determine file type and allowed document/presentation types
      const isPdf = data.file.type === 'application/pdf';
      const isImage = data.file.type.startsWith('image/');
      const isDoc = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(data.file.type);
      const isPpt = [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ].includes(data.file.type);

      if (!isPdf && !isImage && !isDoc && !isPpt) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF, DOC, PPT or image file',
          variant: 'destructive',
        });
        return { success: false };
      }

      // The DB currently allows 'pdf' or 'image' in file_type; treat non-image documents as 'pdf' for compatibility
      const fileType = isImage ? 'image' : 'pdf';

      // Upload file (+ thumbnail) to backend
      const fd = new FormData();
      fd.append('file', data.file);
      if (data.thumbnail) fd.append('thumbnail', data.thumbnail);
      const { data: uploadRecord } = await uploadFiles(fd);

      const fileUrl = uploadRecord?.fileUrl || uploadRecord?.file_url || null;
      const thumbnailUrl = uploadRecord?.thumbnailUrl || uploadRecord?.thumbnail_url || null;

      // Create internal google drive id placeholder (will be unique and can be used to reference the item)
      const googleDriveId = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

      // Create note record (first save locally)
      const { data: insertedNotes } = await createNote({
        title: data.title,
        description: data.description || null,
        subject: data.subject,
        course: data.course || null,
        file_url: fileUrl,
        file_type: fileType,
        file_name: data.file.name,
        google_drive_id: googleDriveId,
        thumbnail_url: thumbnailUrl,
      });

      // Note: upload record created earlier already exists; linking to note_id can be added later

      // Notify UI listeners that notes changed so lists refresh immediately
      try { window.dispatchEvent(new CustomEvent('notes-changed')); } catch {}

      // If a Drive Edge Function is deployed, try to copy the file to Drive and update the note with the Drive file id
      try {

        try {
          const fnData = await driveUpload({
            noteId: insertedNotes.data._id ?? insertedNotes.data.id,
            fileUrl: fileUrl,
            fileName: data.file.name,
          });

          if (!fnData || !fnData.google_drive_id) {
            toast({ title: 'Drive integration', description: 'Google Drive integration is not configured; preview in Drive is not available.', variant: 'destructive' });
          } else {
            await updateNote(insertedNotes.data._id ?? insertedNotes.data.id, { google_drive_id: fnData.google_drive_id });
            toast({ title: 'Drive copy created', description: 'A Drive preview was generated for your file.' });
          }
        } catch (err) {
          console.warn('Drive upload failed', err);
          toast({ title: 'Drive integration', description: 'Failed to create Drive preview. Check function logs or configure Drive credentials.', variant: 'destructive' });
        }
      } catch (err) {
        console.warn('Drive upload failed', err);
      }

      toast({
        title: 'Note uploaded!',
        description: 'Your note has been successfully uploaded',
      });

      return { success: true };
    } catch (error) {
      console.error('Error uploading note:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload your note. Please try again.',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setUploading(false);
    }
  };

  return { uploadNote, uploading };
};
