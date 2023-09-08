// Importing Google Cloud Natural Language and Firebase Admin SDK
const language = require('@google-cloud/language');
const admin = require('firebase-admin');

// Importing service account credentials
const serviceAccount = require('./tagging-392002-18e3e0c72aa4.json');

// Initializing Firebase with the service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Creating Firestore instance
const firestore = admin.firestore();
// Creating LanguageServiceClient instance
const client = new language.LanguageServiceClient();

// Exporting function to tag all questions in Firestore
exports.tagQuizQuestions = async (event, context) => {
    try {
        // Getting reference to the Firestore collection where questions are stored
        const questionsRef = firestore.collection('TableQuizQuestions');
        // Fetching all documents (questions) in the collection
        const questionsSnapshot = await questionsRef.get();

        // Mapping over each question and tagging it
        const taggingPromises = questionsSnapshot.docs.map(async (questionDoc) => {
            const questionId = questionDoc.id;
            const questionText = questionDoc.data().Question;

            // Calling the function to analyze and tag the question
            await index(questionText, questionId);
        });

        // Waiting for all questions to be tagged
        await Promise.all(taggingPromises);

        console.log('Question tagging completed');
    } catch (error) {
        console.error('Error tagging questions:', error);
        throw error;
    }
};

// Function to analyze and tag a question
const index = async (question, questionId) => {
    // Getting reference to the specific question in Firestore
    const questionRef = firestore.collection('TableQuizQuestions').doc(questionId);

    try {
        // Preparing document for Natural Language API
        const document = {
            content: question,
            type: 'PLAIN_TEXT',
        };
        // Analyzing syntax of the question
        const [tokenResponse] = await client.analyzeSyntax({ document });
        const tokenCount = tokenResponse.tokens.length;

        // If the question has enough tokens, classify the text
        if (tokenCount >= 3) {
            const [response] = await client.classifyText({ document });

            const category = response.categories[0].name;
            // Formatting the category for Firestore
            const categoryNames = category.split('/').slice(1).join(', ');

            // Updating the question in Firestore with the category
            await questionRef.update({ category: categoryNames });

            console.log(`Question with ID ${questionId} tagged successfully`);
        } else {
            console.log(`Question with ID ${questionId} has too few tokens to process.`);
        }
    } catch (error) {
        console.error(`Error tagging question with ID ${questionId}:`, error);
        throw error;
    }
};

/*
// Calling the function to tag all questions
tagQuizQuestions()
.then(() => {
    console.log('Tagging process completed successfully');
})
.catch((error) => {
    console.error('Error in tagging process:', error);
});
*/
