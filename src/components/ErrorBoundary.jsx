import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Code, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box p={8} maxW="800px" mx="auto">
          <Alert 
            status="error" 
            variant="subtle" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            textAlign="center" 
            borderRadius="lg"
            py={6}
            mb={6}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Something went wrong
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              An error occurred in the application. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
          
          <Box bg="gray.50" p={4} borderRadius="md" mb={4}>
            <Text fontWeight="bold" mb={2}>Error Details:</Text>
            <Code colorScheme="red" p={3} borderRadius="md" display="block" whiteSpace="pre-wrap">
              {this.state.error && this.state.error.toString()}
            </Code>
          </Box>
          
          <Button 
            onClick={() => window.location.reload()} 
            colorScheme="blue"
            size="md"
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
