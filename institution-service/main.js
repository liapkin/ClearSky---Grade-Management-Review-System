const startHttpServer = require('./app');            
const startMessageListener = require('./institution-service');

async function main() {
  try {
    await startHttpServer();         
    await startMessageListener();    
  } catch (error) {
    console.error('Failed to start Institution service:', error);
  }
}

main();
