const admin = require('firebase-admin');
const { applicationDefault } = require(`firebase-admin/app`);

require('dotenv').config();

admin.initializeApp({
    credential: applicationDefault(),
    databaseURL: 'https://ecommerce-be-53ba3.firebaseio.com'
});

const db = admin.firestore();

module.exports = {
    db
};


