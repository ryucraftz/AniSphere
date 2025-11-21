const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

}

async function getWallpapers() {
    // Check in-memory cache
    if (cache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
        console.log('Serving from cache');
        return cache;
    }

    console.log('Fetching from Google Drive API...');
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    try {
        const res = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and (mimeType contains 'image/') and trashed = false`,
            fields: 'files(id, name, mimeType, imageMediaMetadata)',
            pageSize: 100,
        });

        const files = res.data.files;
        if (!files || files.length === 0) {
            console.log('No image files found in folder.');
            return [];
        }

        console.log(`Found ${files.length} images`);

        // Use relative API URLs for Vercel deployment
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : '';

        const wallpapers = files.map(file => ({
            id: file.id,
            title: file.name.replace(/\.[^/.]+$/, ""),
            image: `${baseUrl}/api/image/${file.id}`,
            thumbnail: `${baseUrl}/api/image/${file.id}`,
            width: file.imageMediaMetadata?.width,
            height: file.imageMediaMetadata?.height,
            tags: ['Anime', 'Drive']
        }));

        // Update cache
        cache = wallpapers;
        cacheTime = Date.now();

        return wallpapers;
    } catch (error) {
        console.error('The API returned an error:', error);
        throw error;
    }
}

async function getImageProxy(fileId) {
    const authClient = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // Get file metadata to determine mime type
    const metadata = await drive.files.get({
        fileId: fileId,
        fields: 'mimeType'
    });

    const response = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
    );

    return {
        imageStream: response.data,
        mimeType: metadata.data.mimeType
    };
}

module.exports = { getWallpapers, getImageProxy };
