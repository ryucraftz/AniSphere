export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No access token provided' });
    }

    const accessToken = authHeader.substring(7);

    try {
        // Query Google Drive API for starred images
        const driveResponse = await fetch(
            'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
                q: "starred = true and mimeType contains 'image/' and trashed = false",
                fields: 'files(id, name, mimeType, description, createdTime, modifiedTime, size, thumbnailLink, webContentLink)',
                orderBy: 'modifiedTime desc',
                pageSize: '100',
            }),
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!driveResponse.ok) {
            const errorData = await driveResponse.json();
            console.error('Drive API error:', errorData);
            return res.status(driveResponse.status).json({
                error: 'Failed to fetch Drive files',
                details: errorData
            });
        }

        const data = await driveResponse.json();
        const files = data.files || [];

        // Transform to wallpaper format
        const wallpapers = files.map((file) => {
            const tags = file.description ? file.description.split(',').map((t) => t.trim()) : [];
            return {
                id: file.id,
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                image: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
                downloadUrl: file.webContentLink,
                category: tags[0] || 'Desktop',
                tags: tags.length > 1 ? tags.slice(1) : ['wallpaper'],
                resolution: 'Unknown',
                size: file.size ? `${(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
                uploadDate: file.createdTime,
                source: 'google-drive',
            };
        });

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json(wallpapers);
    } catch (error) {
        console.error('Error in drive-favorites API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
