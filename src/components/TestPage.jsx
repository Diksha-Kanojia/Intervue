import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Heading, Text, VStack, Code, Divider, Flex } from '@chakra-ui/react';
import socket from '../utils/socket.js';
import { createPoll, listenForPolls } from '../utils/pollBridge.js';
import { dumpCommunicationState, clearPollData } from '../utils/debugUtils.js';

const TestPage = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('Disconnected');

  // Add log entry with timestamp
  const log = (message, data = null) => {
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] ${message}${data ? ': ' + JSON.stringify(data) : ''}`;
    setLogs(prev => [...prev, entry]);
    console.log(message, data);
  };

  // Connect to socket
  const handleConnect = () => {
    socket.connect();
    setStatus('Connected');
    log('Connected to socket', { id: socket.id });
  };

  // Disconnect from socket
  const handleDisconnect = () => {
    socket.disconnect();
    setStatus('Disconnected');
    log('Disconnected from socket');
  };

  // Create a test poll
  const handleCreatePoll = () => {
    const pollData = {
      id: `test_poll_${Date.now()}`,
      question: 'Test Question ' + new Date().toLocaleTimeString(),
      options: ['Option 1', 'Option 2', 'Option 3'],
      timer: 60,
      createdAt: new Date().toISOString()
    };
    
    log('Creating test poll', pollData);
    
    // Create poll via pollBridge
    createPoll(pollData);
    
    // Also emit via socket
    socket.emit('poll_created', pollData);
    
    log('Test poll created and broadcast');
  };

  // Clear logs
  const handleClearLogs = () => {
    setLogs([]);
  };

  // Dump communication state
  const handleDumpState = () => {
    log('Dumping communication state');
    dumpCommunicationState();
  };

  // Clear all poll data
  const handleClearPollData = () => {
    clearPollData();
    log('All poll data cleared');
  };

  // Setup event listeners on mount
  useEffect(() => {
    // Connect to socket
    if (!socket.connected) {
      socket.connect();
      setStatus('Connected');
      log('Socket initialized', { id: socket.id });
    }
    
    // Listen for poll events on socket
    socket.on('poll_created', (data) => {
      log('Received poll via socket', data);
    });
    
    // Listen for polls via pollBridge
    const cleanup = listenForPolls((pollData) => {
      log('Received poll via pollBridge', pollData);
    });
    
    // Cleanup on unmount
    return () => {
      socket.off('poll_created');
      cleanup();
      log('Event listeners removed');
    };
  }, []);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">Communication Test Page</Heading>
        <Text>This page helps test real-time communication between tabs and windows</Text>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <Heading as="h2" size="md" mb={4}>Status: <Code>{status}</Code></Heading>
          <Flex gap={4} wrap="wrap">
            <Button colorScheme="blue" onClick={handleConnect}>Connect</Button>
            <Button colorScheme="red" onClick={handleDisconnect}>Disconnect</Button>
            <Button colorScheme="green" onClick={handleCreatePoll}>Create Test Poll</Button>
            <Button colorScheme="purple" onClick={handleDumpState}>Dump State</Button>
            <Button colorScheme="orange" onClick={handleClearPollData}>Clear Poll Data</Button>
            <Button onClick={handleClearLogs}>Clear Logs</Button>
          </Flex>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading as="h2" size="md" mb={4}>Event Logs</Heading>
          <Box 
            p={4} 
            borderWidth={1} 
            borderRadius="md" 
            bg="gray.50" 
            height="400px" 
            overflowY="auto"
            fontFamily="monospace"
            fontSize="sm"
          >
            {logs.length === 0 ? (
              <Text color="gray.500">No logs yet</Text>
            ) : (
              logs.map((log, i) => (
                <Text key={i}>{log}</Text>
              ))
            )}
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default TestPage;
