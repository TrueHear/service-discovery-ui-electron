import { contextBridge, ipcRenderer } from 'electron';



/**
 * A bridge for communication between the Electron main process and renderer process.
 * This object provides methods for handling inter-process communication (IPC) using Electron's `ipcRenderer`.
 *
 * @namespace apibridge
 */
const apibridge = {
    /**
     * Asynchronously sends a 'hello-world' message to the Electron main process.
     *
     * This function uses Electron's ipcRenderer to invoke the 'hello-world' channel,
     * sending a request to the main process and returning a promise that resolves with the response.
     *
     * @async
     * @function
     * @memberof apibridge
     * @returns {Promise<*>} A promise that resolves with the response from the main process.
     *
     * @example
     * apibridge.sayHello().then(response => {
     *     console.log('Response from main process:', response);
     * });
     */
    sayHello: async () => {
        return await ipcRenderer.invoke('hello-world');
    },
    /**
     * Retrieves the list of network interfaces using the 'get-interfaces' IPC channel.
     *
     * @function
     * @memberof apibridge
     * @returns {Promise<Array>} A promise that resolves to an array of network interface objects.
     *
     * @example
     * window.electronapi.getInterfaces().then((interfaces) => {
     *   console.log(interfaces);
     * });
     */
    getInterfaces: async () => {
        return await ipcRenderer.invoke('get-interfaces');
    },

    /**
     * Searches for mDNS services using the 'search-services' IPC channel.
     *
     * @async
     * @function
     * @memberof apibridge
     * @param {Object} options - Search options for mDNS service discovery.
     * @returns {Promise<Object>} A promise resolving to the discovered services.
     *
     * @example
     * window.electronapi.searchServices({ service_query: '_http._tcp' }).then(services => {
     *   console.log(services);
     * });
     */
    searchServices: async (options) => {
        return await ipcRenderer.invoke('search-services', options);
    },
};

/**
 * Exposes the `apibridge` object to the renderer process via the `electronapi` global variable.
 * This allows secure access to Electron IPC methods from the renderer process.
 *
 * @example
 * // Access the API in the renderer process
 * console.log(window.electronapi);
 */
contextBridge.exposeInMainWorld("electronapi", apibridge);
