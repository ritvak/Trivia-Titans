import './App.css';
import QuizComponent from './in-game-experience/QuizComponent';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
import RegistrationPage from './pages/signup';
import FactorQuestions from './pages/signup/questions';
import FactorLoginAnswer from './pages/login/validation';
import ResetPassword from './pages/login/reset_password';
import StatePage from './pages/state';
import Profile from './pages/profile';
import AddQuestion from './TriviaContentManagement/addQuestion';
import EditQuestion from './TriviaContentManagement/editQuestion';
import QuestionList from './TriviaContentManagement/QuestionList';
import Lobby from './Lobby/Lobby';
import TeamManagement from './pages/TeamManagement';
import InviteUser from './pages/InviteUser';
import ManageTeam from './pages/ManageTeam';
import User from './pages/User';
import Leaderboard from './pages/Leaderboard';
import Statistics from './pages/Statistics';
import PlayerLeaderBoard from './in-game-experience/PlayerLeaderBoard';
import GamePlayData from './TriviaContentManagement/GamePlayData';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/login/varification/:link_email' element={<FactorLoginAnswer />} />
        <Route path='/sign-up' element={<RegistrationPage />} />
        <Route path='/forget-password' element={<ResetPassword />} />
        <Route path='/sign-up/factors/:link_email' element={<FactorQuestions />} />
        <Route path='/state/:user_email' element={<StatePage/>} />
        <Route path='/profile/:id' element={<Profile/>} />
        <Route path="/add" element={<AddQuestion />} />
        <Route path="/edit/:id" element={<EditQuestion />} />
        <Route path="/QuestionList" element={<QuestionList />} />
        <Route path="/quiz" element={<QuizComponent />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/InviteUser" element={<InviteUser />} />
        <Route path="/ManageTeam" element={<ManageTeam />} />
        <Route path="/User" element={<User />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />  
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/TeamManagement" element={<TeamManagement />} />
        <Route path="/PlayerLeaderBoard" element={<PlayerLeaderBoard />} />
        <Route path="/GamePlayData" element={<GamePlayData />} />
      </Routes>
    </Router>
  );
}
export default App;
