import { parentPort, workerData } from 'worker_threads';
import mdns_lib from 'service-discovery-lib'; // Default Import

(async () => {
    try {
        console.log(`[+] Worker thread started for searching mDNS services...`);
        
        // Perform mDNS service search with given options
        const services = await mdns_lib.search_mdns_servicesmv1(workerData);

        // Send results back to the main process
        parentPort.postMessage({ success: true, services });
    } catch (error) {
        parentPort.postMessage({ success: false, message: `Error during service search: ${error.message}` });
    }
})();
