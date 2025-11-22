import { getImageProxy } from '../driveService.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileId } = req.query;

        if (!fileId) {
            return res.status(400).json({ error: 'File ID is required' });
        }

        const { imageStream, mimeType } = await getImageProxy(fileId);
        res.setHeader('Content-Type', mimeType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        imageStream.pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).send('Failed to load image');
    }
}
