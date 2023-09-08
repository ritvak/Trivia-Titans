import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Lobby = () => {
    const quizData = [
        { category: "Sports", link: "/category/sports", participants: 20, timeRemaining: "10:00", description: "A quiz about various sports",image: "https://etimg.etb2bimg.com/photo/74881928.cms" },
        { category: "Science", link: "/category/science", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000"},
        { category: "General Knowledge", link: "/category/gk", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://edurev.gumlet.io/AllImages/original/ApplicationImages/CourseImages/bc833f31-6ced-4dde-8c27-993b753d7113_CI.jpg"},
        { category: "History", link: "/category/history", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://suttonhighnews.net/wp-content/uploads/2022/03/Nash-History-Journal.png"},
        { category: "Space", link: "/category/space", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000"},
        { category: "Entertainment", link: "/category/entertainment", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000"},
        { category: "Easy", link: "/difficulty/easy", participants: 20, timeRemaining: "10:00", description: "A quiz about various sports" ,image: "https://media.istockphoto.com/id/187613497/photo/easy-button.jpg?s=612x612&w=0&k=20&c=9bdSfPv3UM6J-19dD2J-gZ9a47PdAsZSWMZikbC1rc8="},
        { category: "Medium", link: "/difficulty/medium", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://editstock.com/cdn/shop/articles/difficulty_medium_8655f3f7-4d38-4d57-a02e-51c86b3b4d5e_1200x1200.jpg?v=1491868815"},
        { category: "Hard", link: "/difficulty/hard", participants: 20, timeRemaining: "10:00", description: "A quiz about various sports" ,image: "https://thumbs.dreamstime.com/b/word-hard-9747926.jpg"},
        { category: "Geography", link: "/category/geography", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000"},
        { category: "Environment", link: "/category/environment", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000"},
        { category: "Music", link: "/category/music", participants: 15, timeRemaining: "20:00", description: "A quiz about scientific facts and discoveries" ,image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=2000"},
    

    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [participantCount, setParticipantCount] = useState(0);

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        // Simulating the increment of participant count when someone visits the lobby.
        // You can replace this with the actual logic of counting logged-in users.
        setParticipantCount(prevCount => prevCount + 1);
    
        // Clean up the effect when the component unmounts
        return () => {
          setParticipantCount(prevCount => prevCount - 1);
        };
      }, []);

    const filteredQuizData = quizData.filter(
        quiz => quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="mt-5">
          <div className="d-flex justify-content-end mb-2">
            <span>Participants: {participantCount}</span>
          </div>
          <Form.Control
            type="text"
            placeholder="Search by category..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-4"
          />
          <div className="d-flex justify-content-around flex-wrap">
            {filteredQuizData.map((quiz, index) => {
              // Extracting categoryquiz and category from the link
              const linkParts = quiz.link.split('/');
              const categoryquiz = linkParts[1]; // Extract 'categoryquiz' from the link
              const category = linkParts[2]; // Extract 'sports', 'science', etc. from the link
    
              return (
                <Card key={index} style={{ width: '18rem' }} className="mb-4">
                  <Card.Img variant="top" src={quiz.image} />
                  <Card.Body>
                    <Card.Title>{quiz.category} Quiz</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Participants: {quiz.participants} | Time remaining: {quiz.timeRemaining}
                    </Card.Subtitle>
                    <Card.Text>{quiz.description}</Card.Text>
                    {/* Sending both categoryquiz and category as parameters with /quiz */}
                    <Link
                      to={`/quiz?categoryKey=${encodeURIComponent(categoryquiz)}&categoryValue=${encodeURIComponent(
                        category
                      )}`}
                    >
                      <Button variant="primary">Start Quiz</Button>
                    </Link>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Container>
      );
    };
    
    export default Lobby;
    