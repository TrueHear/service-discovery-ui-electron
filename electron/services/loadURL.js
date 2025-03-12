import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads the appropriate URL (development or production) into the given Electron BrowserWindow.
 *
 * @function
 * @param {Electron.BrowserWindow} win - The BrowserWindow instance where the URL will be loaded.
 * @param {string} [environment='development'] - The environment to use ('development' or 'production').
 * @throws Will throw an error if the URL loading process fails.
 * @description This function determines the environment (development or production) based on the provided parameter and loads the respective URL into the specified BrowserWindow instance.
 *
 * @example
 * import loadURL from './utils/loadURL.js';
 * import { BrowserWindow } from 'electron';
 * const win = new BrowserWindow();
 * loadURL(win, 'production');
 */
function loadURL(win, environment = 'development') {
    try {
        console.log(`[+] Loading URL ..`);
        const productionURL = `file://${path.join(__dirname, "../../build/index.html").replace(/\\/g, "/")}`;
        const developmentURL = `http://localhost:5173`;
        const startURL = environment === "development" ? developmentURL : productionURL;
        console.log(`[+] Start URL:`, startURL);
        win.loadURL(startURL);
        console.log(`[+] URL Loaded Successfully`);
    } catch (error) {
        console.log(`[+]${__dirname}: something went wrong while loading the url`);
        throw error;
    }
}

export default loadURL;
