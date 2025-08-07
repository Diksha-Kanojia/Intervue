import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, HStack, Badge, Divider } from '@chakra-ui/react';

const DebugPanel = () => {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [votes, setVotes] = useState([]);
  const [results, setResults] = useState({});
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to update state from localStorage
    const updateFromStorage = () => {
      try {
        const poll = localStorage.getItem('currentPoll');
        const storedVotes = localStorage.getItem('pollVotes');
        const storedResults = localStorage.getItem('pollResults');

        setCurrentPoll(poll ? JSON.parse(poll) : null);
        setVotes(storedVotes ? JSON.parse(storedVotes) : []);
        setResults(storedResults ? JSON.parse(storedResults) : {});
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    };

    // Function to log events
    const logEvent = (message) => {
      setEvents(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    // Initial load
    updateFromStorage();

    // Listen for poll events
    const handlePollDelivered = (event) => {
      logEvent(`🚀 Poll delivered: ${event.detail.question}`);
      updateFromStorage();
    };

    const handleResultsUpdated = (event) => {
      logEvent(`📊 Results updated`);
      updateFromStorage();
    };

    const handleStorageChange = (event) => {
      if (event.key === 'currentPoll' || event.key === 'pollVotes' || event.key === 'pollResults') {
        logEvent(`📦 Storage changed: ${event.key}`);
        updateFromStorage();
      }
    };

    // Add event listeners
    window.addEventListener('poll-delivered', handlePollDelivered);
    window.addEventListener('results-updated', handleResultsUpdated);
    window.addEventListener('storage', handleStorageChange);

    // Polling for updates
    const interval = setInterval(updateFromStorage, 1000);

    return () => {
      window.removeEventListener('poll-delivered', handlePollDelivered);
      window.removeEventListener('results-updated', handleResultsUpdated);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const clearData = () => {
    localStorage.removeItem('currentPoll');
    localStorage.removeItem('pollVotes');
    localStorage.removeItem('pollResults');
    setCurrentPoll(null);
    setVotes([]);
    setResults({});
    setEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: 🧹 Data cleared`]);
  };

  const createTestPoll = () => {
    const testPoll = {
      id: `debug-poll-${Date.now()}`,
      question: "Debug Test Poll - Which option?",
      options: [
        { text: "Option A" },
        { text: "Option B" },
        { text: "Option C" }
      ],
      duration: 60,
      timestamp: Date.now()
    };

    localStorage.setItem('currentPoll', JSON.stringify(testPoll));
    window.dispatchEvent(new CustomEvent('poll-delivered', { detail: testPoll }));
  };

  const simulateVote = (option) => {
    const vote = {
      studentName: `DebugUser${Date.now()}`,
      selectedOption: option,
      timestamp: Date.now(),
      id: `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    let allVotes = [...votes];
    allVotes.push(vote);

    localStorage.setItem('pollVotes', JSON.stringify(allVotes));

    // Calculate results
    if (currentPoll) {
      const newResults = {};
      currentPoll.options.forEach(opt => {
        newResults[opt.text] = { count: 0, students: [] };
      });

      allVotes.forEach(v => {
        if (newResults[v.selectedOption]) {
          newResults[v.selectedOption].count++;
          newResults[v.selectedOption].students.push(v.studentName);
        }
      });

      localStorage.setItem('pollResults', JSON.stringify(newResults));
      window.dispatchEvent(new CustomEvent('results-updated', { detail: newResults }));
    }
  };

  if (!isVisible) {
    return (
      <Box
        position="fixed"
        top="10px"
        right="10px"
        zIndex={9999}
      >
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => setIsVisible(true)}
        >
          🐛 Debug
        </Button>
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      top="10px"
      right="10px"
      width="400px"
      maxHeight="80vh"
      overflowY="auto"
      bg="white"
      border="2px solid"
      borderColor="red.500"
      borderRadius="md"
      p={4}
      zIndex={9999}
      fontSize="sm"
    >
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="bold" color="red.600">🐛 Debug Panel</Text>
        <Button size="xs" onClick={() => setIsVisible(false)}>✕</Button>
      </HStack>

      <VStack align="stretch" spacing={3}>
        {/* Current Poll */}
        <Box>
          <Text fontWeight="semibold">📊 Current Poll:</Text>
          {currentPoll ? (
            <Box bg="gray.50" p={2} borderRadius="md">
              <Text fontSize="xs">ID: {currentPoll.id}</Text>
              <Text fontSize="xs">Q: {currentPoll.question}</Text>
              <Text fontSize="xs">Options: {currentPoll.options?.map(o => o.text).join(', ')}</Text>
            </Box>
          ) : (
            <Text fontSize="xs" color="gray.500">No poll</Text>
          )}
        </Box>

        {/* Votes */}
        <Box>
          <Text fontWeight="semibold">🗳️ Votes ({votes.length}):</Text>
          <Box bg="gray.50" p={2} borderRadius="md" maxHeight="100px" overflowY="auto">
            {votes.length > 0 ? (
              votes.map((vote, index) => (
                <Text key={index} fontSize="xs">
                  {vote.studentName} → {vote.selectedOption}
                </Text>
              ))
            ) : (
              <Text fontSize="xs" color="gray.500">No votes</Text>
            )}
          </Box>
        </Box>

        {/* Results */}
        <Box>
          <Text fontWeight="semibold">📈 Results:</Text>
          <Box bg="gray.50" p={2} borderRadius="md">
            {Object.keys(results).length > 0 ? (
              Object.entries(results).map(([option, data]) => (
                <HStack key={option} justify="space-between">
                  <Text fontSize="xs">{option}</Text>
                  <Badge colorScheme="blue">{data.count}</Badge>
                </HStack>
              ))
            ) : (
              <Text fontSize="xs" color="gray.500">No results</Text>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Controls */}
        <VStack spacing={2}>
          <HStack spacing={2}>
            <Button size="xs" onClick={createTestPoll}>Create Test Poll</Button>
            <Button size="xs" onClick={clearData} colorScheme="red">Clear Data</Button>
          </HStack>
          
          {currentPoll && (
            <HStack spacing={1}>
              {currentPoll.options?.map((option, index) => (
                <Button
                  key={index}
                  size="xs"
                  colorScheme="green"
                  onClick={() => simulateVote(option.text)}
                >
                  Vote {option.text}
                </Button>
              ))}
            </HStack>
          )}
        </VStack>

        <Divider />

        {/* Events Log */}
        <Box>
          <Text fontWeight="semibold">📝 Events:</Text>
          <Box bg="gray.50" p={2} borderRadius="md" maxHeight="120px" overflowY="auto">
            {events.length > 0 ? (
              events.map((event, index) => (
                <Text key={index} fontSize="xs" fontFamily="mono">
                  {event}
                </Text>
              ))
            ) : (
              <Text fontSize="xs" color="gray.500">No events</Text>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default DebugPanel;
