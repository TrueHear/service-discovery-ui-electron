import { useState } from "react";
import isElectron from "../../utils/isElectron";
import "./Detector.css"; // Import the CSS file for animations
import MessageBox from "../MessageBox/MessageBox";
import NotificationIndicator from "../Loaders/NotificationIndicator";
import InputField from "../InputField/InputField";

/**
 * TruehearDeviceDetector Component
 * 
 * This component scans available network interfaces and allows the user to search
 * for devices on the selected interface using mDNS queries. Users can also configure
 * the search parameters such as timeout, service query, mDNS address, and port.
 * 
 * @component
 */
const TruehearDeviceDetector = () => {
    /** @state {Array} interfaces - Stores the list of available network interfaces. */
    const [interfaces, setInterfaces] = useState([]);

    /** @state {boolean} loading - Indicates if interfaces are being fetched. */
    const [loading, setLoading] = useState(false);

    /** @state {Object|null} message - Stores any error or success messages. */
    const [message, setMessage] = useState(null);

    /** @state {string|null} isSearching - Indicates the current operation being performed. */
    const [isSearching, setIsSearching] = useState(null);

    // User-configurable search parameters with default values
    /** @state {number} timeout - Time in milliseconds before the search request times out. */
    const [timeout, setTimeoutValue] = useState(3000);

    /** @state {string} serviceQuery - The mDNS service query string. */
    const [serviceQuery, setServiceQuery] = useState("_smart_ip._tcp");

    /** @state {string} mdnsAddress - The multicast DNS address used for the search. */
    const [mdnsAddress, setMdnsAddress] = useState("224.0.0.251");

    /** @state {number} mdnsPort - The mDNS port number used for the search. */
    const [mdnsPort, setMdnsPort] = useState(5353);
    /** @state {Array} foundDevices - Stores the discovered devices from mDNS search. */
    const [foundDevices, setFoundDevices] = useState([]);
    /**
     * Fetches available network interfaces from the Electron backend.
     * Updates the `interfaces` state with the retrieved list.
     * 
     * @async
     * @function fetchInterfaces
     */
    const fetchInterfaces = async () => {
        try {
            if (!isElectron()) throw Error("Not running inside Electron");

            setLoading(true);
            setIsSearching("Fetching interfaces...");
            setInterfaces([]);

            const { status, message } = await window.electronapi.getInterfaces();

            if (status === false) throw Error(message);

            // Simulating a delay for better UX
            setTimeout(() => {
                setInterfaces(message);
                setLoading(false);
                setIsSearching(null);
            }, 3000);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setIsSearching(null);
            setMessage({ type: error, message: error.message });
        }
    };

    /**
     * Searches for devices on the selected network interface using mDNS.
     * Accepts an interface object and uses its address for the query.
     * 
     * @async
     * @function searchDevices
     * @param {Object} iface - The selected network interface object.
     */
    const searchDevices = async (iface) => {
        try {
            if (!isElectron()) throw Error("Not running inside Electron");

            setIsSearching(`Searching for devices on ${iface.address}...`);

            const { status, message } = await window.electronapi.searchServices({
                mdns_address: mdnsAddress,
                mdns_port: Number(mdnsPort),
                interface: iface?.address || "169.254.137.22",
                service_query: serviceQuery,
                timeout: Number(timeout),
            });

            if (status === false) throw Error(message);

            console.log("Services found:", status, message);

            setTimeout(() => {
                setIsSearching(null);
                setFoundDevices(message?.services || []);
                setMessage({ type: 'info', message: message?.services?.length>0?"Services found":`No service found on :${iface.address} try increasing the timeout` });

            }, 1000);
        } catch (error) {
            console.error(error);
            setIsSearching(null);
            setMessage({ type: error, message: error.message });
        }
    };

    // Display loading indicator
    if (isSearching !== null) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col justify-center">
                <NotificationIndicator title={isSearching} />
            </div>
        );
    }
    /**
     * Resets all states to their default values.
     *
     * This function clears the network interfaces list, found devices, error messages,
     * loading indicators, and user-configured search parameters, restoring them to their
     * initial default values.
     */
    const resetStates = () => {
        setInterfaces([]);         // Clear the list of network interfaces
        setFoundDevices([]);       // Clear the discovered devices
        setMessage(null);          // Remove any displayed error messages
        setIsSearching(null);      // Reset search status indicator
        setLoading(false);         // Ensure loading state is false

        // Reset configurable search parameters to their default values
        setTimeoutValue(3000);
        setServiceQuery("_smart_ip._tcp");
        setMdnsAddress("224.0.0.251");
        setMdnsPort(5353);
    };


    // Display message box for errors or alerts
    if (message !== null) {
        return (
            <div>
                <MessageBox
                    isOpen={message !== null}
                    message={message?.message || "Something went wrong"}
                    type={message?.type || "info"}
                    onClose={() => setMessage(null)}
                />
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Available Network Interfaces
                </h2>

                {/* Fetch Button */}
                <button
                    onClick={fetchInterfaces}
                    className="mb-6 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform active:scale-90"
                >
                    {loading ? "Fetching..." : "Get Interfaces"}
                </button>

                <button
                    onClick={resetStates}
                    className="mb-6 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform active:scale-90"
                >
                    Reset
                </button>

                {/* Interfaces Table */}
                <div className="overflow-x-auto">
                    {interfaces.length > 0 && (
                        <p className="text-gray-600 mb-4">Choose an interface to search devices on.</p>
                    )}
                    {interfaces.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300 shadow-md">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800">
                                    <th className="py-2 px-4 border border-gray-300">Name</th>
                                    <th className="py-2 px-4 border border-gray-300">Address</th>
                                    <th className="py-2 px-4 border border-gray-300">Family</th>
                                    <th className="py-2 px-4 border border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interfaces.map((iface, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-all">
                                        <td className="py-2 px-4 border border-gray-300">{iface.name}</td>
                                        <td className="py-2 px-4 border border-gray-300">{iface.address}</td>
                                        <td className="py-2 px-4 border border-gray-300">{iface.family}</td>
                                        <td className="py-2 px-4 border border-gray-300 text-center">
                                            <button
                                                onClick={() => searchDevices(iface)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-4 rounded-md shadow-md transition-all duration-200 transform active:scale-95"
                                            >
                                                Search
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-gray-500 text-center mt-4">No interfaces available.</div>
                    )}
                    {/* Display Found Devices */}
                    {foundDevices.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Discovered Devices</h3>
                            <table className="w-full border-collapse border border-gray-300 shadow-md">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-800">
                                        <th className="py-2 px-4 border border-gray-300">Name</th>
                                        <th className="py-2 px-4 border border-gray-300">IP Address</th>
                                        <th className="py-2 px-4 border border-gray-300">MAC Address</th>
                                        <th className="py-2 px-4 border border-gray-300">Port</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foundDevices.map((device, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-all">
                                            <td className="py-2 px-4 border border-gray-300">{device.name}</td>
                                            <td className="py-2 px-4 border border-gray-300">{device.addresses[0]}</td>
                                            <td className="py-2 px-4 border border-gray-300">{device.properties.mac}</td>
                                            <td className="py-2 px-4 border border-gray-300">{device.port}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Configuration Form */}
                {interfaces.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Search Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Timeout (ms)" value={timeout} setValue={setTimeoutValue} type="number" />
                            <InputField label="Service Query" value={serviceQuery} setValue={setServiceQuery} />
                            <InputField label="mDNS Address" value={mdnsAddress} setValue={setMdnsAddress} />
                            <InputField label="mDNS Port" value={mdnsPort} setValue={setMdnsPort} type="number" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TruehearDeviceDetector;
