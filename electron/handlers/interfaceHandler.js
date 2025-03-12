import { list_interfaces } from 'service-discovery-lib';

/**
 * Registers the 'get-interfaces' IPC handler.
 *
 * @function
 * @param {Electron.IpcMain} ipcMain - The IPC main process instance from Electron.
 * @description This function sets up an IPC handler for the 'get-interfaces' channel,
 * which returns the list of network interfaces using the service-discovery-lib.
 *
 * @example
 * import interfaceHandler from './interfaceHandler.js';
 * interfaceHandler(ipcMain);
 */
function interfaceHandler(ipcMain) {
    console.log(`[+] Interface Handler Registered`);
    ipcMain.handle('get-interfaces', async () => {
        try {
            const result = list_interfaces();
            return { status: true, message: result };
        } catch (error) {
            return { status: false, message: error.message };
        }
    });
}

export default interfaceHandler;
