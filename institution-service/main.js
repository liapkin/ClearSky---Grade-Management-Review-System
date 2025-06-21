const startHttpServer = require('./index');            
const startMessageListener = require('./message_listener');

async function main() {
  try {
    await startHttpServer();         
    await startMessageListener();    
  } catch (error) {
    console.error('Failed to start Institution service:', error);
  }
}

main();
