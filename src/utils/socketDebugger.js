// Enhanced debugging utility for testing socket events
// This file can be imported and used to test socket events manually

import socket from './socket.js';

// Initialize socket connection
function initSocketDebugger() {
  console.log('Initializing socket debugger');
  
  if (!socket.connected) {
    socket.connect();
  }
  
  // Set up listeners for key events
  socket.on('poll_created', (data) => {
    console.log('💬 [DEBUG] poll_created event received:', data);
    // Store the most recent poll data for debugging
    window._lastPollData = data;
  });
  
  socket.on('submit_answer', (data) => {
    console.log('💬 [DEBUG] submit_answer event received:', data);
    // Store the most recent answer for debugging
    window._lastAnswerData = data;
    
    // Add to list of answers
    if (!window._allAnswers) window._allAnswers = [];
    window._allAnswers.push(data);
    
    // Update current poll with this answer
    try {
      const pollData = JSON.parse(localStorage.getItem('currentPoll'));
      if (pollData) {
        if (!pollData.results) {
          pollData.results = {};
        }
        
        const optionIndex = parseInt(data.answer);
        if (!pollData.results[optionIndex]) {
          pollData.results[optionIndex] = 0;
        }
        
        pollData.results[optionIndex] += 1;
        localStorage.setItem('currentPoll', JSON.stringify(pollData));
        console.log('💬 [DEBUG] Updated poll results:', pollData.results);
      }
    } catch (err) {
      console.error('Error updating poll results:', err);
    }
  });
  
  // Add global test methods
  window.testSubmitAnswer = (answer, studentName = 'Test Student') => {
    console.log(`Manually submitting answer: ${answer} from ${studentName}`);
    
    // Get current poll data
    try {
      const pollData = JSON.parse(localStorage.getItem('currentPoll'));
      
      socket.emit('submit_answer', {
        pollId: pollData?.id || 'test_poll',
        answer: answer.toString(),
        answerText: pollData?.options?.[parseInt(answer)] || `Option ${parseInt(answer) + 1}`,
        studentName
      });
      
      return 'Answer submitted successfully!';
    } catch (err) {
      console.error('Error submitting test answer:', err);
      return 'Error submitting answer: ' + err.message;
    }
  };
  
  window.debugGetAllSocketEvents = () => {
    try {
      return JSON.parse(localStorage.getItem('socket_events') || '[]');
    } catch (err) {
      return 'Error getting socket events: ' + err.message;
    }
  };
  
  console.log('Socket debugger initialized. Available commands:');
  console.log('- window.testSubmitAnswer(answer, studentName)');
  console.log('- window.debugGetAllSocketEvents()');
  
  return {
    testSubmitAnswer: window.testSubmitAnswer,
    debugGetAllSocketEvents: window.debugGetAllSocketEvents
  };
}

export default initSocketDebugger;
