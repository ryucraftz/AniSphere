import { getThumbnailProxy } from '../driveService.js';
import { Readable } from 'stream';

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

        const { imageStream, mimeType } = await getThumbnailProxy(fileId);
        res.setHeader('Content-Type', mimeType || 'image/jpeg');
        // Cache thumbnails aggressively (they don't change often)
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // Convert web ReadableStream to Node.js Readable stream if necessary
        if (imageStream && typeof imageStream.pipe !== 'function') {
            // It's a Web ReadableStream (from fetch)
            const reader = imageStream.getReader();
            const nodeStream = new Readable({
                async read() {
                    const { done, value } = await reader.read();
                    if (done) {
                        this.push(null);
                    } else {
                        this.push(Buffer.from(value));
                    }
                }
            });
            nodeStream.pipe(res);
        } else {
            // It's already a Node stream (unlikely from fetch but possible if changed later)
            imageStream.pipe(res);
        }
    } catch (error) {
        console.error('Error proxying thumbnail:', error);
        res.status(500).send('Failed to load thumbnail');
    }
}
