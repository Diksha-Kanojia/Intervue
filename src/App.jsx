import { ChakraProvider } from '@chakra-ui/react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import PollHistory from './components/PollHistory';
import StudentOnboarding from './components/StudentOnboarding';
import StudentQuestion from './components/StudentQuestion';
import StudentResults from './components/StudentResults';
import StudentWaiting from './components/StudentWaiting';
import TeacherPollPage from './components/TeacherPollPage';
import TeacherResults from './components/TeacherResults';
import theme from './theme';

function App() {
  console.log('App component rendering');
  
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-onboarding" element={<StudentOnboarding />} />
          <Route path="/teacher-create-poll" element={<TeacherPollPage />} />
          <Route path="/student-waiting" element={<StudentWaiting />} />
          <Route path="/student-question" element={<StudentQuestion />} />
          <Route path="/teacher-results" element={<TeacherResults />} />
          <Route path="/student-results" element={<StudentResults />} />
          <Route path="/poll-history" element={<PollHistory />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
