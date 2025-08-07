// Cross-tab atomic voting system with enhanced locking

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

// Cross-tab atomic voting system with enhanced locking
let voteQueue = [];
let isProcessing = false;
const LOCK_KEY = 'vote-processing-lock';
const LOCK_TIMEOUT = 10000; // 10 seconds
const MAX_LOCK_ATTEMPTS = 50;

// Helper function to acquire cross-tab lock
async function acquireLock(sessionId) {
  for (let attempt = 0; attempt < MAX_LOCK_ATTEMPTS; attempt++) {
    const currentTime = Date.now();
    const existingLock = localStorage.getItem(LOCK_KEY);
    
    // Check if no lock exists or if existing lock has expired
    if (!existingLock) {
      try {
        // Try to acquire the lock
        const lockData = { sessionId, timestamp: currentTime };
        localStorage.setItem(LOCK_KEY, JSON.stringify(lockData));
        
        // Verify we got the lock (check if another tab didn't grab it)
        await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        const verifyLock = localStorage.getItem(LOCK_KEY);
        
        if (verifyLock) {
          const parsedLock = JSON.parse(verifyLock);
          if (parsedLock.sessionId === sessionId) {
            console.log(`🔒 Lock acquired by session: ${sessionId}`);
            return true;
          }
        }
      } catch (e) {
        // Lock acquisition failed, try again
      }
    } else {
      try {
        const lockData = JSON.parse(existingLock);
        // Check if lock has expired
        if ((currentTime - lockData.timestamp) > LOCK_TIMEOUT) {
          console.log(`🧹 Cleaning expired lock from: ${lockData.sessionId}`);
          localStorage.removeItem(LOCK_KEY);
          continue; // Try again in next iteration
        }
      } catch (e) {
        // Corrupted lock data, remove it
        localStorage.removeItem(LOCK_KEY);
        continue;
      }
    }
    
    // Wait with exponential backoff
    const waitTime = Math.min(50 + (attempt * 20) + Math.random() * 50, 500);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  console.error(`❌ Failed to acquire lock after ${MAX_LOCK_ATTEMPTS} attempts`);
  return false;
}

// Helper function to release lock
function releaseLock(sessionId) {
  try {
    const existingLock = localStorage.getItem(LOCK_KEY);
    if (existingLock) {
      const lockData = JSON.parse(existingLock);
      if (lockData.sessionId === sessionId) {
        localStorage.removeItem(LOCK_KEY);
        console.log(`🔓 Lock released by session: ${sessionId}`);
      }
    }
  } catch (e) {
    // Error releasing lock, force remove it
    localStorage.removeItem(LOCK_KEY);
  }
}

export const submitAnswer = async (selectedOption, studentName) => {
  console.log('🗳️ === VOTE SUBMISSION START ===');
  console.log('🗳️ Student:', studentName, 'Option:', selectedOption);
  
  return new Promise((resolve, reject) => {
    const vote = {
      studentName,
      selectedOption,
      timestamp: Date.now(),
      id: `${studentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      resolve,
      reject
    };
    
    // Add to queue
    voteQueue.push(vote);
    console.log(`📥 Vote queued. Queue length: ${voteQueue.length}`);
    
    // Start processing if not already processing
    if (!isProcessing) {
      processVoteQueue();
    }
  });
};

async function processVoteQueue() {
  if (isProcessing || voteQueue.length === 0) {
    return;
  }
  
  isProcessing = true;
  console.log('🔄 Starting vote queue processing...');
  
  while (voteQueue.length > 0) {
    const vote = voteQueue.shift(); // Take first vote from queue
    console.log(`🔄 Processing vote from ${vote.studentName} (${voteQueue.length} remaining)`);
    
    try {
      // Get current poll
      const currentPoll = getCurrentPoll();
      if (!currentPoll?.options) {
        throw new Error('No current poll found');
      }
      
      // Validate option
      const validOption = currentPoll.options.find(opt => opt.text === vote.selectedOption);
      if (!validOption) {
        throw new Error('Invalid option selected');
      }
      
      // Process this vote with cross-tab locking
      const result = await processVoteWithLock(vote, currentPoll);
      
      // Resolve the promise
      vote.resolve(result);
      
    } catch (error) {
      console.error(`❌ Error processing vote for ${vote.studentName}:`, error);
      vote.reject(error);
    }
    
    // Small delay between votes
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  
  isProcessing = false;
  console.log('✅ Vote queue processing completed');
}

async function processVoteWithLock(vote, currentPoll) {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  // Acquire cross-tab lock
  const lockAcquired = await acquireLock(sessionId);
  if (!lockAcquired) {
    throw new Error('Could not acquire processing lock');
  }
  
  try {
    console.log(`⚡ Processing vote for ${vote.studentName}: ${vote.selectedOption} [LOCKED]`);
    
    // Multiple read attempts with verification
    let votes = [];
    let readSuccess = false;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const stored = localStorage.getItem('pollVotes');
        if (stored) {
          const parsedVotes = JSON.parse(stored);
          if (Array.isArray(parsedVotes)) {
            votes = parsedVotes;
            readSuccess = true;
            break;
          }
        } else {
          votes = [];
          readSuccess = true;
          break;
        }
      } catch (e) {
        console.warn(`⚠️ Read attempt ${attempt + 1} failed`);
        if (attempt === 2) {
          votes = [];
          readSuccess = true;
        } else {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    }
    
    if (!readSuccess) {
      throw new Error('Failed to read votes after multiple attempts');
    }
    
    console.log(`📋 Current votes before processing: ${votes.length}`);
    console.log(`📋 Existing votes: ${votes.map(v => `${v.studentName}:${v.selectedOption}`).join(', ')}`);
    
    // Remove any existing vote from this student
    const filteredVotes = votes.filter(v => v.studentName !== vote.studentName);
    const removedCount = votes.length - filteredVotes.length;
    
    if (removedCount > 0) {
      console.log(`🔄 Removed ${removedCount} previous vote(s) from ${vote.studentName}`);
    }
    
    // Add new vote
    filteredVotes.push({
      studentName: vote.studentName,
      selectedOption: vote.selectedOption,
      timestamp: vote.timestamp,
      id: vote.id
    });
    
    // Sort by timestamp
    filteredVotes.sort((a, b) => a.timestamp - b.timestamp);
    
    console.log(`📊 Updated votes count: ${filteredVotes.length}`);
    console.log(`📊 All votes: ${filteredVotes.map(v => `${v.studentName}:${v.selectedOption}`).join(', ')}`);
    
    // Enhanced save with multiple verification attempts
    let saveSuccess = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const votesData = JSON.stringify(filteredVotes);
        localStorage.setItem('pollVotes', votesData);
        
        // Multiple verification steps
        await new Promise(resolve => setTimeout(resolve, 25));
        const verification1 = localStorage.getItem('pollVotes');
        await new Promise(resolve => setTimeout(resolve, 25));
        const verification2 = localStorage.getItem('pollVotes');
        
        if (verification1 === votesData && verification2 === votesData) {
          const verifiedVotes = JSON.parse(verification1);
          if (verifiedVotes.length === filteredVotes.length) {
            console.log(`💾 Votes saved and verified on attempt ${attempt + 1}: ${verifiedVotes.length} total`);
            saveSuccess = true;
            break;
          }
        }
        
        if (attempt < 2) {
          console.warn(`⚠️ Save verification failed on attempt ${attempt + 1}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (e) {
        console.error(`❌ Save attempt ${attempt + 1} failed:`, e);
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    if (!saveSuccess) {
      throw new Error('Vote save failed after multiple attempts');
    }
    
    // Re-read to get final verified votes
    const finalVotes = JSON.parse(localStorage.getItem('pollVotes'));
    
    // Calculate results
    const results = {};
    currentPoll.options.forEach(option => {
      results[option.text] = { count: 0, students: [] };
    });
    
    finalVotes.forEach(v => {
      if (results[v.selectedOption]) {
        results[v.selectedOption].count++;
        results[v.selectedOption].students.push(v.studentName);
      }
    });
    
    console.log('📊 Results calculated:', JSON.stringify(results, null, 2));
    
    // Save results with verification
    let resultsSuccess = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resultsData = JSON.stringify(results);
        localStorage.setItem('pollResults', resultsData);
        
        await new Promise(resolve => setTimeout(resolve, 20));
        const resultsVerification = localStorage.getItem('pollResults');
        
        if (resultsVerification === resultsData) {
          resultsSuccess = true;
          console.log(`📊 Results saved and verified on attempt ${attempt + 1}`);
          break;
        }
      } catch (e) {
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    }
    
    if (!resultsSuccess) {
      console.warn('⚠️ Results save failed, but vote was recorded');
    }
    
    // Broadcast updates
    broadcastResults(results, finalVotes.length);
    
    return {
      success: true,
      vote: {
        studentName: vote.studentName,
        selectedOption: vote.selectedOption,
        timestamp: vote.timestamp,
        id: vote.id
      },
      results,
      totalVotes: finalVotes.length
    };
    
  } finally {
    // Always release the lock
    releaseLock(sessionId);
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
    console.log('Queue status:', getVoteQueueStatus());
    
    return {
      poll: poll ? JSON.parse(poll) : null,
      votes: votes ? JSON.parse(votes) : [],
      results: results ? JSON.parse(results) : {},
      queueStatus: getVoteQueueStatus()
    };
  } catch (error) {
    console.error('Debug error:', error);
    return null;
  }
};

export const cleanupStaleLocks = () => {
  console.log('🧹 Cleaning up vote queue...');
  
  try {
    // Clear any stuck votes older than 30 seconds
    const now = Date.now();
    const originalLength = voteQueue.length;
    voteQueue = voteQueue.filter(vote => (now - vote.timestamp) < 30000);
    
    if (voteQueue.length < originalLength) {
      console.log(`🧹 Removed ${originalLength - voteQueue.length} stale votes from queue`);
    }
    
    // Reset processing flag if stuck
    if (isProcessing && voteQueue.length === 0) {
      isProcessing = false;
      console.log('🧹 Reset stuck processing flag');
    }
    
    // Clean up any stuck locks
    const existingLock = localStorage.getItem(LOCK_KEY);
    if (existingLock) {
      try {
        const lockData = JSON.parse(existingLock);
        if ((now - lockData.timestamp) > LOCK_TIMEOUT) {
          localStorage.removeItem(LOCK_KEY);
          console.log('🧹 Removed expired lock');
        }
      } catch (e) {
        localStorage.removeItem(LOCK_KEY);
        console.log('🧹 Removed corrupted lock');
      }
    }
  } catch (error) {
    console.warn('Cleanup error:', error);
  }
};

export const getVoteQueueStatus = () => {
  return {
    queueLength: voteQueue.length,
    isProcessing: isProcessing,
    queueItems: voteQueue.map(v => ({
      studentName: v.studentName,
      selectedOption: v.selectedOption,
      timestamp: v.timestamp
    }))
  };
};
