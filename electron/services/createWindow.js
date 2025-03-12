import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import loadConfig from './loadConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a new Electron BrowserWindow instance with predefined settings.
 *
 * @function
 * @param {string} [environment='development'] - The environment passed to the function.
 * @returns {BrowserWindow} The newly created BrowserWindow instance.
 * @throws Will throw an error if the window creation process fails.
 *
 * @example
 * import createWindow from './createWindow.js';
 * const mainWindow = createWindow();
 */
function createWindow(environment = 'development') {
  try {
    console.log(`[+] Creating window ..`);

    const configs = loadConfig(environment);
    const iconPath =
      configs.REACT_APP_ELECTRON_ENVIRONMENT === 'development'
        ? path.join(__dirname, '..', 'thmainlogo.ico') // Development
        : path.join(__dirname, '..', 'assets', 'thmainlogo.ico'); // Production

    const win = new BrowserWindow({
      icon: iconPath,
      width: 800,
      height: 600,
      show: false, // Ensure the window is hidden initially
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload', 'preload.mjs'),
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: true,
      },
    });
    console.log(`[+] Window created successfully ..`);
    return win;
  } catch (error) {
    console.log(`[-] ${__dirname} Something went wrong while creating window`);
    throw error;
  }
}

export default createWindow;
