// Debug script for polling system
// Copy and paste this into the browser console to test the system

console.log('🧪 === POLLING SYSTEM DEBUG SCRIPT ===');

// Test 1: Create a test poll
function testCreatePoll() {
  console.log('\n🧪 TEST 1: Creating test poll...');
  
  const testPoll = {
    id: `test-poll-${Date.now()}`,
    question: "Which programming language do you prefer?",
    options: [
      { text: "JavaScript" },
      { text: "Python" },
      { text: "TypeScript" },
      { text: "Java" }
    ],
    duration: 60,
    timestamp: Date.now()
  };
  
  // Clear previous data
  localStorage.removeItem('pollVotes');
  localStorage.removeItem('pollResults');
  
  // Store the poll
  localStorage.setItem('currentPoll', JSON.stringify(testPoll));
  localStorage.setItem('pollTimestamp', Date.now().toString());
  
  // Trigger events
  window.dispatchEvent(new CustomEvent('poll-delivered', { detail: testPoll }));
  
  console.log('✅ Test poll created:', testPoll);
  return testPoll;
}

// Test 2: Submit votes
function testSubmitVotes() {
  console.log('\n🧪 TEST 2: Submitting test votes...');
  
  const votes = [
    { student: 'Alice', option: 'JavaScript' },
    { student: 'Bob', option: 'Python' },
    { student: 'Charlie', option: 'JavaScript' },
    { student: 'Diana', option: 'TypeScript' },
    { student: 'Eve', option: 'JavaScript' }
  ];
  
  votes.forEach((vote, index) => {
    setTimeout(() => {
      console.log(`🗳️ ${vote.student} voting for ${vote.option}`);
      
      // Simulate the vote submission logic
      const voteObj = {
        studentName: vote.student,
        selectedOption: vote.option,
        timestamp: Date.now(),
        id: `${vote.student}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Get existing votes
      let allVotes = [];
      const stored = localStorage.getItem('pollVotes');
      if (stored) {
        allVotes = JSON.parse(stored);
      }
      
      // Remove previous vote from same student
      allVotes = allVotes.filter(v => v.studentName !== vote.student);
      
      // Add new vote
      allVotes.push(voteObj);
      
      // Store votes
      localStorage.setItem('pollVotes', JSON.stringify(allVotes));
      
      // Calculate results
      const currentPoll = JSON.parse(localStorage.getItem('currentPoll'));
      const results = {};
      
      if (currentPoll && currentPoll.options) {
        currentPoll.options.forEach(option => {
          results[option.text] = { count: 0, students: [] };
        });
        
        allVotes.forEach(v => {
          if (results[v.selectedOption]) {
            results[v.selectedOption].count++;
            results[v.selectedOption].students.push(v.studentName);
          }
        });
      }
      
      // Store results
      localStorage.setItem('pollResults', JSON.stringify(results));
      
      // Trigger events
      window.dispatchEvent(new CustomEvent('results-updated', { detail: results }));
      
      console.log(`✅ Vote submitted by ${vote.student}. Current results:`, results);
      
    }, index * 1000); // 1 second delay between votes
  });
}

// Test 3: Check final results
function testCheckResults() {
  setTimeout(() => {
    console.log('\n🧪 TEST 3: Checking final results...');
    
    const votes = localStorage.getItem('pollVotes');
    const results = localStorage.getItem('pollResults');
    const poll = localStorage.getItem('currentPoll');
    
    console.log('📊 Final Poll:', JSON.parse(poll || '{}'));
    console.log('🗳️ Final Votes:', JSON.parse(votes || '[]'));
    console.log('📈 Final Results:', JSON.parse(results || '{}'));
    
    // Verify vote counting
    const votesArray = JSON.parse(votes || '[]');
    const voteCounts = {};
    votesArray.forEach(vote => {
      voteCounts[vote.selectedOption] = (voteCounts[vote.selectedOption] || 0) + 1;
    });
    
    console.log('🔍 Manual vote count verification:', voteCounts);
    
    const storedResults = JSON.parse(results || '{}');
    const storedCounts = {};
    Object.keys(storedResults).forEach(option => {
      storedCounts[option] = storedResults[option].count;
    });
    
    console.log('🔍 Stored results count:', storedCounts);
    
    const isCorrect = JSON.stringify(voteCounts) === JSON.stringify(storedCounts);
    console.log(isCorrect ? '✅ Vote counting is CORRECT!' : '❌ Vote counting has ERRORS!');
    
  }, 6000); // Wait for all votes to be submitted
}

// Test 4: Test new poll detection
function testNewPollDetection() {
  setTimeout(() => {
    console.log('\n🧪 TEST 4: Testing new poll detection...');
    
    const newPoll = {
      id: `new-poll-${Date.now()}`,
      question: "What's your favorite framework?",
      options: [
        { text: "React" },
        { text: "Vue" },
        { text: "Angular" },
        { text: "Svelte" }
      ],
      duration: 60,
      timestamp: Date.now()
    };
    
    console.log('🆕 Creating new poll:', newPoll);
    
    // Clear previous data
    localStorage.removeItem('pollVotes');
    localStorage.removeItem('pollResults');
    
    // Store new poll
    localStorage.setItem('currentPoll', JSON.stringify(newPoll));
    localStorage.setItem('pollTimestamp', Date.now().toString());
    
    // Trigger events
    window.dispatchEvent(new CustomEvent('poll-delivered', { detail: newPoll }));
    
    console.log('✅ New poll should be detected by React components');
    
  }, 8000);
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting comprehensive polling system test...');
  
  testCreatePoll();
  testSubmitVotes();
  testCheckResults();
  testNewPollDetection();
  
  console.log('⏱️ Tests will complete in ~10 seconds. Watch the console for results.');
}

// Instructions
console.log(`
📋 INSTRUCTIONS:
1. Run: runAllTests() - to test the complete system
2. Or run individual tests:
   - testCreatePoll()
   - testSubmitVotes()
   - testCheckResults()
   - testNewPollDetection()

🔍 Watch the console output to see if:
- Polls are created correctly
- Votes are stored without overwriting
- Results are calculated accurately
- New polls are detected
`);

// Export functions to global scope
window.testCreatePoll = testCreatePoll;
window.testSubmitVotes = testSubmitVotes;
window.testCheckResults = testCheckResults;
window.testNewPollDetection = testNewPollDetection;
window.runAllTests = runAllTests;
