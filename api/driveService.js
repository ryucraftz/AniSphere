const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// In‑memory cache for serverless functions (stateless per invocation)
let cache = null;
let cacheTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get an authenticated Google client.
const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// In‑memory cache for serverless functions (stateless per invocation)
let cache = null;
let cacheTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get an authenticated Google client.
 * Supports three formats for the service‑account key:
 *   1. Raw JSON string (escaped newlines) – typical Vercel env var.
 *   2. Base64‑encoded JSON – alternative safe format.
 *   3. Direct JSON object (unlikely but handled).
 */
async function getAuthClient() {
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!rawKey) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    let serviceAccount;
    // Try raw JSON parse first (handles escaped \n)
    try {
        serviceAccount = JSON.parse(rawKey);
    } catch (e1) {
        // If that fails, try base64 decode then parse
        try {
            const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
            serviceAccount = JSON.parse(decoded);
        } catch (e2) {
            console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY', e2);
            throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format');
        }
    }

    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: SCOPES,
    });
    return auth.getClient();
}

/** Fetch wallpaper metadata from the configured Drive folder. */
async function getWallpapers() {
    // Serve from cache if still fresh
    if (cache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        console.log('Serving from cache');
        return cache;
    }

    console.log('Fetching wallpapers from Google Drive');
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    try {
        const res = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and (mimeType contains 'image/') and trashed = false`,
            fields: 'files(id, name, mimeType, imageMediaMetadata)',
            pageSize: 100,
        });

        const files = res.data.files || [];
        if (files.length === 0) {
            console.log('No images found in the Drive folder');
            return [];
        }

        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
        const wallpapers = files.map(file => ({
            id: file.id,
            title: file.name.replace(/\.[^/.]+$/, ''),
            image: `${baseUrl}/api/image/${file.id}`,
            thumbnail: `${baseUrl}/api/image/${file.id}`,
            width: file.imageMediaMetadata?.width,
            height: file.imageMediaMetadata?.height,
            tags: ['Anime', 'Drive'],
        }));

        // Update cache
        cache = wallpapers;
        cacheTime = Date.now();
        return wallpapers;
    } catch (err) {
        console.error('Error fetching wallpapers:', err);
        throw err;
    }
}

/** Proxy a single image file from Drive. */
async function getImageProxy(fileId) {
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const metadata = await drive.files.get({
        fileId,
        fields: 'mimeType',
    });

    const response = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
    );

    return {
        imageStream: response.data,
        mimeType: metadata.data.mimeType,
    };
}

module.exports = { getWallpapers, getImageProxy };
