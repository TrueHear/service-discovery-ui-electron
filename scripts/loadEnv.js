// scripts/loadEnv.js
import fs from 'fs';
import dotenv from 'dotenv';

const result = dotenv.config({ path: './.env' });
if (result.error) {
  throw result.error;
}

const config = {
  REACT_APP_ELECTRON_ENVIRONMENT: process.env.REACT_APP_ELECTRON_ENVIRONMENT,
};

fs.writeFileSync('app-config.json', JSON.stringify(config, null, 2));
console.log('app-config.json generated successfully!');
