import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  RadioGroup,
  Radio,
  Stack,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';

const StudentDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const toast = useToast();

  // Mock data - this will be replaced with real data from backend
  const pollData = {
    question: "What's your favorite programming language?",
    options: ["JavaScript", "Python", "Java", "C++"]
  };

  const handleSubmitVote = () => {
    // TODO: Implement backend integration
    toast({
      title: "Vote Submitted",
      description: "Your vote has been recorded successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" centerContent>
      <Box p={8} mt={10} borderRadius="lg" boxShadow="lg" bg="white" w="100%">
        <VStack spacing={6}>
          <Heading size="lg">Current Poll</Heading>
          
          <Text fontSize="xl" fontWeight="bold">
            {pollData.question}
          </Text>

          <RadioGroup onChange={setSelectedOption} value={selectedOption}>
            <Stack direction="column" spacing={4}>
              {pollData.options.map((option, index) => (
                <Radio key={index} value={option}>
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>

          <Button
            colorScheme="green"
            size="lg"
            w="100%"
            onClick={handleSubmitVote}
            isDisabled={!selectedOption}
          >
            Submit Vote
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default StudentDashboard;
