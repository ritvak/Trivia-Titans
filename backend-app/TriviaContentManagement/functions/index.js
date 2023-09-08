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

// Cloud Function to get all questions from Firestore
exports.getQuestions = functions.https.onRequest((req, res) => {
    // Allowing CORS
    cors(req, res, async () => {
        // Checking HTTP method, only allowing GET
        if (req.method !== 'GET') {
            return res.status(405).send({error: 'Invalid request method!'});
        }

        try {
            // Fetching all questions from Firestore
            const collectionRef = firestore.collection('TableQuizQuestions');
            const snapshot = await collectionRef.get();
            const questions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

            return res.status(200).send(questions);

        } catch (error) {
            console.error('Error fetching questions:', error);
            return res.status(500).send({error: 'Something went wrong'});
        }
    });
});

// Cloud Function to get a specific question from Firestore
exports.getQuestion = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).send({error: 'Invalid request method!'});
        }

        // Getting the question ID from the query parameters
        const id = req.query.id;

        if (!id) {
            return res.status(400).send({error: 'Missing id query parameter!'});
        }

        try {
            // Fetching the question from Firestore
            const docRef = firestore.collection('TableQuizQuestions').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).send({error: 'Question not found!'});
            }

            return res.status(200).send({id: doc.id, ...doc.data()});

        } catch (error) {
            console.error('Error fetching question:', error);
            return res.status(500).send({error: 'Something went wrong'});
        }
    });
});

// Cloud Function to update a specific question in Firestore
exports.updateQuestion = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'PUT') {
            return res.status(405).send({error: 'Invalid request method!'});
        }

        // Getting question ID and data from the request body
        const { id, data } = req.body;

        try {
            // Updating the question in Firestore
            const docRef = firestore.collection('TableQuizQuestions').doc(id);
            await docRef.update(data);

            return res.status(200).send({message: "Question updated successfully!"});

        } catch (error) {
            console.error('Error updating question:', error);
            return res.status(500).send({error: 'Something went wrong'});
        }
    });
});

// Cloud Function to add a new question to Firestore
exports.addQuestion = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send({error: 'Invalid request method!'});
        }

        // Getting question data from the request body
        const { Question, Options, correctanswer, category, difficulty } = req.body;

        try {
            // Preparing question data for Firestore
            const questionData = {
                Question,
                Options,
                correctanswer,
                category,
                difficulty
            };

            // Adding the question to Firestore
            const collectionRef = firestore.collection('TableQuizQuestions');
            await collectionRef.add(questionData);

            return res.status(200).send({ message: "Question added successfully!" });

        } catch (error) {
            console.error('Error adding question:', error);
            return res.status(500).send({error: 'Something went wrong'});
        }
    });
});
exports.deleteQuestion = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'DELETE') {
            return res.status(405).send({error: 'Invalid request method!'});
        }

        // Getting the question ID from the query parameters
        const id = req.query.id;

        if (!id) {
            return res.status(400).send({error: 'Missing id query parameter!'});
        }

        try {
            // Deleting the question from Firestore
            const docRef = firestore.collection('TableQuizQuestions').doc(id);
            await docRef.delete();

            return res.status(200).send({message: 'Question deleted successfully!'});

        } catch (error) {
            console.error('Error deleting question:', error);
            return res.status(500).send({error: 'Something went wrong'});
        }
    });
});
