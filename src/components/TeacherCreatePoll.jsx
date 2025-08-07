import React, { useState } from 'react';
import { Box, Button, Text, Container, Flex, Input, Textarea, FormControl, FormLabel, HStack, Select, Radio, RadioGroup, Tag, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const TeacherCreatePoll = () => {
  console.log('TeacherCreatePoll component rendering');
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timer, setTimer] = useState(60);
  const [correctOption, setCorrectOption] = useState(null);
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction="column" align="flex-start" maxW="700px" mx="auto">
        <Box mb={4} alignSelf="flex-start">
          <Tag size="md" bg="#7B61FF" color="white" borderRadius="full" py={1.5} px={4}>
            Intervue Poll
          </Tag>
        </Box>

        <VStack spacing={2} mb={6} textAlign="left" alignItems="flex-start">
          <Text 
            fontSize="24px" 
            fontWeight="700" 
            color="black"
            fontFamily="'Inter', sans-serif"
            letterSpacing="-0.5px"
          >
            Let's Get Started
          </Text>
          <Text 
            fontSize="14px" 
            color="gray.600"
            fontFamily="'Inter', sans-serif"
          >
            you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </Text>
        </VStack>

        <Box width="100%" mb={6}>
          <FormControl mb={4}>
            <FormLabel 
              fontWeight="600" 
              fontFamily="'Inter', sans-serif"
              fontSize="14px"
              mb={2}
            >
              Enter your question
            </FormLabel>
            <Textarea
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
              _focus={{ borderColor: '#7B61FF', boxShadow: '0 0 0 1px #7B61FF' }}
              fontFamily="'Inter', sans-serif"
              resize="vertical"
              h="80px"
              bg="#f8f8f8"
            />
            
            <Flex justify="space-between" mt={1}>
              <Text fontSize="xs" color="gray.500">0/100</Text>
              <HStack spacing={2} align="center">
                <FormLabel 
                  fontWeight="600" 
                  fontFamily="'Inter', sans-serif"
                  fontSize="14px"
                  mb={0}
                  htmlFor="timer"
                >
                  {timer} seconds
                </FormLabel>
                <Select 
                  id="timer"
                  size="sm" 
                  w="110px" 
                  value={timer} 
                  onChange={(e) => setTimer(Number(e.target.value))}
                  borderRadius="md"
                  borderColor="gray.300"
                >
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="90">90 seconds</option>
                  <option value="120">120 seconds</option>
                </Select>
              </HStack>
            </Flex>
          </FormControl>
          
          <FormControl mb={4}>
            <Box mb={4}>
              <Flex justifyContent="space-between" align="center" mb={2}>
                <Text fontWeight="600" fontSize="14px" fontFamily="'Inter', sans-serif">
                  Edit Options
                </Text>
                <Text fontWeight="600" fontSize="14px" fontFamily="'Inter', sans-serif">
                  Is it Correct?
                </Text>
              </Flex>
              
              {options.map((option, index) => (
                <Flex key={index} gap={3} align="center" mb={3}>
                  <Box borderRadius="full" bg="#7B61FF" color="white" w="24px" h="24px" display="flex" justifyContent="center" alignItems="center" fontSize="12px" fontWeight="bold">
                    {index + 1}
                  </Box>
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    borderRadius="md"
                    borderColor="gray.200"
                    bg="#f8f8f8"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{ borderColor: '#7B61FF', boxShadow: '0 0 0 1px #7B61FF' }}
                    fontFamily="'Inter', sans-serif"
                  />
                  <RadioGroup onChange={(val) => handleCorrectOptionChange(index, val === 'yes')} value={correctOption === index ? 'yes' : 'no'}>
                    <HStack spacing={4} justifyContent="center" minWidth="120px">
                      <Radio value='yes' size="sm" colorScheme="purple">Yes</Radio>
                      <Radio value='no' size="sm" colorScheme="purple">No</Radio>
                    </HStack>
                  </RadioGroup>
                </Flex>
              ))}
              
              <Button 
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                fontWeight="normal"
                fontSize="sm"
                borderColor="#7B61FF"
                color="#7B61FF"
                borderRadius="md"
                mt={2}
              >
                + Add More option
              </Button>
            </Box>
              <Flex justifyContent="space-between" align="center" mb={2}>
                <Text fontWeight="600" fontSize="14px" fontFamily="'Inter', sans-serif" flex="1">
                  Edit Options
                </Text>
                <Text fontWeight="600" fontSize="14px" fontFamily="'Inter', sans-serif" flex="1" textAlign="center">
                  Is it Correct?
                </Text>
              </Flex>
              
              {options.map((option, index) => (
                <Flex key={index} gap={3} align="center" mb={3}>
                  <Box borderRadius="full" bg="#7B61FF" color="white" w="24px" h="24px" display="flex" justifyContent="center" alignItems="center" fontSize="12px" fontWeight="bold">
                    {index + 1}
                  </Box>
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    borderRadius="md"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{ borderColor: '#7B61FF', boxShadow: '0 0 0 1px #7B61FF' }}
                    fontFamily="'Inter', sans-serif"
                  />
                  <RadioGroup onChange={(val) => isCorrectEnabled && setCorrectOption(index)} value={isCorrectEnabled && correctOption === index ? 'yes' : 'no'}>
                    <HStack spacing={4} justifyContent="center" minWidth="120px">
                      <Radio value='yes' size="sm" colorScheme="purple">Yes</Radio>
                      <Radio value='no' size="sm" colorScheme="purple">No</Radio>
                    </HStack>
                  </RadioGroup>
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveOption(index)}
                      fontWeight="normal"
                      fontSize="sm"
                    >
                      Remove
                    </Button>
                  )}
                </Flex>
              ))}
              
              <Button 
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                alignSelf="flex-start"
                mt={2}
              >
                + Add Option
              </Button>
          </FormControl>
        </Box>

        <Flex justify="flex-end" width="100%">
          <Button
            bg="#7B61FF"
            color="white"
            size="md"
            height="40px"
            width="120px"
            borderRadius="md"
            fontFamily="'Inter', sans-serif"
            fontSize="14px"
            fontWeight="600"
            _hover={{ bg: '#6B51FF' }}
            onClick={handleCreatePoll}
            isDisabled={!isFormValid}
            ml="auto"
          >
            Ask Question
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default TeacherCreatePoll;
