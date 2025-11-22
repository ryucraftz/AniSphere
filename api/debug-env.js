// Simple debug endpoint to see raw environment variable
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const hasKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const hasFolderId = !!process.env.GOOGLE_DRIVE_FOLDER_ID;
    const keyLength = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length || 0;
    const first200 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(0, 200) || 'NOT SET';
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || 'NOT SET';

    res.status(200).json({
        hasKey,
        hasFolderId,
        keyLength,
        first200,
        folderId,
        note: 'Check first200 to see what the key starts with'
    });
};
