import { ipcMain } from 'electron';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the worker file
const workerPath = path.join(__dirname, '..', 'workers', 'searchServicesWorker.js');

/**
 * Registers the 'search-services' IPC handler.
 *
 * @param {Electron.IpcMain} ipcMain - The IPC main process instance from Electron.
 * @description This function sets up an IPC handler for searching mDNS services
 * that runs in a worker thread to avoid blocking the main process.
 *
 * @example
 * import setupServiceHandler from './serviceHandler.js';
 * setupServiceHandler(ipcMain);
 */
function setupServiceHandler() {
    console.log(`[+] Service Handler Registered`);

    ipcMain.handle('search-services', async (event, options) => {
        try {
            console.log(`[+] Searching for services using a worker thread...`);

            // Run the worker thread for searching services
            const result = await searchServicesInWorker(options);
            return { status: true, message: result };
        } catch (error) {
            console.error(`[-] Error searching services: ${error.message}`);
            return { status: false, message: 'something went wrong' };
        }
    });
}

/**
 * Runs the service search in a worker thread.
 *
 * @param {Object} options - The search options to pass to the worker.
 * @returns {Promise<Object>} A promise that resolves with the worker's message.
 */
function searchServicesInWorker(options) {
    return new Promise((resolve, reject) => {
        console.log('[+] Worker thread initiated for service search');

        const worker = new Worker(workerPath, {
            workerData: options // Pass search options to the worker thread
        });

        // Handle messages from the worker thread
        worker.on('message', (message) => {
            console.log(`[+] Worker message received:`, message);
            resolve(message); // Resolve the promise with the worker's message
        });

        // Handle errors from the worker thread
        worker.on('error', (error) => {
            console.log(`[+] Worker error:`, error.message);
            reject({ status: false, message: `Worker thread error: ${error.message}` });
        });

        // Handle worker exit
        worker.on('exit', (code) => {
            console.log(`[+] Worker exited with code: ${code}`);
            if (code !== 0) {
                reject({ status: false, message: `Worker stopped with exit code ${code}` });
            }
        });
    });
}

export default setupServiceHandler;
