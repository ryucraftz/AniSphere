# AniSphere - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional, for command-line deployment):
   ```bash
   npm i -g vercel
   ```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash  
   git init
   git add .
   git commit -m "Initial commit - AniSphere"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**:
   In the Vercel dashboard, go to **Settings → Environment Variables** and add:

   **GOOGLE_DRIVE_FOLDER_ID**:
   ```
   <your-folder-id>
   ```

   **GOOGLE_SERVICE_ACCOUNT_KEY**:
   - Open `server/service-account-key.json`
   - Copy the entire JSON content
   - Minify it (remove line breaks): You can use an online JSON minifier
   - Paste the minified JSON as the value
   
   Example (minified):
   ```json
   {"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@...iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add GOOGLE_DRIVE_FOLDER_ID
   vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Important Notes

### Service Account Key Format
The `GOOGLE_SERVICE_ACCOUNT_KEY` must be a **single-line JSON string**. To convert:

**Using PowerShell**:
```powershell
$json = Get-Content server/service-account-key.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
Write-Output $json
```

**Using Node.js**:
```javascript
const fs = require('fs');
const key = JSON.parse(fs.readFileSync('server/service-account-key.json', 'utf8'));
console.log(JSON.stringify(key));
```

### Vercel Serverless Functions
- The backend has been converted to serverless functions in the `/api` directory
- Each function has a 10-second execution timeout on the free tier
- Functions are stateless, so we use in-memory caching (resets on cold starts)

### API Endpoints
Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/wallpapers`
- `https://your-project.vercel.app/api/image/[fileId]`

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `googleapis` is listed in dependencies (not devDependencies)

### Images Not Loading
- Verify `GOOGLE_SERVICE_ACCOUNT_KEY` is set correctly (minified JSON)
- Check that the service account has access to the Google Drive folder
- Ensure `GOOGLE_DRIVE_FOLDER_ID` is correct

### API Errors
- Check Vercel function logs in the dashboard
- Verify environment variables are set for all environments (Production, Preview, Development)

## Post-Deployment

1. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain

2. **Analytics**:
   - Enable Vercel Analytics in Settings → Analytics

3. **Monitor**:
   - Check function logs in the Vercel dashboard
   - Monitor API usage and performance

## Local Development

To test the serverless functions locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run local development server
vercel dev
```

This will start both the frontend and serverless functions locally.
