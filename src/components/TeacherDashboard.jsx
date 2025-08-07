import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  useToast
} from '@chakra-ui/react';

const TeacherDashboard = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const toast = useToast();

  const handleCreatePoll = () => {
    // TODO: Implement backend integration
    toast({
      title: "Poll Created",
      description: "Your poll has been created successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" centerContent>
      <Box p={8} mt={10} borderRadius="lg" boxShadow="lg" bg="white" w="100%">
        <VStack spacing={6}>
          <Heading size="lg">Create a Poll</Heading>
          
          <FormControl>
            <FormLabel>Question</FormLabel>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
            />
          </FormControl>

          {options.map((option, index) => (
            <FormControl key={index}>
              <FormLabel>Option {index + 1}</FormLabel>
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                placeholder={`Enter option ${index + 1}`}
              />
            </FormControl>
          ))}

          <Button
            colorScheme="blue"
            onClick={() => setOptions([...options, ''])}
            isDisabled={options.length >= 4}
          >
            Add Option
          </Button>

          <Button
            colorScheme="green"
            size="lg"
            w="100%"
            onClick={handleCreatePoll}
            isDisabled={!question || options.some(opt => !opt)}
          >
            Create Poll
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default TeacherDashboard;
