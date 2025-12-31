# StudyShare (Frontend)

This repo contains the frontend for a study notes sharing app built with React, Vite and a new MERN backend (Express + MongoDB).

## Development

Run `npm install` then `npm run dev` to start the app.

## Backend features & setup

This project previously used Supabase for auth and storage; it has been migrated to a local MERN backend for development. A placeholder Drive upload endpoint is available at `/api/drive-upload` (see `server/src/routes/drive.ts`) which returns a fake Drive id when not configured. For production you should integrate a managed storage solution (S3, Google Drive, etc.) and secure the endpoints accordingly.

Migrations from the previous Supabase schema are available for reference in the `supabase/migrations` folder.

## Seeding

A seed helper `src/lib/seedDummyNotes.ts` creates up to 15 sample notes for testing previews and downloads. It uses public sample files and does not require extra credentials.

## Next steps / optional

- Implement real Google Drive uploads in `supabase/functions/drive-upload` (service-account or per-user OAuth)
- Add tests and CI to validate RLS policies
- Deploy edge functions and set secrets in Supabase project settings

