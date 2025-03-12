/**
 * Registers the 'hello-world' IPC handler.
 *
 * @function
 * @param {Electron.IpcMain} ipcMain - The IPC main process instance from Electron.
 * @description This function sets up an IPC handler for the 'hello-world' channel, which responds with a simple greeting message.
 *
 * @example
 * import helloHandler from './helloHandler.js';
 * helloHandler(ipcMain);
 */
function helloHandler(ipcMain) {
    console.log(`[+] Hello Handler Registered`);
    ipcMain.handle('hello-world', async () => {
        return 'Hello, World!';
    });
}

export default helloHandler;
