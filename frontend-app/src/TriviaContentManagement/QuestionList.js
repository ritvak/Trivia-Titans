import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Pagination } from 'react-bootstrap';

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(3);
    const navigate = useNavigate();
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://us-central1-tagging-392002.cloudfunctions.net/deleteQuestion?id=${id}`);
            // Filter out the deleted question from our state
            setQuestions(questions.filter((q) => q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('https://us-central1-tagging-392002.cloudfunctions.net/getQuestions');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
        fetchQuestions().then(r => console.log("question list fetched"));
    }, []);

    // Get current questions
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container" style={{width: '100%', maxWidth: 'none'}}>
            {currentQuestions.map((question, qIndex) => {
                console.log(`Rendering question #${qIndex + 1}:`, question);

                return (
                    <Card key={question.id} style={{width: '100%', maxWidth: 'none', marginBottom: '20px'}}>

                        <Card.Body>
                            <Card.Title>Question: {question.Question}</Card.Title>
                            <ul>
                                <li><strong>Tags:</strong> {question.tags}</li>
                                <li><strong>Category:</strong> {question.category}</li>
                                <li><strong>Difficulty Level:</strong> {question.difficulty}</li>
                                <li><strong>Options:</strong>
                                    <ul>
                                        {question.Options && Array.isArray(question.Options)
                                            ? question.Options.map((option, index) => {
                                                console.log(`Rendering option #${index + 1} for question #${qIndex + 1}:`, option);
                                                return <li key={index}>{option}</li>;
                                            })
                                            : <li>No options available</li>
                                        }
                                    </ul>
                                </li>
                                <li><strong>Correct Answer:</strong> {question.correctanswer}</li>
                            </ul>
                            <Link to={`/edit/${question.id}`} className="btn btn-primary">Edit</Link>
                            <Button variant="danger" onClick={() => handleDelete(question.id)}>Delete</Button> 
                        </Card.Body>
                    </Card>
                );
            })}
            <Button 
                onClick={() => navigate('/add')} 
                style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
                Add a question
            </Button>
            <Pagination className="justify-content-center" style={{ marginTop: '20px' }}>
                {Array(Math.ceil(questions.length / questionsPerPage)).fill().map((_, idx) => (
                    <Pagination.Item key={idx} active={idx === currentPage - 1} onClick={() => paginate(idx + 1)}>
                        {idx + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            <Card onClick={() => navigate('/GamePlayData')} style={{ width: '100%', marginTop: '20px' }}>
                <Card.Body>
                    <Card.Title>Gameplay Data and User Engagement</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
}

export default QuestionList;