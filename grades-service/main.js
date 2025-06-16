const startHttpServer = require('./app');            
const startMessageListener = require('./grades_service');

async function main() {
  try {
    await startHttpServer();         
    await startMessageListener();    
  } catch (error) {
    console.error('Failed to start Grades service:', error);
  }
}

main();
