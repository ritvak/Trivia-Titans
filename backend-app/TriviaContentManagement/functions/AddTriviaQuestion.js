const admin = require('firebase-admin');
const functions = require('firebase-functions');

const serviceAccount = require('./tagging-392002-18e3e0c72aa4.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

exports.addQuestion = functions.https.onCall(async (data, context) => {
    const { Question, Options, correctanswer, category, difficulty } = data;

    try {
        const questionData = {
            Question,
            Options,
            correctanswer,
            category,
            difficulty
        };

        const collectionRef = firestore.collection('TableQuizQuestions');
        await collectionRef.add(questionData);

        return { message: "Question added successfully!" };

    } catch (error) {
        console.error('Error adding question:', error);
        throw new functions.https.HttpsError('unknown', error.message);
    }
});
