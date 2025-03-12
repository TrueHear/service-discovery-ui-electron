import { useState } from "react";
import isElectron from "../../utils/isElectron";
import "./Detector.css"; // Import the CSS file for animations

const TruehearDeviceDetector = () => {
    const [interfaces, setInterfaces] = useState([]);
    const [selectedInterface, setSelectedInterface] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchInterfaces = async () => {
        try {
            if (!isElectron()) throw Error("Not running inside Electron");
            setLoading(true);
            setInterfaces([]);
            const { status, message } = await window.electronapi.getInterfaces();
            if (status === false) throw Error(message);
            setTimeout(() => {
                setInterfaces(message);
                setLoading(false);
            }, 3000);
            // const response = await window.electronapi.searchServices({
            //     mdns_address: '224.0.0.251',
            //     mdns_port: 5353,
            //     interface: '10.139.8.38',
            //     service_query: '_smart_ip._tcp',
            //     timeout: 3000
            // });
            // console.log('Services found:', response);
            // setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-start px-0">
                    Available Network Interfaces
                </h2>
                {<h2>Choose the interface to search the devices on</h2>}
                <button
                    onClick={fetchInterfaces}
                    className="mt-4 w-full bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform active:scale-90 ease-out"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            Fetching
                            <svg
                                className="ml-2 animate-spin h-5 w-5 mr-2 border-t-2 border-white border-solid rounded-full"
                                viewBox="0 0 24 24"
                            ></svg>
                        </span>
                    ) : (
                        "Get Interfaces"
                    )}
                </button>


                <div className="mt-6 cursor-pointer">
                    {interfaces.length > 0 ? (
                        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
                            {interfaces.map((iface, index) => (
                                <li
                                    key={index}
                                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
                                    onClick={() => { setSelectedInterface(iface); }}
                                >
                                    <span className="text-gray-700 font-medium">{iface.name}</span>
                                    <span className="text-gray-600">{iface.address}</span>
                                    <span className="text-sm text-gray-500 italic">{iface.family}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500 text-center mt-4">No interfaces available.</div>
                    )}
                </div>
            </div>

            {selectedInterface && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center modal-popup">
                        <h3 className="text-lg font-semibold text-gray-800">Interface Details</h3>
                        <p className="text-gray-700 mt-2">{selectedInterface.name}</p>
                        <p className="text-gray-600">{selectedInterface.address}</p>
                        <p className="text-gray-500 italic">{selectedInterface.family}</p>
                        <button
                            onClick={() => setSelectedInterface(null)}
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-4 rounded-md transition-transform duration-200 transform active:scale-95 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TruehearDeviceDetector;