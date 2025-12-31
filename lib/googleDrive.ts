export interface DriveLike {
  google_drive_id?: string | null;
  file_url?: string | null;
  file_type?: string | null;
}

const isDriveId = (id?: string | null) => !!id && /^[\w-]{8,}$/.test(id);

export const getPreviewUrl = ({ google_drive_id }: DriveLike) => {
  // Per requirement: preview must be served from Google Drive only
  if (isDriveId(google_drive_id)) {
    return `https://drive.google.com/file/d/${google_drive_id}/preview`;
  }
  return null; // no preview available if no drive id
};

export const getDownloadUrl = ({ google_drive_id, file_url }: DriveLike) => {
  if (isDriveId(google_drive_id)) {
    return `https://drive.google.com/uc?export=download&id=${google_drive_id}`;
  }
  // allow downloads directly from file_url as a fallback
  return file_url || null;
};