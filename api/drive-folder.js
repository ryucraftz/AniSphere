// Google Drive Folder ID from environment variable
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID2 || '';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!GOOGLE_API_KEY) {
        return res.status(500).json({ error: 'GOOGLE_API_KEY environment variable not configured' });
    }

    if (!DRIVE_FOLDER_ID) {
        return res.status(500).json({ error: 'GOOGLE_DRIVE_FOLDER_ID2 environment variable not configured' });
    }

    try {
        // Fetch files from the specific Google Drive folder
        const driveResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?` + new URLSearchParams({
                q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
                fields: 'files(id, name, mimeType, description, createdTime, modifiedTime, size, thumbnailLink, webContentLink, imageMediaMetadata)',
                orderBy: 'name',
                pageSize: '100',
                key: GOOGLE_API_KEY,
            }),
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!driveResponse.ok) {
            const errorData = await driveResponse.json();
            console.error('Drive API error:', errorData);
            return res.status(driveResponse.status).json({
                error: 'Failed to fetch Drive folder',
                details: errorData
            });
        }

        const data = await driveResponse.json();
        const files = data.files || [];

        // Transform to wallpaper format
        const wallpapers = files.map((file) => {
            const tags = file.description ? file.description.split(',').map((t) => t.trim()) : [];

            // Get resolution from image metadata if available
            let resolution = 'Unknown';
            if (file.imageMediaMetadata) {
                const width = file.imageMediaMetadata.width;
                const height = file.imageMediaMetadata.height;
                if (width && height) {
                    resolution = `${width}x${height}`;
                }
            }

            return {
                id: file.id,
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                image: `https://drive.google.com/uc?export=view&id=${file.id}`,
                downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
                category: tags[0] || 'Desktop',
                tags: tags.length > 1 ? tags.slice(1) : ['desktop', 'wallpaper'],
                resolution: resolution,
                size: file.size ? `${(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
                uploadDate: file.createdTime,
                source: 'google-drive-folder',
            };
        });

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json(wallpapers);
    } catch (error) {
        console.error('Error in drive-folder API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
