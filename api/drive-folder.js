// Google Drive Folder ID from environment variable
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID2 || '';
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!SERVICE_ACCOUNT_KEY) {
        return res.status(500).json({ error: 'GOOGLE_SERVICE_ACCOUNT_KEY environment variable not configured' });
    }

    if (!DRIVE_FOLDER_ID) {
        return res.status(500).json({ error: 'GOOGLE_DRIVE_FOLDER_ID2 environment variable not configured' });
    }

    try {
        // Parse service account key
        const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);

        // Get access token using service account
        const jwtToken = await getServiceAccountToken(credentials);

        // Fetch files from the specific Google Drive folder
        const driveResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?` + new URLSearchParams({
                q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
                fields: 'files(id, name, mimeType, description, createdTime, modifiedTime, size, thumbnailLink, webContentLink, imageMediaMetadata)',
                orderBy: 'name',
                pageSize: '100',
            }),
            {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
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
                image: `/api/image/${file.id}`,
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

// Helper function to get access token from service account
async function getServiceAccountToken(credentials) {
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');

    const now = Math.floor(Date.now() / 1000);
    const jwtClaimSet = {
        iss: credentials.client_email,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
    };

    const jwtClaimSetEncoded = Buffer.from(JSON.stringify(jwtClaimSet)).toString('base64url');
    const signatureInput = `${jwtHeader}.${jwtClaimSetEncoded}`;

    // Import crypto for signing (Node.js built-in)
    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    sign.end();

    const signature = sign.sign(credentials.private_key, 'base64url');
    const jwt = `${signatureInput}.${signature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}
