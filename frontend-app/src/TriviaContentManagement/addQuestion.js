import React, { useState } from 'react';
import axios from 'axios';
import '../styles/contentManagement.css';
const AddQuestion = () => {
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://us-central1-tagging-392002.cloudfunctions.net/addQuestion', {
                Question: question,
                Options: [option1, option2, option3, option4],
                correctanswer: correctAnswer,
                category: category,
                difficulty: difficulty,
                tags: tags
            });
            console.log(response.data);
            window.alert("Question added successfully!", response.data);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Question</label>
                    <input type="text" className="form-control" value={question} onChange={e => setQuestion(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Option 1</label>
                    <input type="text" className="form-control" value={option1} onChange={e => setOption1(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Option 2</label>
                    <input type="text" className="form-control" value={option2} onChange={e => setOption2(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Option 3</label>
                    <input type="text" className="form-control" value={option3} onChange={e => setOption3(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Option 4</label>
                    <input type="text" className="form-control" value={option4} onChange={e => setOption4(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Correct Answer</label>
                    <input type="text" className="form-control" value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Difficulty</label>
                    <input type="text" className="form-control" value={difficulty} onChange={e => setDifficulty(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Tags</label>
                    <input type="text" className="form-control" value={tags} onChange={e => setTags(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Question</button>
            </form>
        </div>
    );
}

export default AddQuestion;