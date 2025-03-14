// public/electron.js
import { app, ipcMain, globalShortcut, dialog, Menu } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import createWindow from './services/createWindow.js';
import loadURL from './services/loadURL.js';
import setupAppEvents from './lifecycle/appEvents.js';
import createSplashWindow from './services/createSplashWindow.js';
import handleFatalError from './services/handleFatalError.js';
import loadConfig from './services/loadConfig.js';
import setupHandlers from './handlers/index.js';

async function main(params) {
    try {
        const env = 'production';
        const configs = loadConfig(env);
        console.log(`[+] Configs Found:`, configs);
        app.whenReady().then(async () => {
            try {
                // Create the splash window
                const splash = createSplashWindow(env);

                // Create the main window (hidden initially)
                const win = createWindow(env);

                // Load the main application content
                loadURL(win, configs.REACT_APP_ELECTRON_ENVIRONMENT);

                // Remove the default Menu
                Menu.setApplicationMenu(null);

                // Event: Wait for the main window to finish loading
                win.webContents.once('did-finish-load', () => {
                    console.log(`[+] Main content loaded successfully.`);

                    // Only close the splash window and show the main window if they exist
                    setTimeout(() => {
                        if (splash && !splash.isDestroyed()) {
                            splash.close(); // Safely close splash
                        }
                    }, 1000);

                    setTimeout(() => {
                        if (win && !win.isDestroyed()) {
                            win.show(); // Safely show main window
                            if (configs.REACT_APP_ELECTRON_ENVIRONMENT === 'production') {
                                // SendMessageFromMainToRenderer(win, {
                                //   message: 'checking for update..',
                                //   checkingForUpdates: true,
                                // });
                                // setupAutoUpdate(win);
                                // autoUpdater.checkForUpdates();
                            }
                        }
                    }, 1000);
                });

                // Handle splash or main window being destroyed before loading finishes
                splash.on('closed', () => {
                    console.log('[+] Splash window closed.');
                });

                win.on('closed', () => {
                    console.log('[+] Main window closed.');
                });

                // Open devtools in development (or production if needed)
                if (configs.REACT_APP_ELECTRON_ENVIRONMENT === 'development')
                    win.webContents.openDevTools();
                else
                    win.webContents.openDevTools();

                // Set up IPC handlers and app lifecycle events
                setupHandlers(ipcMain, win);
                setupAppEvents(app, createWindow, globalShortcut);
                // Register global shortcuts
            } catch (error) {
                console.error(`[+] ${__dirname} Something went wrong in app.whenReady.`);
                handleFatalError(error, app, dialog);
            }
        });
    } catch (error) {
        console.error(`[+] ${__dirname} Something went wrong in the main function.`);
        handleFatalError(error, app, dialog);
    }
}

main();
