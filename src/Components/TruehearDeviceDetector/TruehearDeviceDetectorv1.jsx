import { useRef, useState } from "react";
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
const TruehearDeviceDetectorv1 = () => {
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
  /** @state {string|null} isSearchingAutomatic - Indicates the current operation being performed. */
  const [isSearchingAutomatic, setIsSearchingAutomatic] = useState(null);
  const inSearchAutomaticMessagesRef = useRef(null);

  const [serviceSearchResults, setServiceSearchResults] = useState([]);
  /** Ref for automatic scroll */
  const scrollRef = useRef(null);

  /**
   * Scrolls smoothly to the target component referenced by `targetRef`.
   *
   * This function checks if `targetRef.current` exists and then calls
   * `scrollIntoView` with a smooth scrolling behavior.
   *
   * @function
   * @returns {void}
   */
  const scrollToTarget = () => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      setTimeout(async () => {
        setInterfaces(message);
        setLoading(false);
        setIsSearching(null);
        if (message && message?.length > 0)
          setMessage({ type: "info", message: "Interfaces found" });
        else setMessage({ type: "info", message: "Interfaces not found" });
        await delay(100);
        scrollToTarget();
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
        setMessage({
          type: "info",
          message:
            message?.services?.length > 0
              ? "Services found"
              : `No service found on :${iface.address} try increasing the timeout`,
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsSearching(null);
      setMessage({ type: error, message: error.message });
    }
  };

  /**
   * Creates a delay for a specified number of milliseconds.
   *
   * @param {number} ms - The duration to wait in milliseconds.
   * @returns {Promise<void>} A promise that resolves after the specified time.
   */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Automatic Search
   *
   * This function automatically searches for all the interfaces on the computer,
   * and performs the query search for the services.
   */
  const automatic_search = async () => {
    try {
      if (!isElectron()) throw Error("Not running inside Electron");
      let found_device = false;
      // Step 1: Search for available interfaces
      setIsSearchingAutomatic("Automatic Search Initiated ..");
      inSearchAutomaticMessagesRef.current = "Automatic Search Initiated ..";
      console.log(inSearchAutomaticMessagesRef.current);
      await delay(2000);

      inSearchAutomaticMessagesRef.current =
        "Searching for Available interfaces..";
      setIsSearchingAutomatic(inSearchAutomaticMessagesRef.current);
      console.log(inSearchAutomaticMessagesRef.current);

      const { status, message: interfaces } =
        await window.electronapi.getInterfaces();
      if (status === false) throw Error(interfaces);
      await delay(3000);

      inSearchAutomaticMessagesRef.current = "Interfaces found";
      setIsSearchingAutomatic(inSearchAutomaticMessagesRef.current);
      console.log(inSearchAutomaticMessagesRef.current);
      console.log({ interfaces });

      // Clear any previous service search results
      setServiceSearchResults([]);
      // update the interfaces
      setInterfaces(interfaces);

      // Step 2: Loop through each interface and search for services
      for (let i = 0; i < interfaces.length; i++) {
        const iface = interfaces[i];

        // Update indicator for the current interface search
        setIsSearchingAutomatic(
          `Searching service on interface ${i + 1}: ${iface.name} IP:${
            iface.address
          }`
        );
        console.log(`Searching service on interface ${i + 1}: ${iface.name}`);

        // Perform the service search for the current interface
        const { status: serviceStatus, message: serviceMessage } =
          await window.electronapi.searchServices({
            mdns_address: mdnsAddress,
            mdns_port: Number(mdnsPort),
            interface: iface?.address || "169.254.137.22",
            service_query: serviceQuery,
            timeout: Number(timeout),
          });

        // Check if the service search is successful:
        // if status is false or services array is empty then mark as fail, else success.
        const isSuccess =
          serviceStatus &&
          serviceMessage?.services &&
          serviceMessage.services.length > 0;

        // Append the result for this interface with additional details
        setServiceSearchResults((prevResults) => [
          ...prevResults,
          {
            interfaceIndex: i,
            interfaceName: iface.name,
            address: iface.address,
            family: iface.family,
            result: isSuccess ? "success" : "fail",
          },
        ]);

        // If search is successful, append found devices
        if (isSuccess) {
          setFoundDevices((prevDevices) => [
            ...prevDevices,
            ...serviceMessage.services,
          ]);
          found_device = true;
        }

        // Update indicator with a tick (✅) for success or a cross (❌) for failure
        setIsSearchingAutomatic(
          `Interface ${i + 1} (${iface.name}): ${isSuccess ? "✅" : "❌"}`
        );
        console.log(
          `Interface ${i + 1} (${iface.name}): ${isSuccess ? "✅" : "❌"}`
        );

        // Optional: add a short delay between searches for better UI updates
        await delay(1000);
      }

      // Final message after processing all interfaces
      setIsSearchingAutomatic("Service search complete");
      await delay(2000);
      setIsSearchingAutomatic(null);
      setMessage({
        type: "info",
        message: found_device
          ? "Services found"
          : `No service found on any intefaces try increasing the timeout`,
      });
      scrollToTarget();
    } catch (error) {
      console.error(error);
      setMessage({ type: error, message: error.message });
      setIsSearchingAutomatic(null);
    }
  };

  /**
   * Resets all states to their default values.
   *
   * This function clears the network interfaces list, found devices, error messages,
   * loading indicators, and user-configured search parameters, restoring them to their
   * initial default values.
   */
  const resetStates = () => {
    setInterfaces([]); // Clear the list of network interfaces
    setFoundDevices([]); // Clear the discovered devices
    setMessage(null); // Remove any displayed error messages
    setIsSearching(null); // Reset search status indicator
    setLoading(false); // Ensure loading state is false

    // Reset configurable search parameters to their default values
    setTimeoutValue(3000);
    setServiceQuery("_smart_ip._tcp");
    setMdnsAddress("224.0.0.251");
    setMdnsPort(5353);
    inSearchAutomaticMessagesRef.current = null;
    setIsSearchingAutomatic(null);
  };

  if (isSearchingAutomatic !== null) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col justify-center items-center">
        {/* Main indicator */}
        <NotificationIndicator title={isSearchingAutomatic} />

        {/* List of interfaces and their service search results */}
        {serviceSearchResults.length > 0 && (
          <ul className="mt-4">
            {serviceSearchResults.map((result, index) => (
              <li key={index} className="mb-2">
                <strong>
                  Interface {result.interfaceIndex + 1} ({result.interfaceName})
                </strong>
                <br />
                Address: {result.address} <br />
                Family: {result.family} <br />
                Status: {result.result === "success" ? "✅" : "❌"}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Display loading indicator
  if (isSearching !== null) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col justify-center">
        <NotificationIndicator title={isSearching} />
      </div>
    );
  }

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="w-full max-w-3xl bg-white rounded-4xl shadow-lg p-6 h-[500px] overflow-auto">
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

        {/* Automatic Searches */}
        <button
          onClick={automatic_search}
          className="mb-6 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform active:scale-90"
        >
          Automatic Searches
        </button>

        {/* Message box to state if there are interfaces or  */}
        {(interfaces.length > 0 || foundDevices.length > 0) && (
          <div className="">
            <span className="px-2 py-2 bg-green-400 text-white rounded-4xl">
              {" "}
              Found Services or Devices Scroll to see the result
            </span>
          </div>
        )}

        {/* Configuration Form */}
        {
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Search Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Timeout (ms)"
                value={timeout}
                setValue={setTimeoutValue}
                type="number"
              />
              <InputField
                label="Service Query"
                value={serviceQuery}
                setValue={setServiceQuery}
              />
              <InputField
                label="mDNS Address"
                value={mdnsAddress}
                setValue={setMdnsAddress}
              />
              <InputField
                label="mDNS Port"
                value={mdnsPort}
                setValue={setMdnsPort}
                type="number"
              />
            </div>
          </div>
        }

        {/* Interfaces Table */}
        <div className="overflow-x-auto">
          {interfaces.length > 0 && (
            <p className="text-gray-600 mb-4">
              Choose an interface to search devices on.
            </p>
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
                    <td className="py-2 px-4 border border-gray-300">
                      {iface.name}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {iface.address}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {iface.family}
                    </td>
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
            <div className="text-gray-500 text-center mt-4">
              No interfaces available.
            </div>
          )}
          {/* Display Found Devices */}
          {foundDevices.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Discovered Devices
              </h3>
              <table className="w-full border-collapse border border-gray-300 shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-800">
                    <th className="py-2 px-4 border border-gray-300">Name</th>
                    <th className="py-2 px-4 border border-gray-300">
                      IP Address
                    </th>
                    <th className="py-2 px-4 border border-gray-300">
                      MAC Address
                    </th>
                    <th className="py-2 px-4 border border-gray-300">Port</th>
                  </tr>
                </thead>
                <tbody>
                  {foundDevices.map((device, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all">
                      <td className="py-2 px-4 border border-gray-300">
                        {device.name}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        {device.addresses[0]}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        {device.properties.mac}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        {device.port}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Needs fixing */}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default TruehearDeviceDetectorv1;
