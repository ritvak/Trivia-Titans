// Importing Firebase Admin SDK, Firebase Cloud Functions and CORS middleware
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

// Importing service account credentials
const serviceAccount = require('./tagging-392002-18e3e0c72aa4.json');

// Initializing Firebase with the service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Creating Firestore instance
const firestore = admin.firestore();

// Cloud Function to get questions from Firestore based on category
exports.getQuestionsByCategory = functions.https.onRequest((req, res) => {
    // Allowing CORS
    cors(req, res, async () => {
        // Checking HTTP method, only allowing GET
        if (req.method !== 'GET') {
            return res.status(405).send({error: 'Invalid request method!'});
        }

        // Getting the category from the query parameters
        const category = req.query.category;

        if (!category) {
            return res.status(400).send({error: 'Missing category query parameter!'});
        }

        try {
            // Fetching all questions from Firestore that match the category
            const collectionRef = firestore.collection('TableQuizQuestions');
            const snapshot = await collectionRef.where("category", "==", category).get();
            const questions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

            return res.status(200).send(questions);

        } catch (error) {
            console.error('Error fetching questions:', error);
            return res.status(500).send({error: 'Something went wrong'});
        }
    });
});
