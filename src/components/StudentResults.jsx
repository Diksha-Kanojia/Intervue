import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  HStack,
  Tag,
  Progress,
  Button,
  Flex,
  Icon
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getResults, getCurrentPoll } from '../utils/pollBridge';

const StudentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pollData, setPollData] = useState(null);
  const [results, setResults] = useState({});
  const [totalResponses, setTotalResponses] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    // Get data from navigation state
    const { pollData: poll, selectedOption: selected, studentName: name } = location.state || {};
    
    if (poll) {
      setPollData(poll);
    } else {
      // Try to get from localStorage
      const storedPoll = getCurrentPoll();
      if (storedPoll) {
        setPollData(storedPoll);
      } else {
        navigate('/student-waiting');
        return;
      }
    }

    if (selected) {
      setSelectedOption(selected);
    }

    if (name) {
      setStudentName(name);
    } else {
      const storedName = localStorage.getItem('studentName');
      if (storedName) {
        setStudentName(storedName);
      }
    }

    // Get initial results
    updateResults();

    // Listen for result updates
    const handleResultsUpdate = (event) => {
      const updatedResults = event.detail || getResults();
      setResults(updatedResults);
      
      const total = Object.values(updatedResults).reduce((sum, option) => sum + (option.count || 0), 0);
      setTotalResponses(total);
    };

    window.addEventListener('results-updated', handleResultsUpdate);

    // Listen for new poll deliveries
    const handleNewPoll = (event) => {
      console.log('🆕 New poll event received in results page:', event.detail);
      const newPoll = event.detail;
      const currentPoll = pollData;
      
      // Check if it's a truly new poll
      const isNewPoll = !currentPoll || 
                       newPoll.id !== currentPoll.id || 
                       newPoll.timestamp !== currentPoll.timestamp ||
                       newPoll.question !== currentPoll.question;
      
      if (isNewPoll) {
        console.log('🚀 New poll detected via event, redirecting to question page');
        alert('New question available! Redirecting...');
        navigate('/student-question', { state: { pollData: newPoll } });
      }
    };

    window.addEventListener('poll-delivered', handleNewPoll);

    const handleStorageChange = (e) => {
      // Handle new poll delivery - redirect to new question
      if (e.key === 'currentPoll' && e.newValue) {
        console.log('🆕 New poll detected in results page:', e.newValue);
        try {
          const newPoll = JSON.parse(e.newValue);
          const currentPoll = pollData;
          
          // Check if it's a truly new poll
          const isNewPoll = !currentPoll || 
                           newPoll.id !== currentPoll.id || 
                           newPoll.timestamp !== currentPoll.timestamp ||
                           newPoll.question !== currentPoll.question;
          
          if (isNewPoll) {
            console.log('🚀 New poll detected, redirecting to question page');
            alert('New question available! Redirecting...');
            navigate('/student-question', { state: { pollData: newPoll } });
            return;
          }
        } catch (error) {
          console.error('Error parsing new poll in results:', error);
        }
      }
      
      if (e.key === 'resultsEvent') {
        try {
          const eventData = JSON.parse(e.newValue);
          if (eventData && eventData.data) {
            handleResultsUpdate({ detail: eventData.data });
          }
        } catch (error) {
          console.error('Error parsing results event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    let channel;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('results-channel');
      channel.onmessage = (event) => {
        if (event.data.type === 'results-updated') {
          handleResultsUpdate({ detail: event.data.data });
        }
      };
    }

    const interval = setInterval(updateResults, 1000);

    return () => {
      window.removeEventListener('results-updated', handleResultsUpdate);
      window.removeEventListener('poll-delivered', handleNewPoll);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
      clearInterval(interval);
    };
  }, [location.state, navigate]);

  const updateResults = () => {
    const currentResults = getResults();
    setResults(currentResults);
    
    const total = Object.values(currentResults).reduce((sum, option) => sum + (option.count || 0), 0);
    setTotalResponses(total);
  };

  const getPercentage = (count) => {
    if (totalResponses === 0) return 0;
    return Math.round((count / totalResponses) * 100);
  };

  if (!pollData) {
    return (
      <Box 
        minH="100vh" 
        bg="white"
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Text>Loading results...</Text>
      </Box>
    );
  }

  return (
    <Box 
      minH="100vh" 
      bg="white"
      px={6}
      py={6}
      pt="60px"
    >
      <Box maxWidth="600px" mx="auto">
        {/* Header */}
        <Flex justify="center" mb={8}>
          <Tag 
            bgGradient="linear(to-r, #8F64E1, #5767D0)" 
            color="white" 
            borderRadius="34px" 
            py={2} 
            px={4}
            fontSize="14px"
            fontWeight="500"
          >
            Intervue Poll
          </Tag>
        </Flex>

        {/* Results Content */}
        <VStack spacing={6} align="stretch">
          {/* Question and Status */}
          <Box textAlign="center">
            <Text 
              fontSize="22px" 
              fontWeight="600" 
              color="black"
              mb={3}
            >
              {pollData.question}
            </Text>
            <Text 
              fontSize="14px" 
              color="#666666"
              mt={1}
            >
              {totalResponses} response{totalResponses !== 1 ? 's' : ''} received
            </Text>
          </Box>

          {/* Results */}
          <VStack spacing={4} align="stretch">
            {pollData.options?.map((option, index) => {
              const count = results[option.text]?.count || 0;
              const percentage = getPercentage(count);
              const isSelected = option.text === selectedOption;
              
              return (
                <Box
                  key={option.id || index}
                  border="2px solid"
                  borderColor={isSelected ? "#8F64E1" : "#E2E8F0"}
                  borderRadius="12px"
                  p={4}
                  bg={isSelected ? "#F7F5FF" : "white"}
                  position="relative"
                >
                  
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text 
                      fontSize="16px" 
                      fontWeight={isSelected ? "600" : "500"}
                      color={isSelected ? "#8F64E1" : "black"}
                      maxW="70%"
                    >
                      {option.text}
                    </Text>
                    <HStack spacing={4}>
                      <Text 
                        fontSize="14px" 
                        color="#666666"
                      >
                        {count} vote{count !== 1 ? 's' : ''}
                      </Text>
                      <Text 
                        fontSize="16px" 
                        fontWeight="600"
                        color="#8F64E1"
                        minW="40px"
                        textAlign="right"
                      >
                        {percentage}%
                      </Text>
                    </HStack>
                  </Flex>
                  <Progress 
                    value={percentage} 
                    colorScheme="purple"
                    bg="#F1F1F1"
                    borderRadius="6px"
                    h="8px"
                  />
                </Box>
              );
            })}
          </VStack>

          {/* Student Info and Action */}
          <Box textAlign="center" mt={8}>
            <Text 
              fontSize="14px" 
              color="#666666"
              mb={4}
            >
              Submitted by: {studentName}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default StudentResults;
