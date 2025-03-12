import { BrowserWindow } from 'electron';

/**
 * Sets up the lifecycle event handlers for the Electron application.
 *
 * @function
 * @param {Electron.App} app - The Electron application instance.
 * @param {Function} createWindow - Function to create a new BrowserWindow.
 * @param {Electron.GlobalShortcut} globalShortcut - Electron's globalShortcut module.
 * @description This function registers event listeners for `window-all-closed`, `activate`, and `will-quit` lifecycle events.
 *
 * @example
 * import setupAppEvents from './lifecycle/appEvents.js';
 * setupAppEvents(app, createWindow, globalShortcut);
 */
function setupAppEvents(app, createWindow, globalShortcut) {
    /**
     * Handles the `window-all-closed` event.
     * Quits the app when all windows are closed, except on macOS.
     */
    app.on('window-all-closed', () => {
        console.log(`[+] window-all-closed triggered`);
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    /**
     * Handles the `activate` event.
     * Recreates a window if none are open (common behavior on macOS).
     */
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    /**
     * Triggered when the application is about to quit.
     */
    app.on('before-quit', () => {
        console.log('[+] App is about to quit');
    });

    /**
     * Handles the `will-quit` event.
     * Unregisters all global shortcuts before quitting the application.
     */
    app.on('will-quit', () => {
        console.log('[+] will quit');
        globalShortcut.unregisterAll();
    });

    app.on('quit', () => {
        console.log('[+] App has quit');
    });
}

export default setupAppEvents;
