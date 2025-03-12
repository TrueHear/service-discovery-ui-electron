import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads the appropriate configuration file based on the environment.
 *
 * @function
 * @param {string} [environment='development'] - The environment to use ('development' or 'production').
 * @returns {Object} The parsed configuration object.
 * @throws Will throw an error if the configuration file cannot be read or parsed.
 * @description This function determines the path of the configuration file based on the provided environment and loads the configuration JSON.
 *
 * @example
 * import loadConfig from './utils/loadConfig.js';
 * const configs = loadConfig('production');
 */
function loadConfig(environment = 'development') {
    try {
        console.log(`[+] Loading configuration for environment: ${environment}`);
        const configPath = environment === 'development'
            ? path.join(__dirname, '..', '..', 'app-config.json') // In dev, one level up
            : path.join(process.resourcesPath, 'app-config.json'); // In production, inside resources
        console.log(`[+] Config Path: ${configPath}`);
        const rawConfig = fs.readFileSync(configPath, 'utf8');
        const configs = JSON.parse(rawConfig);
        console.log(`[+] Configuration Loaded Successfully`);
        return configs;
    } catch (error) {
        console.error(`[+] Error loading configuration file for ${environment}:`, error);
        throw error;
    }
}

export default loadConfig;
