const crypto = require('crypto');

// Generate a secure random string
const generateSecret = () => {
    // Generate 64 random bytes and convert to hex string
    const secret = crypto.randomBytes(64).toString('hex');
    console.log('\nGenerated JWT Secret:');
    console.log('---------------------');
    console.log(secret);
    console.log('\nCopy this value to your .env file as JWT_SECRET');
};

generateSecret(); 