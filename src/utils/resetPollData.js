// resetPollData.js - Utility to reset and clean up poll data

/**
 * Resets all poll-related data in localStorage to ensure fresh state
 */
export function resetPollData() {
  console.log('Resetting all poll data to ensure fresh state');
  
  try {
    // Save the student name if it exists
    const studentName = localStorage.getItem('studentName');
    
    // Clear everything poll-related
    localStorage.removeItem('currentPoll');
    localStorage.removeItem('pastPolls');
    localStorage.removeItem('poll_answers');
    localStorage.removeItem('processed_answers');
    localStorage.removeItem('poll_history');
    localStorage.removeItem('socket_events');
    localStorage.removeItem('poll_timestamp');
    localStorage.removeItem('poll_answers_updated');
    localStorage.removeItem('socket_events_updated');
    
    // Also clear sessionStorage
    sessionStorage.removeItem('currentPoll');
    
    // Restore student name if it existed
    if (studentName) {
      localStorage.setItem('studentName', studentName);
    }
    
    console.log('Poll data reset complete');
    return true;
  } catch (error) {
    console.error('Error resetting poll data:', error);
    return false;
  }
}

/**
 * Creates a fresh poll with clean data
 */
export function createFreshPoll(pollData) {
  console.log('Creating fresh poll with clean data');
  
  try {
    // First reset all existing data
    resetPollData();
    
    // Add a timestamp and uniqueId to the poll data if not present
    const cleanPollData = {
      ...pollData,
      timestamp: Date.now(),
      uniqueId: `poll_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      results: {} // Start with empty results
    };
    
    // Store the fresh poll data
    localStorage.setItem('currentPoll', JSON.stringify(cleanPollData));
    sessionStorage.setItem('currentPoll', JSON.stringify(cleanPollData));
    
    console.log('Fresh poll created:', cleanPollData);
    return cleanPollData;
  } catch (error) {
    console.error('Error creating fresh poll:', error);
    return pollData;
  }
}

/**
 * Submits an answer to the current poll and ensures accurate count
 */
export function submitFreshAnswer(answerData) {
  console.log('Submitting answer with clean tracking');
  
  try {
    // Get current poll
    const currentPollStr = localStorage.getItem('currentPoll');
    if (!currentPollStr) {
      console.error('No current poll found when submitting answer');
      return false;
    }
    
    const currentPoll = JSON.parse(currentPollStr);
    
    // Ensure we have a results object
    if (!currentPoll.results) {
      currentPoll.results = {};
    }
    
    // Update the results for this option
    const optionIndex = parseInt(answerData.answer);
    if (!currentPoll.results[optionIndex]) {
      currentPoll.results[optionIndex] = 0;
    }
    currentPoll.results[optionIndex] += 1;
    
    // Save the updated poll
    localStorage.setItem('currentPoll', JSON.stringify(currentPoll));
    sessionStorage.setItem('currentPoll', JSON.stringify(currentPoll));
    
    // Save the answer in a clean poll_answers array
    try {
      const answers = JSON.parse(localStorage.getItem('poll_answers') || '[]');
      answers.push({
        ...answerData,
        timestamp: Date.now(),
        id: `answer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
      localStorage.setItem('poll_answers', JSON.stringify(answers));
      localStorage.setItem('poll_answers_updated', Date.now().toString());
    } catch (err) {
      console.warn('Error saving answer to poll_answers:', err);
    }
    
    console.log('Answer submitted successfully, current results:', currentPoll.results);
    return true;
  } catch (error) {
    console.error('Error submitting answer:', error);
    return false;
  }
}
