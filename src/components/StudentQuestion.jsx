// Clean minimal polling system 
import {
    Box,
    Button,
    Circle,
    Flex,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitAnswer } from '../utils/pollBridge';

const StudentQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [pollData, setPollData] = useState(null);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (name) setStudentName(name);

    // Load initial poll
    let poll = location.state?.pollData;
    if (!poll) {
      const storedPoll = localStorage.getItem('currentPoll');
      if (storedPoll) {
        try {
          poll = JSON.parse(storedPoll);
        } catch (error) {
          console.error('Error parsing stored poll:', error);
        }
      }
    }

    if (poll) {
      setPollData(poll);
      setTimeLeft(poll.duration || 60);
    } else {
      navigate('/student-waiting');
      return;
    }

    // Poll listener for new polls from teacher
    const handlePollUpdate = (newPoll) => {
      if (!newPoll) return;
      
      setPollData(currentPollData => {
        const isNewPoll = !currentPollData || 
                         newPoll.id !== currentPollData.id || 
                         newPoll.timestamp !== currentPollData.timestamp ||
                         newPoll.question !== currentPollData.question;
        
        if (isNewPoll) {
          setSelectedOption(''); // Reset selection for new poll
          setTimeLeft(newPoll.duration || 60);
          return newPoll;
        }
        return currentPollData;
      });
    };

    // Listen for new polls
    const handleCustomEvent = (event) => {
      if (event.type === 'poll-delivered') {
        handlePollUpdate(event.detail);
      }
    };

    // BroadcastChannel listener
    let channel;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('poll-channel');
      channel.onmessage = (event) => {
        if (event.data.type === 'poll-delivered' && event.data.data) {
          handlePollUpdate(event.data.data);
        }
      };
    }

    // Polling fallback - check for new polls every 3 seconds
    const pollInterval = setInterval(() => {
      const storedPoll = localStorage.getItem('currentPoll');
      if (storedPoll) {
        try {
          const newPoll = JSON.parse(storedPoll);
          handlePollUpdate(newPoll);
        } catch (error) {
          console.error('Error in polling fallback:', error);
        }
      }
    }, 3000);

    // Add listeners
    window.addEventListener('poll-delivered', handleCustomEvent);

    // Cleanup
    return () => {
      window.removeEventListener('poll-delivered', handleCustomEvent);
      if (channel) channel.close();
      clearInterval(pollInterval);
    };
  }, []);

  // Simple timer - no dependencies to avoid re-running
  useEffect(() => {
    if (!pollData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/student-waiting');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pollData?.id]);

  const handleOptionClick = (optionText) => {
    if (!pollData?.options?.find(opt => opt.text === optionText)) {
      console.error('❌ Invalid option');
      alert('Invalid option selected. Please try again.');
      return;
    }
    
    setSelectedOption(optionText);
  };

  const handleSubmit = async () => {
    if (!selectedOption || !pollData || !studentName) {
      alert('Please select an option before submitting');
      return;
    }
    
    try {
      const result = await submitAnswer(selectedOption, studentName);
      
      if (!result || !result.success) {
        throw new Error('Submission failed');
      }
      
      navigate('/student-results', {
        state: { pollData, selectedOption, studentName },
      });
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert('Error submitting. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!pollData) {
    return (
      <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading question...</Text>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={6}
    >
      {/* Timer */}
      <Flex w="100%" maxW="600px" justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Question 1</Text>
        <Flex align="center" gap={1}>
          <Text fontSize="lg">⏱</Text>
          <Text fontSize="md" fontWeight="semibold" color="red">{formatTime(timeLeft)}</Text>
        </Flex>
      </Flex>

      {/* Question */}
      <Box w="100%" maxW="600px" borderRadius="md" overflow="hidden" boxShadow="md">
        <Box bgGradient="linear(to-r, #373737, #6E6E6E)" color="white" p={4}>
          <Text fontSize="md" fontWeight="medium">{pollData.question}</Text>
        </Box>

        <Box bg="gray.100" p={4}>
          <VStack spacing={3} align="stretch">
            {pollData.options?.map((option, index) => {
              const isSelected = selectedOption === option.text;
              return (
                <Box
                  key={option.id || index}
                  p={3}
                  borderRadius="md"
                  bg="white"
                  border="2px solid"
                  borderColor={isSelected ? 'purple.400' : 'transparent'}
                  cursor="pointer"
                  onClick={() => handleOptionClick(option.text)}
                  _hover={{ borderColor: isSelected ? 'purple.400' : 'gray.300' }}
                >
                  <Flex align="center" gap={3}>
                    <Circle
                      size="20px"
                      bg={isSelected ? 'purple.400' : 'gray.300'}
                      border="2px solid"
                      borderColor={isSelected ? 'purple.400' : 'gray.300'}
                    />
                    <Text fontSize="md" color="black">{option.text}</Text>
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        </Box>
      </Box>

      {/* Submit */}
      <Flex w="100%" maxW="600px" justify="flex-end" mt={6}>
        <Button
          bg="purple.500"
          color="white"
          px={8}
          py={3}
          borderRadius="full"
          fontWeight="semibold"
          onClick={handleSubmit}
          isDisabled={!selectedOption}
          _hover={{ bg: 'purple.600' }}
          _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default StudentQuestion;
