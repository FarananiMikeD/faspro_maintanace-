const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK with your project credentials
const serviceAccount = require('./utils/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://faspro24-nodejs.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = bucket;