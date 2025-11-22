// Ultra-safe debug endpoint with comprehensive error handling - ES module syntax
export default async function handler(req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');

        const result = {
            timestamp: new Date().toISOString(),
            hasKey: false,
            hasFolderId: false,
            keyLength: 0,
            first200: 'NOT SET',
            folderId: 'NOT SET',
            errors: []
        };

        try {
            result.hasKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
            result.keyLength = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length || 0;
            result.first200 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(0, 200) || 'NOT SET';
        } catch (e) {
            result.errors.push(`Key error: ${e.message}`);
        }

        try {
            result.hasFolderId = !!process.env.GOOGLE_DRIVE_FOLDER_ID;
            result.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || 'NOT SET';
        } catch (e) {
            result.errors.push(`Folder ID error: ${e.message}`);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(200).json({
            error: 'Function crashed',
            message: error.message,
            stack: error.stack
        });
    }
}
