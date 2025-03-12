import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import loadConfig from './loadConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a new Electron BrowserWindow instance for the splash screen.
 *
 * @function
 * @param {string} [environment='development'] - The environment passed on to the function.
 * @returns {BrowserWindow} The newly created splash BrowserWindow instance.
 * @throws Will throw an error if the splash window creation process fails.
 *
 * @example
 * import createSplashWindow from './createSplashWindow.js';
 * const splashWindow = createSplashWindow();
 */
function createSplashWindow(environment = 'development') {
    try {
        console.log(`[+] Creating splash window...`);

        const configs = loadConfig(environment);
        // Determine the icon path based on the environment
        const iconPath =
            configs.REACT_APP_ELECTRON_ENVIRONMENT === 'development'
                ? path.join(__dirname, '..', 'thmainlogo.ico') // Development
                : path.join(__dirname, '..', 'assets', 'thmainlogo.ico'); // Production

        // Splash window settings
        const splash = new BrowserWindow({
            icon: iconPath,
            width: 400, // Width of the splash screen
            height: 300, // Height of the splash screen
            frame: false, // No title bar
            alwaysOnTop: true, // Ensure it stays on top
            center: true, // Center the window on screen
            resizable: false, // Prevent resizing
            show: true, // Show immediately
            transparent: true, // Transparent background for aesthetic designs
        });

        // Load the splash screen HTML file
        splash.loadFile(path.join(__dirname, '..', 'splash.html'));

        console.log(`[+] Splash window created successfully.`);
        return splash;
    } catch (error) {
        console.log(`[-] ${__dirname} Something went wrong while creating the splash window.`);
        throw error;
    }
}

export default createSplashWindow;
