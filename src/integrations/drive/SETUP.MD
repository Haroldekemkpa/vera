# Drive Integration Setup

Drive uses the existing Google OAuth connection flow.

## Required Google Cloud configuration

- Enable the Google Drive API in the Google Cloud project.
- Configure the OAuth consent screen.
- Add the redirect URI used by the app to the OAuth client.

## Required environment variables

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

## Required OAuth scopes

- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/drive.metadata.readonly`

These scopes are already included in `src/auth/google.ts`.
