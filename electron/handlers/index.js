import helloHandler from './helloHandler.js';
import interfaceHandler from './interfaceHandler.js';
import setupServiceHandler from './serviceHandler.js';

/**
 * Sets up all IPC handlers for the Electron app.
 *
 * @function
 * @param {Electron.IpcMain} ipcMain - The IPC main process instance from Electron.
 * @param {Electron.BrowserWindow} win - The BrowserWindow instance for which handlers will be configured.
 * @description Initializes and registers all IPC handlers for the application.
 *
 * @example
 * import setupHandlers from './handlers.js';
 * setupHandlers(ipcMain, win);
 */
function setupHandlers(ipcMain, win) {
    console.log('[+] Registering IPC Handlers...');
    helloHandler(ipcMain);
    interfaceHandler(ipcMain);
    setupServiceHandler();

}

export default setupHandlers;
