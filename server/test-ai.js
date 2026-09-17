require('dotenv').config({ path: './.env' });
const { generateAIResponse } = require('./services/aiService');
const fs = require('fs');

async function test() {
  try {
    const res = await generateAIResponse('Return {"test": true}', 'You are a bot. Return JSON.');
    fs.writeFileSync('./ai-debug.log', 'Success: ' + JSON.stringify(res));
  } catch (err) {
    fs.writeFileSync('./ai-debug.log', 'Error: ' + err.message);
  }
}

test();
