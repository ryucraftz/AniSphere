// Test endpoint to debug environment variables
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const hasKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const hasFolderId = !!process.env.GOOGLE_DRIVE_FOLDER_ID;
    const keyLength = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length || 0;
    const first100 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(0, 100) || 'NOT SET';
    const last100 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(keyLength - 100) || 'NOT SET';

    let parseError = null;
    let parsed = null;
    try {
        parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
        parseError = error.message;
    }

    res.status(200).json({
        hasKey,
        hasFolderId,
        keyLength,
        first100,
        last100,
        parseError,
        parsedType: parsed ? typeof parsed : 'null',
        parsedKeys: parsed ? Object.keys(parsed) : []
    });
};
