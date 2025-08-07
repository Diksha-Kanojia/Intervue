const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

console.log(`${colors.bright}${colors.fg.cyan}Starting Intervue Poll System...${colors.reset}\n`);

// Start the backend
console.log(`${colors.fg.green}Starting Backend Server...${colors.reset}`);
const backendProcess = spawn('npm', ['start'], { 
  cwd: path.join(__dirname, 'server'),
  shell: true
});

backendProcess.stdout.on('data', (data) => {
  console.log(`${colors.fg.green}[Backend] ${colors.reset}${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`${colors.fg.red}[Backend Error] ${colors.reset}${data}`);
});

// Give the backend a moment to start
setTimeout(() => {
  // Start the frontend
  console.log(`${colors.fg.blue}Starting Frontend Development Server...${colors.reset}`);
  const frontendProcess = spawn('npm', ['run', 'dev'], { 
    cwd: __dirname,
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    console.log(`${colors.fg.blue}[Frontend] ${colors.reset}${data}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`${colors.fg.red}[Frontend Error] ${colors.reset}${data}`);
  });

  // Handle termination
  process.on('SIGINT', () => {
    console.log(`\n${colors.bright}${colors.fg.yellow}Shutting down servers...${colors.reset}`);
    frontendProcess.kill();
    backendProcess.kill();
    process.exit();
  });
}, 2000);

console.log(`${colors.bright}${colors.fg.cyan}
==================================
  Intervue Poll System Started
==================================
Frontend: http://localhost:5173
Backend:  http://localhost:5000
==================================
${colors.reset}
Press Ctrl+C to stop all servers.
`);
