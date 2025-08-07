import {
    Box,
    Circle,
    Flex,
    Tag,
    Text,
    VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket';

const StudentWaiting = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    // Get student name from localStorage
    const name = localStorage.getItem('studentName');
    if (name) {
      setStudentName(name);
    }

    // Listen for poll creation
    const handlePollCreated = (pollData) => {
      console.log('Poll received in StudentWaiting:', pollData);
      navigate('/student-question', { state: { pollData } });
    };

    console.log('StudentWaiting: Setting up poll listener');
    socket.on('poll-created', handlePollCreated);

    // Also listen for direct storage events
    const handleStorageChange = (e) => {
      if (e.key === 'currentPoll' && e.newValue) {
        console.log('Poll detected via storage event:', e.newValue);
        const pollData = JSON.parse(e.newValue);
        navigate('/student-question', { state: { pollData } });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      console.log('StudentWaiting: Cleaning up listeners');
      socket.off('poll-created', handlePollCreated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return (
    <Box 
      minH="100vh" 
      bg="white"
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center"
      px={4}
    >
      {/* Intervue Poll Tag */}
      <Tag 
        bgGradient="linear(to-r, #8F64E1, #5767D0)" 
        color="white" 
        borderRadius="34px" 
        py={2} 
        px={4}
        fontSize="16px"
        fontWeight="500"
        mb={8}
      >
        Intervue Poll
      </Tag>

      {/* Main Content */}
      <VStack spacing={6} textAlign="center" maxWidth="400px">
        <Text 
          fontSize="28px" 
          fontWeight="600" 
          color="black"
        >
          Welcome, {studentName}!
        </Text>

        <Text 
          fontSize="18px" 
          color="#666666"
          lineHeight="1.5"
        >
          You're all set! Waiting for your teacher to start the poll...
        </Text>

        {/* Better Loader */}
        <Box position="relative" mt={8}>
          <Flex align="center" justify="center" direction="column" gap={4}>
            {/* Rotating Circle Loader */}
            <Box position="relative">
              <Circle 
                size="40px" 
                //border="10px solid #E2E8F0"
                borderTop="10px solid"
                borderTopColor="#8F64E1"
                borderRadius="100%"
                animation="spin 2s linear infinite"
              />
            </Box>
            
            {/* Status Text - Updated color from color panel */}
            <Text 
              fontSize="14px" 
              color="#8F64E1"
              fontWeight="500"
            >
              Connected and ready
            </Text>
          </Flex>
        </Box>
      </VStack>

      {/* CSS for spin animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default StudentWaiting;
