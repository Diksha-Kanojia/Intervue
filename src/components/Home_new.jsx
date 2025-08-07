import { Box, Button, Heading, Tag, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigate('/student-onboarding');
    } else if (selectedRole === 'teacher') {
      navigate('/teacher-create-poll');
    }
  };

  return (
    <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="800px" px={4}>
        <Box textAlign="center">
          <Tag 
            bgGradient="linear(to-r, #8F64E1, #5767D0)" 
            color="white" 
            borderRadius="34px" 
            py={2} 
            px={5}
            fontSize="14px"
            fontWeight="500"
            mb={8}
          >
            Intervue Poll
          </Tag>

          <Heading 
            as="h1" 
            fontSize="36px"
            color="black"
            fontWeight="600"
            lineHeight="1.2"
            mb={4}
          >
            Welcome to the Live Polling System
          </Heading>

          <Text 
            fontSize="16px" 
            color="#666666"
            mb={8}
            mx="auto"
            maxW="450px"
          >
            Please select the role that best describes you to begin using the live polling system
          </Text>

          <Box 
            display="flex"
            justifyContent="center"
            gap="16px"
            mb={8}
            maxW="430px"
            mx="auto"
          >
            <Box 
              w="200px"
              h="143px"
              bg="white"
              borderRadius="12px" 
              border={selectedRole === 'student' ? '2px solid #7B61FF' : '2px solid #E2E8F0'}
              cursor="pointer"
              onClick={() => handleRoleSelect('student')}
              p={5}
              textAlign="left"
              flexShrink={0}
            >
              <Text fontWeight="600" fontSize="18px" mb={3}>
                I'm a Student
              </Text>
              <Text 
                fontSize="14px" 
                color="#666666"
                lineHeight="1.4"
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </Text>
            </Box>

            <Box 
              w="200px"
              h="143px"
              bg="white"
              borderRadius="12px" 
              border={selectedRole === 'teacher' ? '2px solid #7B61FF' : '2px solid #E2E8F0'}
              cursor="pointer"
              onClick={() => handleRoleSelect('teacher')}
              p={5}
              textAlign="left"
              flexShrink={0}
            >
              <Text fontWeight="600" fontSize="18px" mb={3}>
                I'm a Teacher
              </Text>
              <Text 
                fontSize="14px" 
                color="#666666"
                lineHeight="1.4"
              >
                Submit answers and view live poll results in real-time.
              </Text>
            </Box>
          </Box>

          <Button
            bgGradient="linear(to-r, #8F64E1, #5767D0)"
            color="white"
            borderRadius="34px"
            px={10}
            py={6}
            fontSize="16px"
            fontWeight="500"
            minW="160px"
            h="48px"
            isDisabled={!selectedRole}
            _hover={{ 
              bgGradient: "linear(to-r, #7B4FD1, #4A5BBD)",
            }}
            _disabled={{
              bgGradient: "linear(to-r, #B0B0B0, #9A9A9A)",
              cursor: "not-allowed",
              _hover: {
                bgGradient: "linear(to-r, #B0B0B0, #9A9A9A)",
              }
            }}
            transition="all 0.2s ease"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
