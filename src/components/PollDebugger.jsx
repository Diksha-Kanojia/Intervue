import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Button,
  Code,
  useClipboard,
  useToast
} from '@chakra-ui/react';

const PollDebugger = () => {
  const [pollData, setPollData] = useState(null);
  const [pollAnswers, setPollAnswers] = useState([]);
  const [pollEvents, setPollEvents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { onCopy, value: clipboardValue, setValue: setClipboardValue } = useClipboard("");
  const toast = useToast();

  useEffect(() => {
    // Load data from localStorage
    try {
      const currentPoll = localStorage.getItem('currentPoll');
      if (currentPoll) {
        setPollData(JSON.parse(currentPoll));
      }

      const answers = localStorage.getItem('poll_answers');
      if (answers) {
        setPollAnswers(JSON.parse(answers) || []);
      }

      const events = localStorage.getItem('socket_events');
      if (events) {
        setPollEvents(JSON.parse(events) || []);
      }
    } catch (error) {
      console.error('Error loading debug data:', error);
    }
  }, [refreshKey]);

  const handleCopyData = (data, label) => {
    setClipboardValue(JSON.stringify(data, null, 2));
    onCopy();
    toast({
      title: `${label} copied to clipboard`,
      status: "success",
      duration: 2000,
    });
  };

  const handleClearResults = () => {
    try {
      // Get the current poll
      const currentPoll = JSON.parse(localStorage.getItem('currentPoll') || '{}');
      
      // Reset the results
      if (currentPoll && currentPoll.results) {
        currentPoll.results = {};
        localStorage.setItem('currentPoll', JSON.stringify(currentPoll));
        
        // Also update in poll history if it exists there
        const pollHistory = JSON.parse(localStorage.getItem('pastPolls') || '[]');
        const pollIndex = pollHistory.findIndex(p => p.id === currentPoll.id);
        if (pollIndex >= 0) {
          pollHistory[pollIndex].results = {};
          localStorage.setItem('pastPolls', JSON.stringify(pollHistory));
        }
      }
      
      // Clear answer data
      localStorage.removeItem('poll_answers');
      localStorage.removeItem('processed_answers');
      
      // Force refresh
      setRefreshKey(prev => prev + 1);
      
      toast({
        title: "Poll results cleared",
        description: "All results data has been reset",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error clearing results:', error);
      toast({
        title: "Error clearing results",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Data refreshed",
      status: "info",
      duration: 1000,
    });
  };

  // Calculate total votes
  const totalVotes = pollData && pollData.results
    ? Object.values(pollData.results).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>Poll Debugger</Heading>
          <Text>View and fix poll data issues</Text>
        </Box>
        
        <Box>
          <Heading size="md" mb={3}>Current Poll</Heading>
          {pollData ? (
            <>
              <Box mb={4}>
                <Text fontWeight="bold">Question: {pollData.question}</Text>
                <Text>Options: {pollData.options?.join(', ')}</Text>
                <Text>Total Votes: {totalVotes}</Text>
                <Text>Results: {JSON.stringify(pollData.results || {})}</Text>
              </Box>
              <Button size="sm" onClick={() => handleCopyData(pollData, 'Poll data')}>
                Copy Full Poll Data
              </Button>
            </>
          ) : (
            <Text>No current poll found in localStorage</Text>
          )}
        </Box>
        
        <Box>
          <Heading size="md" mb={3}>Poll Answers ({pollAnswers.length})</Heading>
          {pollAnswers.length > 0 ? (
            <>
              <Text mb={2}>Number of submitted answers: {pollAnswers.length}</Text>
              <Button size="sm" onClick={() => handleCopyData(pollAnswers, 'Answer data')}>
                Copy Answers Data
              </Button>
            </>
          ) : (
            <Text>No answers found in localStorage</Text>
          )}
        </Box>
        
        <Box>
          <Heading size="md" mb={3}>Socket Events ({pollEvents.length})</Heading>
          {pollEvents.length > 0 ? (
            <Button size="sm" onClick={() => handleCopyData(pollEvents, 'Event data')}>
              Copy Events Data
            </Button>
          ) : (
            <Text>No socket events found in localStorage</Text>
          )}
        </Box>
        
        <Box>
          <Heading size="md" mb={3}>Actions</Heading>
          <Button 
            colorScheme="red" 
            mr={3} 
            onClick={handleClearResults}
          >
            Clear All Results
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleRefresh}
          >
            Refresh Data
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default PollDebugger;
