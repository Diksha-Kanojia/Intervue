import {
    Box,
    Button,
    Heading,
    Input,
    Tag,
    Text,
    VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPollData } from '../utils/resetPollData';

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (!name.trim()) return;

    // Clear any existing poll data when student joins
    resetPollData();
    
    // Store student name
    localStorage.setItem('studentName', name.trim());
    
    // Navigate to waiting page
    navigate('/student-waiting');
  };

  return (
    <Box 
      minH="100vh" 
      bg="white"
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center"
      px={4}
    >
      {/* Intervue Poll Tag */}
      <Tag 
        bgGradient="linear(to-r, #8F64E1, #5767D0)" 
        color="white" 
        borderRadius="34px" 
        py={2} 
        px={4}
        fontSize="16px"
        fontWeight="500"
        mb={8}
      >
        Intervue Poll
      </Tag>

      {/* Main Content - Increased size */}
      <Box textAlign="center" maxWidth="500px" w="100%">
        {/* Main Heading - Larger font */}
        <Heading 
          as="h1" 
          fontSize="36px"
          color="black"
          fontWeight="600"
          mb={6}
        >
          Let's Get Started
        </Heading>

        {/* Description - Larger font */}
        <Text 
          fontSize="18px" 
          color="#666666"
          mb={8}
          lineHeight="1.5"
          maxWidth="450px"
          mx="auto"
        >
          If you're a student, you'll be able to <Text as="span" fontWeight="600">submit your answers</Text>, participate in live polls, and see how your responses compare with your classmates
        </Text>

        {/* Name Input Section */}
        <VStack spacing={4} align="stretch" maxWidth="380px" mx="auto">
          <Box>
            <Text 
              fontSize="16px" 
              fontWeight="500" 
              color="#333"
              mb={3}
              textAlign="left"
            >
              Enter your Name
            </Text>
            <Input
              placeholder="Rahul Bajaj"
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg="#F8F9FA"
              border="1px solid #E2E8F0"
              borderRadius="8px"
              px={4}
              py={3}
              fontSize="16px"
              h="48px"
              w="100%"
              _focus={{
                borderColor: "#8F64E1",
                boxShadow: "0 0 0 1px #8F64E1",
                bg: "white"
              }}
              _placeholder={{
                color: "#999"
              }}
            />
          </Box>

          {/* Continue Button - Smaller size */}
          <Button
            bgGradient="linear(to-r, #8F64E1, #5767D0)"
            color="white"
            borderRadius="34px"
            px={6}
            py={2}
            fontSize="14px"
            fontWeight="500"
            h="36px"
            w="140px"
            mx="auto"
            onClick={handleContinue}
            isDisabled={!name.trim()}
            _hover={{ 
              bgGradient: "linear(to-r, #7B4FD1, #4A5BBD)",
            }}
            _disabled={{
              bgGradient: "linear(to-r, #B0B0B0, #9A9A9A)",
              cursor: "not-allowed"
            }}
          >
            Continue
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default StudentOnboarding;
