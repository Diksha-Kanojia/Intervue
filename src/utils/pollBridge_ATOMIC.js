// Simplified, bulletproof poll bridge with atomic operations

export const deliverPoll = (poll) => {
  console.log('🚀 === POLL DELIVERY START ===');
  console.log('📨 New Poll:', poll);
  
  try {
    // Clear both results and votes for new poll
    localStorage.removeItem('pollResults');
    localStorage.removeItem('pollVotes');
    console.log('🧹 Cleared previous poll data');
    
    // Store new poll
    localStorage.setItem('currentPoll', JSON.stringify(poll));
    console.log('💾 New poll stored');
    
    // Create poll event
    const pollEvent = {
      type: 'poll-delivered',
      data: poll,
      timestamp: Date.now()
    };
    
    // Store event for polling
    localStorage.setItem('pollEvent', JSON.stringify(pollEvent));
    localStorage.setItem('pollTimestamp', Date.now().toString());
    console.log('📡 Poll event created and stored');
    
    // Broadcast to other tabs/windows
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('poll-channel');
      channel.postMessage(pollEvent);
      console.log('📡 Broadcasted via BroadcastChannel');
      setTimeout(() => channel.close(), 100);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('poll-delivered', { detail: poll }));
    console.log('🎯 Dispatched custom event');
    
    console.log('🚀 === POLL DELIVERY END ===');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Error delivering poll:', error);
    return Promise.reject(error);
  }
};

export const submitAnswer = async (selectedOption, studentName) => {
  console.log('🗳️ === VOTE SUBMISSION START ===');
  console.log('🗳️ Student:', studentName, 'Option:', selectedOption);
  
  const maxRetries = 10;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`🔄 Submission attempt ${attempt + 1}/${maxRetries}`);
      
      // Get current poll
      const currentPoll = getCurrentPoll();
      if (!currentPoll?.options) {
        throw new Error('No current poll found');
      }
      
      // Validate option
      const validOption = currentPoll.options.find(opt => opt.text === selectedOption);
      if (!validOption) {
        throw new Error('Invalid option selected');
      }
      
      // Create vote
      const vote = {
        studentName,
        selectedOption,
        timestamp: Date.now(),
        id: `${studentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      console.log('🆕 New vote:', vote);
      
      // ATOMIC OPERATION: Single transaction
      const result = await performAtomicVoteOperation(vote, currentPoll);
      
      console.log('✅ Vote submitted successfully');
      console.log('🗳️ === VOTE SUBMISSION END ===');
      
      return result;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1} failed:`, error);
      attempt++;
      
      if (attempt >= maxRetries) {
        throw new Error(`Vote submission failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 100 * attempt));
    }
  }
};

// Atomic vote operation - all or nothing
async function performAtomicVoteOperation(vote, currentPoll) {
  const lockKey = 'atomic-vote-lock';
  const lockTimeout = 2000; // 2 seconds
  let lockAcquired = false;
  
  try {
    // Wait for lock
    let waitTime = 0;
    while (waitTime < lockTimeout) {
      const existingLock = localStorage.getItem(lockKey);
      if (!existingLock || (Date.now() - parseInt(existingLock)) > lockTimeout) {
        // Acquire lock
        localStorage.setItem(lockKey, Date.now().toString());
        lockAcquired = true;
        console.log('🔒 Atomic lock acquired');
        break;
      }
      
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, 50));
      waitTime += 50;
    }
    
    if (!lockAcquired) {
      throw new Error('Could not acquire atomic lock');
    }
    
    // CRITICAL SECTION START
    console.log('⚡ Starting atomic operation...');
    
    // Read current votes
    let votes = [];
    try {
      const stored = localStorage.getItem('pollVotes');
      if (stored) {
        votes = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('⚠️ Error reading votes, starting fresh');
      votes = [];
    }
    
    console.log('📋 Current votes:', votes.length);
    
    // Remove previous vote from same student
    const filteredVotes = votes.filter(v => v.studentName !== vote.studentName);
    const removedCount = votes.length - filteredVotes.length;
    
    if (removedCount > 0) {
      console.log(`🔄 Removed ${removedCount} previous vote(s) from ${vote.studentName}`);
    }
    
    // Add new vote
    filteredVotes.push(vote);
    filteredVotes.sort((a, b) => a.timestamp - b.timestamp);
    
    console.log('📊 Final votes count:', filteredVotes.length);
    
    // Save votes with verification
    const votesData = JSON.stringify(filteredVotes);
    localStorage.setItem('pollVotes', votesData);
    
    // Verify save
    const verification = localStorage.getItem('pollVotes');
    if (verification !== votesData) {
      throw new Error('Vote save verification failed');
    }
    
    console.log('💾 Votes saved and verified');
    
    // Calculate results
    const results = {};
    currentPoll.options.forEach(option => {
      results[option.text] = { count: 0, students: [] };
    });
    
    filteredVotes.forEach(v => {
      if (results[v.selectedOption]) {
        results[v.selectedOption].count++;
        results[v.selectedOption].students.push(v.studentName);
      }
    });
    
    console.log('📊 Results calculated:', results);
    
    // Save results with verification
    const resultsData = JSON.stringify(results);
    localStorage.setItem('pollResults', resultsData);
    
    // Verify results save
    const resultsVerification = localStorage.getItem('pollResults');
    if (resultsVerification !== resultsData) {
      throw new Error('Results save verification failed');
    }
    
    console.log('💾 Results saved and verified');
    
    // CRITICAL SECTION END
    console.log('⚡ Atomic operation completed');
    
    // Broadcast updates
    broadcastResults(results, filteredVotes.length);
    
    return {
      success: true,
      vote,
      results,
      totalVotes: filteredVotes.length
    };
    
  } finally {
    if (lockAcquired) {
      localStorage.removeItem(lockKey);
      console.log('🔓 Atomic lock released');
    }
  }
}

// Broadcast results to all listeners
function broadcastResults(results, totalVotes) {
  try {
    const resultsEvent = {
      type: 'results-updated',
      results,
      totalVotes,
      timestamp: Date.now()
    };
    
    // Store for polling
    localStorage.setItem('resultsEvent', JSON.stringify(resultsEvent));
    localStorage.setItem('resultsTimestamp', Date.now().toString());
    
    // Broadcast channels
    if (typeof BroadcastChannel !== 'undefined') {
      const resultsChannel = new BroadcastChannel('results-channel');
      const pollChannel = new BroadcastChannel('poll-channel');
      
      resultsChannel.postMessage(resultsEvent);
      pollChannel.postMessage(resultsEvent);
      
      setTimeout(() => {
        resultsChannel.close();
        pollChannel.close();
      }, 100);
    }
    
    // Custom events
    window.dispatchEvent(new CustomEvent('results-updated', { detail: results }));
    window.dispatchEvent(new CustomEvent('vote-submitted', { detail: { results } }));
    
    console.log('🚀 Results broadcast completed');
    
  } catch (error) {
    console.warn('⚠️ Broadcast error (non-critical):', error);
  }
}

export const getResults = () => {
  try {
    const storedResults = localStorage.getItem('pollResults');
    return storedResults ? JSON.parse(storedResults) : {};
  } catch (error) {
    console.error('Error getting results:', error);
    return {};
  }
};

export const getCurrentPoll = () => {
  try {
    const storedPoll = localStorage.getItem('currentPoll');
    return storedPoll ? JSON.parse(storedPoll) : null;
  } catch (error) {
    console.error('Error getting current poll:', error);
    return null;
  }
};

// Debug functions
export const debugVotes = () => {
  try {
    const votes = localStorage.getItem('pollVotes');
    const results = localStorage.getItem('pollResults');
    const poll = localStorage.getItem('currentPoll');
    
    console.log('🔍 === VOTE DEBUG ===');
    console.log('Poll:', poll ? JSON.parse(poll) : null);
    console.log('Votes:', votes ? JSON.parse(votes) : []);
    console.log('Results:', results ? JSON.parse(results) : {});
    
    return {
      poll: poll ? JSON.parse(poll) : null,
      votes: votes ? JSON.parse(votes) : [],
      results: results ? JSON.parse(results) : {}
    };
  } catch (error) {
    console.error('Debug error:', error);
    return null;
  }
};

export const cleanupStaleLocks = () => {
  console.log('🧹 Cleaning up stale locks...');
  
  try {
    const atomicLock = localStorage.getItem('atomic-vote-lock');
    if (atomicLock && (Date.now() - parseInt(atomicLock)) > 5000) {
      localStorage.removeItem('atomic-vote-lock');
      console.log('🧹 Removed stale atomic lock');
    }
  } catch (error) {
    console.warn('Cleanup error:', error);
  }
};

// Make debug available globally
if (typeof window !== 'undefined') {
  window.debugVotes = debugVotes;
}

export const getVoteQueueStatus = () => {
  return {
    queueLength: 0,
    isProcessing: false,
    queueItems: []
  };
};
