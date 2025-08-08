/**
 * Reset all poll-related data from localStorage
 * This clears any existing poll state when a student joins
 */
export const resetPollData = () => {
  // Clear all poll-related localStorage items
  const keysToRemove = [
    'pollState',
    'currentPoll',
    'pollResults',
    'userVote',
    'hasVoted',
    'pollId',
    'pollQuestions',
    'studentAnswers'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Clear sessionStorage as well
  keysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
  });

  console.log('Poll data reset completed');
};