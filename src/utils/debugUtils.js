// Debug utility to help diagnose real-time communication issues
// This file can be imported in any component where debugging is needed

/**
 * Dumps the current state of all communication channels to the console
 */
export function dumpCommunicationState() {
  console.group('🔍 Communication State Debugger');
  
  // Check socket connection
  try {
    const socket = window.socket || (window.io && window.io.socket);
    console.log('Socket connected:', socket?.connected || 'Not found');
    console.log('Socket ID:', socket?.id || 'N/A');
  } catch (err) {
    console.error('Error checking socket state:', err);
  }
  
  // Check localStorage
  try {
    console.group('localStorage');
    console.log('currentPoll:', localStorage.getItem('currentPoll') ? JSON.parse(localStorage.getItem('currentPoll')) : null);
    console.log('poll_timestamp:', localStorage.getItem('poll_timestamp'));
    console.log('lastPoll:', localStorage.getItem('lastPoll') ? JSON.parse(localStorage.getItem('lastPoll')) : null);
    console.log('studentName:', localStorage.getItem('studentName'));
    console.log('poll_history:', localStorage.getItem('poll_history') ? JSON.parse(localStorage.getItem('poll_history')) : null);
    
    const events = JSON.parse(localStorage.getItem('socket_events') || '[]');
    console.log('socket_events count:', events.length);
    if (events.length > 0) {
      console.log('Last socket event:', events[events.length - 1]);
    }
    console.groupEnd();
  } catch (err) {
    console.error('Error checking localStorage:', err);
  }
  
  // Check sessionStorage
  try {
    console.group('sessionStorage');
    console.log('currentPoll:', sessionStorage.getItem('currentPoll') ? JSON.parse(sessionStorage.getItem('currentPoll')) : null);
    console.groupEnd();
  } catch (err) {
    console.error('Error checking sessionStorage:', err);
  }
  
  // Check BroadcastChannel support
  try {
    console.log('BroadcastChannel support:', typeof BroadcastChannel !== 'undefined');
  } catch (err) {
    console.log('BroadcastChannel not supported');
  }
  
  console.groupEnd();
  return true;
}

/**
 * Clears all poll data from storage for testing
 */
export function clearPollData() {
  try {
    localStorage.removeItem('currentPoll');
    localStorage.removeItem('poll_timestamp');
    localStorage.removeItem('lastPoll');
    localStorage.removeItem('poll_history');
    sessionStorage.removeItem('currentPoll');
    
    // Also clear socket events related to polls
    try {
      const events = JSON.parse(localStorage.getItem('socket_events') || '[]');
      const filteredEvents = events.filter(e => e.name !== 'poll_created');
      localStorage.setItem('socket_events', JSON.stringify(filteredEvents));
    } catch (err) {
      console.warn('Error clearing socket events:', err);
    }
    
    console.log('All poll data cleared from storage');
    return true;
  } catch (err) {
    console.error('Error clearing poll data:', err);
    return false;
  }
}

// Export the debug utilities
export default {
  dumpCommunicationState,
  clearPollData
};
