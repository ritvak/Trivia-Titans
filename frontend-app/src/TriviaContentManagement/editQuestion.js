import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditQuestion = () => {
    const [question, setQuestion] = useState({
        Question: '',
        Options: ['', '', '', ''],
        correctanswer: '',
        category: '',
        difficulty: '',
        tags: '',
    });
    const [loading, setLoading] = useState(true);

    const { id } = useParams();


    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`https://us-central1-tagging-392002.cloudfunctions.net/getQuestion?id=${id}`);
                setQuestion(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching question:', error);
                setLoading(false);
            }
        }
        fetchQuestion();
    }, [id]);
    if (loading) {
        return <div>Loading...</div>
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put('https://us-central1-tagging-392002.cloudfunctions.net/updateQuestion', {
                id: id,
                data: question
            });
            console.log("Question updated successfully");
            window.alert("Question updated successfully");

        } catch (error) {
            console.error('Error updating question:', error);
        }
    }

    const handleInputChange = (event) => {
        setQuestion({...question, [event.target.name]: event.target.value});
    }

    const handleOptionChange = (event, index) => {
        const newOptions = [...question.Options];
        newOptions[index] = event.target.value;
        setQuestion({...question, Options: newOptions});
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Question</label>
                    <input type="text" name="Question" className="form-control" value={question.Question} onChange={handleInputChange} required />
                </div>
                {question.Options.map((option, index) => (
                    <div className="form-group" key={index}>
                        <label>Option {index + 1}</label>
                        <input type="text" name={`Option${index}`} className="form-control" value={option} onChange={(e) => handleOptionChange(e, index)} required />
                    </div>
                ))}
                <div className="form-group">
                    <label>Correct Answer</label>
                    <input type="text" name="correctanswer" className="form-control" value={question.correctanswer} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" name="category" className="form-control" value={question.category} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Difficulty</label>
                    <input type="text" name="difficulty" className="form-control" value={question.difficulty} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Tags</label>
                    <input type="text" name="tags" className="form-control" value={question.tags} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Update Question</button>
            </form>
        </div>
    );
};

export default EditQuestion;