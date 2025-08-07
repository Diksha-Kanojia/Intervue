import React from 'react';
import { Box, Button, Flex, Heading, Text, Container, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const PollHistory = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Heading>Poll History</Heading>
        <Text>Poll history feature coming soon...</Text>
        <Button onClick={() => navigate('/')} colorScheme="blue">
          Back to Home
        </Button>
      </VStack>
    </Container>
  );
};

export default PollHistory;