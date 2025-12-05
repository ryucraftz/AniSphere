import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// In-memory cache for serverless functions (stateless per invocation)
let cache = null;
let cacheTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get an authenticated Google client.
 * Supports three formats for the service-account key:
 *   1. Raw JSON string (escaped newlines) – typical Vercel env var.
 *   2. Base64-encoded JSON – alternative safe format.
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

    return await auth.getClient();
}

/**
 * Fetch wallpapers from Google Drive.
 * Returns an array of wallpaper objects with metadata.
 */
export async function getWallpapers() {
    // Check cache first
    if (cache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        console.log('Returning cached wallpapers');
        return cache;
    }

    if (!FOLDER_ID) {
        throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is not set');
    }

    try {
        const authClient = await getAuthClient();
        const drive = google.drive({ version: 'v3', auth: authClient });

        const response = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed=false`,
            fields: 'files(id, name, mimeType, description, createdTime, modifiedTime, size, webContentLink)',
            orderBy: 'createdTime desc',
        });

        const files = response.data.files || [];

        const wallpapers = files.map((file) => {
            const tags = file.description ? file.description.split(',').map((t) => t.trim()) : [];
            return {
                id: file.id,
                title: file.name.replace(/\.[^/.]+$/, ''),
                image: `/api/image/${file.id}`,
                category: tags[0] || 'Anime',
                tags: tags.length > 1 ? tags.slice(1) : ['wallpaper'],
                resolution: '1920x1080',
                size: file.size ? `${(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
                uploadDate: file.createdTime,
            };
        });

        // Update cache
        cache = wallpapers;
        cacheTime = Date.now();

        console.log(`Fetched ${wallpapers.length} wallpapers from Drive`);
        return wallpapers;
    } catch (err) {
        console.error('Error fetching wallpapers:', err);
        throw err;
    }
}

/** Proxy a single image file from Drive. */
export async function getImageProxy(fileId) {
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

/** Proxy a thumbnail image from Drive. */
export async function getThumbnailProxy(fileId) {
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // 1. Get the thumbnail link from file metadata
    const file = await drive.files.get({
        fileId,
        fields: 'thumbnailLink, mimeType',
    });

    const thumbnailLink = file.data.thumbnailLink;
    const mimeType = file.data.mimeType;

    if (!thumbnailLink) {
        throw new Error('No thumbnail available for this file');
    }

    // 2. Fetch the content of the thumbnail link
    // Note: The thumbnailLink from Drive often doesn't require auth if the file is public,
    // but if it's restricted, we might need to pass the access token. 
    // However, thumbnailLinks are often unique signed URLs. 
    // If it fails with 403, it often means we can't fetch it easily without a browser session.
    // BUT: The Drive API V3 'thumbnailLink' is designed to be short-lived but accessible.
    // If it fails, we might just have to fetch the full image but scale it? 
    // Actually, let's try fetching it with the same auth headers just in case.

    const token = await authClient.getAccessToken();
    const response = await fetch(thumbnailLink, {
        headers: {
            'Authorization': `Bearer ${token.token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch thumbnail: ${response.statusText}`);
    }

    return {
        imageStream: response.body, // Fetch API returns a ReadableStream
        mimeType: 'image/jpeg', // Thumbnails are usually JPEGs
    };
}
