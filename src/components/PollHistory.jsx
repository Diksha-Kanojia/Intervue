import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, Text, Container, VStack, HStack, Divider, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const PollHistory = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Fetch past polls from localStorage
    try {
      // Try to get past polls from localStorage
      const storedPollsStr = localStorage.getItem('pastPolls');
      if (storedPollsStr) {
        const storedPolls = JSON.parse(storedPollsStr);
        setPolls(storedPolls);
      } else {
        // Look for past polls in other storage mechanisms
        const allKeys = Object.keys(localStorage);
        const pollKeys = allKeys.filter(key => key.startsWith('poll_') || key === 'lastPoll' || key === 'currentPoll');
        
        if (pollKeys.length > 0) {
          const retrievedPolls = [];
          
          pollKeys.forEach(key => {
            try {
              const poll = JSON.parse(localStorage.getItem(key));
              if (poll && poll.question) {
                retrievedPolls.push(poll);
              }
            } catch (err) {
              console.error(`Error parsing poll from ${key}:`, err);
            }
          });
          
          // Sort by timestamp if available
          retrievedPolls.sort((a, b) => {
            const timeA = a.timestamp || new Date(a.createdAt || 0).getTime();
            const timeB = b.timestamp || new Date(b.createdAt || 0).getTime();
            return timeB - timeA; // Newest first
          });
          
          setPolls(retrievedPolls);
          
          // Store the retrieved polls for future use
          localStorage.setItem('pastPolls', JSON.stringify(retrievedPolls));
        } else {
          console.log('No past polls found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error loading past polls:', error);
      toast({
        title: "Error loading poll history",
        description: "Could not load past polls",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleViewPoll = (poll) => {
    // Store as current poll
    localStorage.setItem('currentPoll', JSON.stringify(poll));
    
    // Navigate to results view for this poll
    navigate('/teacher-results', { state: { pollData: poll } });
  };

  const handleBackToCreate = () => {
    navigate('/teacher-create-poll');
  };

  return (
    <Container maxW="container.md" py={8}>
      <Flex direction="column" align="center">
        <HStack width="100%" justify="space-between" mb={6}>
          <Heading size="lg" color="#7B61FF">Poll History</Heading>
          <Button 
            colorScheme="purple" 
            variant="outline" 
            onClick={handleBackToCreate}
            leftIcon={<Box as="span">+</Box>}
          >
            Create New Poll
          </Button>
        </HStack>

        {polls.length > 0 ? (
          <VStack spacing={4} align="stretch" width="100%">
            <Text color="gray.600" mb={2}>
              Click on any poll to view detailed results
            </Text>
            {polls.map((poll, index) => {
              // Extract date from createdAt or timestamp
              const pollDate = poll.createdAt 
                ? new Date(poll.createdAt).toLocaleDateString() 
                : poll.timestamp 
                  ? new Date(poll.timestamp).toLocaleDateString()
                  : 'Unknown date';
              
              // Calculate total responses
              const totalResponses = poll.results 
                ? Object.values(poll.results).reduce((sum, count) => sum + count, 0)
                : 0;
              
              return (
                <Box 
                  key={poll.id || index} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  p={4}
                  _hover={{ borderColor: "purple.500", cursor: "pointer", shadow: "md" }}
                  onClick={() => handleViewPoll(poll)}
                  bg="white"
                >
                  <HStack justify="space-between" mb={3}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                      {poll.question}
                    </Text>
                    <Text fontSize="sm" color="gray.500">{pollDate}</Text>
                  </HStack>
                  
                  <Flex justify="space-between" align="center">
                    <HStack spacing={4}>
                      <Text fontSize="sm" color="gray.600">
                        📊 {poll.options?.length || 0} options
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        ⏱️ {poll.timer || 60} seconds
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        👥 {totalResponses} responses
                      </Text>
                    </HStack>
                    <Button 
                      size="xs" 
                      colorScheme="purple" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPoll(poll);
                      }}
                    >
                      View Results
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        ) : (
          <Box 
            width="100%" 
            borderWidth="1px" 
            borderRadius="md" 
            p={8}
            textAlign="center"
            bg="gray.50"
          >
            <Text fontSize="xl" mb={2} color="gray.600">📊</Text>
            <Text fontSize="lg" mb={4} fontWeight="600" color="gray.700">
              No poll history found
            </Text>
            <Text fontSize="md" mb={6} color="gray.500">
              Create your first poll to start collecting responses and see results here
            </Text>
            <Button 
              colorScheme="purple" 
              onClick={handleBackToCreate}
              leftIcon={<Box as="span">+</Box>}
            >
              Create Your First Poll
            </Button>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default PollHistory;
