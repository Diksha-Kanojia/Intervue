import {
    Box,
    Button,
    Flex,
    HStack,
    Progress,
    Tag,
    Text,
    VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentPoll, getResults } from '../utils/pollBridge';

const TeacherResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pollData, setPollData] = useState(null);
  const [results, setResults] = useState({});
  const [totalResponses, setTotalResponses] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trigger

  const triggerForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
    console.log('🔄 Force update triggered');
  };

  useEffect(() => {
    // Get poll data from navigation state or localStorage
    let poll = location.state?.pollData;
    if (!poll) {
      poll = getCurrentPoll();
    }

    if (poll) {
      setPollData(poll);
    } else {
      // No poll data, redirect to poll creation
      navigate('/teacher-create-poll');
      return;
    }

    // Get initial results
    updateResults();

    // Listen for result updates - multiple event types for better coverage
    const handleResultsUpdate = (event) => {
      console.log('📊 === RESULTS UPDATE EVENT ===');
      console.log('📊 Event:', event);
      console.log('📊 Event detail:', event.detail);
      
      const updatedResults = event.detail || getResults();
      console.log('📊 Updated results:', updatedResults);
      setResults(updatedResults);
      
      // Calculate total responses with enhanced logging
      const total = Object.values(updatedResults).reduce((sum, option) => sum + (option.count || 0), 0);
      console.log('📊 Total responses calculated:', total);
      console.log('📊 Previous total responses:', totalResponses);
      setTotalResponses(total);
      
      // Force a state update to trigger re-render
      console.log('📊 Forcing results re-render');
      triggerForceUpdate();
    };

    const handleVoteSubmitted = (event) => {
      console.log('🗳️ === VOTE SUBMITTED EVENT ===');
      console.log('🗳️ Event detail:', event.detail);
      
      if (event.detail && event.detail.results) {
        handleResultsUpdate({ detail: event.detail.results });
      } else {
        // Fallback to refresh results immediately
        setTimeout(() => updateResults(), 50); // Small delay to ensure localStorage is updated
      }
    };

    // Listen to custom events - multiple types for better coverage
    window.addEventListener('results-updated', handleResultsUpdate);
    window.addEventListener('vote-submitted', handleVoteSubmitted);
    console.log('👂 TeacherResults: Listening for results-updated and vote-submitted events');

    // Listen to localStorage changes
    const handleStorageChange = (e) => {
      console.log('📦 TeacherResults storage change:', e.key, e.newValue);
      
      if (e.key === 'resultsEvent') {
        try {
          const eventData = JSON.parse(e.newValue);
          console.log('📦 Results event from storage:', eventData);
          if (eventData && eventData.data) {
            handleResultsUpdate({ detail: eventData.data });
          }
        } catch (error) {
          console.error('Error parsing results event:', error);
        }
      }
      
      if (e.key === 'resultsTimestamp') {
        console.log('📊 Results timestamp updated, refreshing...');
        updateResults();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen to BroadcastChannel - listen to both channels
    let resultsChannel, pollChannel;
    if (typeof BroadcastChannel !== 'undefined') {
      // Listen to results-channel
      resultsChannel = new BroadcastChannel('results-channel');
      resultsChannel.onmessage = (event) => {
        console.log('📡 TeacherResults BroadcastChannel (results) message:', event.data);
        if (event.data.type === 'results-updated') {
          // Handle both data and results properties
          const resultData = event.data.results || event.data.data || getResults();
          handleResultsUpdate({ detail: resultData });
        }
      };
      
      // Also listen to poll-channel for results updates
      pollChannel = new BroadcastChannel('poll-channel');
      pollChannel.onmessage = (event) => {
        console.log('📡 TeacherResults BroadcastChannel (poll) message:', event.data);
        if (event.data.type === 'results-updated') {
          // Handle both data and results properties
          const resultData = event.data.results || event.data.data || getResults();
          handleResultsUpdate({ detail: resultData });
        }
      };
      
      console.log('📡 TeacherResults: BroadcastChannel listeners set up (results & poll channels)');
    }

    // Set up aggressive polling for real-time updates
    const interval = setInterval(() => {
      console.log('🔄 TeacherResults: Polling for updates...');
      updateResults();
    }, 200); // Reduced to 200ms for faster updates
    console.log('⏱️ TeacherResults: Polling interval set up (200ms)');

    return () => {
      window.removeEventListener('results-updated', handleResultsUpdate);
      window.removeEventListener('vote-submitted', handleVoteSubmitted);
      window.removeEventListener('storage', handleStorageChange);
      if (resultsChannel) {
        resultsChannel.close();
      }
      if (pollChannel) {
        pollChannel.close();
      }
      clearInterval(interval);
    };
  }, [location.state, navigate]);

  const updateResults = () => {
    console.log('🔄 === UPDATING RESULTS ===');
    const currentResults = getResults();
    console.log('🔄 Current results from getResults():', currentResults);
    
    // Enhanced logging for vote tracking
    const votes = localStorage.getItem('pollVotes');
    if (votes) {
      const voteData = JSON.parse(votes);
      console.log('🔄 Raw votes count:', voteData.length);
      console.log('🔄 Raw votes data:', voteData.map(v => `${v.studentName}: ${v.selectedOption}`));
    }
    
    setResults(currentResults);
    
    const total = Object.values(currentResults).reduce((sum, option) => sum + (option.count || 0), 0);
    console.log('🔄 Total calculated:', total);
    console.log('🔄 Total responses before update:', totalResponses);
    setTotalResponses(total);
    console.log('🔄 Setting total responses to:', total);
    
    // Log percentage calculations for debugging
    Object.entries(currentResults).forEach(([option, data]) => {
      const percentage = total > 0 ? Math.round((data.count / total) * 100) : 0;
      console.log(`🔄 ${option}: ${data.count} votes = ${percentage}%`);
    });
    
    // Force re-render to ensure UI updates
    triggerForceUpdate();
  };

  const getPercentage = (count) => {
    // Use current totalResponses state
    const currentTotal = totalResponses;
    console.log(`📊 Calculating percentage: ${count}/${currentTotal} votes`);
    if (currentTotal === 0) return 0;
    const percentage = Math.round((count / currentTotal) * 100);
    console.log(`📊 Result: ${percentage}%`);
    return percentage;
  };

  const handleNewPoll = () => {
    navigate('/teacher-create-poll');
  };

  const handleViewHistory = () => {
    navigate('/poll-history');
  };

  const handleEndPoll = () => {
    console.log('🛑 === ENDING POLL ===');
    
    // Confirm with teacher
    const confirmEnd = window.confirm('Are you sure you want to end this poll? All students will be redirected to the home page.');
    
    if (!confirmEnd) return;
    
    try {
      // Clear current poll from localStorage
      localStorage.removeItem('currentPoll');
      localStorage.removeItem('pollResults');
      localStorage.removeItem('pollVotes');
      localStorage.setItem('pollEnded', 'true');
      localStorage.setItem('pollEndedTimestamp', Date.now().toString());
      
      // Notify all students via multiple channels
      const endMessage = {
        type: 'poll-ended',
        message: 'Poll has been ended by the teacher. Redirecting to home page...',
        timestamp: Date.now()
      };
      
      // Custom event
      window.dispatchEvent(new CustomEvent('poll-ended', { detail: endMessage }));
      
      // BroadcastChannel
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('poll-channel');
        channel.postMessage(endMessage);
        channel.close();
      }
      
      // Storage event for cross-tab communication
      localStorage.setItem('pollEndedNotification', JSON.stringify(endMessage));
      
      console.log('✅ Poll ended successfully, students notified');
      
      // Redirect teacher to poll creation page
      navigate('/teacher-create-poll');
      
    } catch (error) {
      console.error('❌ Error ending poll:', error);
      alert('Error ending poll. Please try again.');
    }
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
      <Box maxWidth="800px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
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
          
          <HStack spacing={3}>
            <Button
              variant="outline"
              borderColor="#8F64E1"
              color="#8F64E1"
              borderRadius="34px"
              px={6}
              py={2}
              fontSize="14px"
              fontWeight="500"
              onClick={handleViewHistory}
              _hover={{
                bg: "#8F64E1",
                color: "white"
              }}
            >
              View History
            </Button>
            <Button
              variant="outline"
              borderColor="red.500"
              color="red.500"
              borderRadius="34px"
              px={6}
              py={2}
              fontSize="14px"
              fontWeight="500"
              onClick={handleEndPoll}
              _hover={{
                bg: "red.500",
                color: "white"
              }}
            >
              End Poll
            </Button>
            <Button
              bgGradient="linear(to-r, #8F64E1, #5767D0)"
              color="white"
              borderRadius="34px"
              px={6}
              py={2}
              fontSize="14px"
              fontWeight="500"
              onClick={handleNewPoll}
              _hover={{ 
                bgGradient: "linear(to-r, #7B4FD1, #4A5BBD)",
              }}
            >
              New Poll
            </Button>
          </HStack>
        </Flex>

        {/* Results Content */}
        <VStack spacing={8} align="stretch">
          {/* Question */}
          <Box textAlign="center" py={4}>
            <Text 
              fontSize="28px" 
              fontWeight="700" 
              color="#373737"
              mb={3}
              lineHeight="1.3"
            >
              {pollData.question}
            </Text>
            <Text 
              fontSize="18px" 
              color="#666666"
              fontWeight="500"
            >
              {totalResponses} response{totalResponses !== 1 ? 's' : ''} received
            </Text>
          </Box>

          {/* Results */}
          <VStack spacing={6} align="stretch" maxW="500px" mx="auto" w="100%">
            {pollData.options?.map((option, index) => {
              const count = results[option.text]?.count || 0;
              const percentage = getPercentage(count);
              
              return (
                <VStack key={option.id || index} spacing={3} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text 
                      fontSize="18px" 
                      fontWeight="600"
                      color="#373737"
                    >
                      {option.text}
                    </Text>
                    <Text 
                      fontSize="24px" 
                      fontWeight="700"
                      color="#8F64E1"
                    >
                      {percentage}%
                    </Text>
                  </Flex>
                  <Progress 
                    value={percentage} 
                    size="lg"
                    colorScheme="purple"
                    bg="#E2E8F0"
                    borderRadius="16px"
                    h="16px"
                    sx={{
                      '& > div': {
                        background: 'linear-gradient(to right, #8F64E1, #5767D0)',
                      }
                    }}
                  />
                  <Text 
                    fontSize="16px" 
                    color="#666666"
                    fontWeight="500"
                    textAlign="left"
                  >
                    {count} vote{count !== 1 ? 's' : ''}
                  </Text>
                </VStack>
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default TeacherResults;
