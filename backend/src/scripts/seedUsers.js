const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const displayMenu = () => {
  console.log('\n--- Test User Management ---');
  console.log('1) Add test users');
  console.log('2) Remove test users');
  console.log('3) Exit');
  rl.question('\nSelect an option (1-3): ', (answer) => {
    switch (answer.trim()) {
      case '1':
        addUsers();
        break;
      case '2':
        removeUsers();
        break;
      case '3':
        console.log('Exiting...');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        displayMenu();
    }
  });
};

const addUsers = () => {
  rl.question('Are you sure you want to add test users? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('Adding test users...');
      exec('npx ts-node src/utils/seedUsers.ts', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          displayMenu();
          return;
        }
        if (stderr) {
          console.error(`Error: ${stderr}`);
          displayMenu();
          return;
        }
        console.log(stdout);
        console.log('Test users added successfully!');
        console.log('You can use the following credentials to log in:');
        console.log('- admin@example.com / password123');
        console.log('- john@example.com / password123');
        console.log('- jane@example.com / password123');
        console.log('- test@example.com / password123');
        displayMenu();
      });
    } else {
      console.log('Operation cancelled.');
      displayMenu();
    }
  });
};

const removeUsers = () => {
  rl.question('Are you sure you want to remove all test users? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('Removing test users...');
      exec('npx ts-node src/utils/seedUsers.ts -d', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          displayMenu();
          return;
        }
        if (stderr) {
          console.error(`Error: ${stderr}`);
          displayMenu();
          return;
        }
        console.log(stdout);
        console.log('Test users removed successfully!');
        displayMenu();
      });
    } else {
      console.log('Operation cancelled.');
      displayMenu();
    }
  });
};

// Start the script
console.log('Welcome to the Test User Management Tool');
displayMenu();

// Handle script exit
rl.on('close', () => {
  console.log('Test User Management Tool closed.');
  process.exit(0);
}); 