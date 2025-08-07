import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    Tag,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliverPoll } from '../utils/pollBridge';

const TeacherPollPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { id: 1, text: 'Option 1', isCorrect: false },
    { id: 2, text: 'Option 2', isCorrect: false }
  ]);
  const [duration, setDuration] = useState('60');

  const handleAddOption = () => {
    const newOption = {
      id: options.length + 1,
      text: `Option ${options.length + 1}`,
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (id, text) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, text } : opt
    ));
  };

  const handleCorrectAnswerChange = (id) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, isCorrect: true } : { ...opt, isCorrect: false }
    ));
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const pollData = {
      id: `poll-${Date.now()}`, // Add unique ID
      question: question.trim(),
      options: options.filter(opt => opt.text.trim()),
      duration: parseInt(duration),
      timestamp: Date.now()
    };

    console.log('🎓 === TEACHER CREATING POLL ===');
    console.log('🎓 Poll data:', pollData);

    // Deliver poll to all students
    await deliverPoll(pollData);
    
    // Navigate to results page
    navigate('/teacher-results', { state: { pollData } });
  };

  const handleViewHistory = () => {
    navigate('/poll-history');
  };

  return (
    <Box 
      minH="100vh" 
      bg="white"
      p={6}
      pt={8}
    >
      <Box maxWidth="1000px" mx="auto" px={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Tag 
            bgGradient="linear(to-r, #8F64E1, #5767D0)" 
            color="white" 
            borderRadius="34px" 
            py={2} 
            px={5}
            fontSize="14px"
            fontWeight="500"
          >
            Intervue Poll
          </Tag>
          
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
            View Poll History
          </Button>
        </Flex>

        {/* Main Content */}
        <VStack spacing={4} align="stretch">
          {/* Title */}
          <Box>
            <Heading 
              as="h1" 
              fontSize="28px"
              color="black"
              fontWeight="600"
              mb={2}
            >
              Let's Get Started
            </Heading>
            <Text 
              fontSize="14px" 
              color="#666666"
              mb={1}
            >
              you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
            </Text>
          </Box>

          {/* Question Input */}
          <Box>
            <Text fontSize="16px" fontWeight="500" mb={2}>Enter your question</Text>
            <Box position="relative">
              <Textarea
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                bg="#F8F9FA"
                border="1px solid #E2E8F0"
                borderRadius="8px"
                p={4}
                fontSize="14px"
                minH="80px"
                resize="none"
                _focus={{
                  borderColor: "#8F64E1",
                  boxShadow: "0 0 0 1px #8F64E1"
                }}
              />
              <Text 
                position="absolute" 
                bottom="8px" 
                right="12px" 
                fontSize="12px" 
                color="#999"
              >
                {question.length}/100
              </Text>
            </Box>
            
            {/* Duration */}
            <Flex justify="flex-end" mt={3}>
              <Select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                width="120px"
                size="sm"
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="6px"
              >
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90">90 seconds</option>
                <option value="120">2 minutes</option>
              </Select>
            </Flex>
          </Box>

          {/* Options */}
          <Box>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="16px" fontWeight="500">Edit Options</Text>
              <Box minW="200px" textAlign="left" pl={4}>
                <Text fontSize="16px" fontWeight="500">Is it Correct?</Text>
              </Box>
            </Flex>
            
            <VStack spacing={2} align="stretch">
              {options.map((option, index) => (
                <Flex key={option.id} align="center" gap={4}>
                  {/* Option Number Circle */}
                  <Flex
                    w="32px"
                    h="32px"
                    bg="#8F64E1"
                    color="white"
                    borderRadius="50%"
                    align="center"
                    justify="center"
                    fontSize="14px"
                    fontWeight="500"
                    flexShrink={0}
                  >
                    {index + 1}
                  </Flex>
                  
                  {/* Option Input */}
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    bg="#F8F9FA"
                    border="1px solid #E2E8F0"
                    borderRadius="8px"
                    p={3}
                    fontSize="14px"
                    flex="1"
                    _focus={{
                      borderColor: "#8F64E1",
                      boxShadow: "0 0 0 1px #8F64E1"
                    }}
                  />
                  
                  {/* Correct Answer Radio */}
                  <HStack spacing={8} minW="200px" justify="flex-start" pl={4}>
                    <HStack spacing={2}>
                      <Radio 
                        isChecked={option.isCorrect} 
                        onChange={() => handleCorrectAnswerChange(option.id)}
                        colorScheme="purple"
                      />
                      <Text fontSize="14px" color="#666">Yes</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Radio 
                        isChecked={!option.isCorrect} 
                        onChange={() => handleCorrectAnswerChange(0)} // 0 means no correct answer for this option
                        colorScheme="gray"
                      />
                      <Text fontSize="14px" color="#666">No</Text>
                    </HStack>
                  </HStack>
                </Flex>
              ))}
            </VStack>
            
            {/* Add More Option Button */}
            <Button
              variant="outline"
              borderColor="#8F64E1"
              color="#8F64E1"
              borderRadius="8px"
              mt={2}
              onClick={handleAddOption}
              fontSize="14px"
              fontWeight="500"
              _hover={{
                bg: "#F7F5FF"
              }}
            >
              + Add More option
            </Button>
          </Box>

          {/* Ask Question Button */}
          <Flex justify="flex-end" mt={4}>
            <Button
              bgGradient="linear(to-r, #8F64E1, #5767D0)"
              color="white"
              borderRadius="34px"
              px={10}
              py={3}
              fontSize="16px"
              fontWeight="500"
              onClick={handleAskQuestion}
              isDisabled={!question.trim() || options.filter(opt => opt.text.trim()).length < 2}
              _hover={{ 
                bgGradient: "linear(to-r, #7B4FD1, #4A5BBD)",
              }}
              _disabled={{
                bgGradient: "linear(to-r, #B0B0B0, #9A9A9A)",
                cursor: "not-allowed"
              }}
            >
              Ask Question
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default TeacherPollPage;
