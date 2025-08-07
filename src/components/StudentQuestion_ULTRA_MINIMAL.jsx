// ULTRA MINIMAL - No event listeners, no poll end detection
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
    console.log('🔧 === ULTRA MINIMAL STUDENT QUESTION ===');
    
    // NUCLEAR OPTION: Clear ALL poll-related localStorage
    console.log('🚨 NUCLEAR: Clearing ALL poll-related localStorage');
    localStorage.removeItem('pollEnded');
    localStorage.removeItem('pollEndedNotification');
    localStorage.removeItem('pollEndedTimestamp');
    localStorage.removeItem('resultsEvent');
    localStorage.removeItem('pollEvent');
    localStorage.removeItem('resultsTimestamp');
    localStorage.removeItem('pollTimestamp');
    
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
      console.log('📊 Poll loaded:', poll);
      setPollData(poll);
      setTimeLeft(poll.duration || 60);
    } else {
      console.log('❌ No poll found, redirecting to waiting');
      navigate('/student-waiting');
      return;
    }

    console.log('✅ Component initialized - NO EVENT LISTENERS');

    // Continuous cleanup to prevent ANY poll end flags
    const cleanupInterval = setInterval(() => {
      localStorage.removeItem('pollEnded');
      localStorage.removeItem('pollEndedNotification');
    }, 100); // Every 100ms

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  // Simple timer - no dependencies to avoid re-running
  useEffect(() => {
    if (!pollData) return;

    console.log('⏱️ Starting timer');
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pollData?.id]);

  const handleOptionClick = (optionText) => {
    console.log('🎯 Option clicked:', optionText);
    
    if (!pollData?.options?.find(opt => opt.text === optionText)) {
      console.error('❌ Invalid option');
      return;
    }
    
    setSelectedOption(optionText);
    console.log('✅ Selection set to:', optionText);
  };

  const handleSubmit = async () => {
    console.log('🚀 === SUBMIT ===');
    
    if (!selectedOption || !pollData || !studentName) {
      alert('Please select an option before submitting');
      return;
    }
    
    try {
      await submitAnswer(selectedOption, studentName);
      console.log('✅ Submitted successfully');
      
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
        <Text>Loading...</Text>
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

      {/* Ultra Debug */}
      <Box w="100%" maxW="600px" mb={2} p={2} bg="green.50" borderRadius="md" fontSize="sm">
        <Text>🟢 ULTRA MINIMAL MODE</Text>
        <Text>🐛 Selected: "{selectedOption}" | Ready: {selectedOption && pollData && studentName ? 'YES' : 'NO'}</Text>
        <Text>🐛 Poll End Flags: DISABLED | Event Listeners: NONE</Text>
      </Box>

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
                  key={index}
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
          _disabled={{ bg: 'gray.300' }}
        >
          Submit ({selectedOption ? '✓' : '✗'})
        </Button>
      </Flex>
    </Box>
  );
};

export default StudentQuestion;
