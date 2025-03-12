import { useState } from 'react';
import isElectron from '../../utils/isElectron';

const InterFaceDetector = () => {
    const [interfaces, setInterfaces] = useState([]);

    const fetchInterfaces = async () => {
        try {
            if (!isElectron())
                throw Error("not electron");
            const nets = await window.electronapi.getInterfaces();
            setInterfaces(nets);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Network Interfaces</h2>
            <button 
                onClick={fetchInterfaces}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 mb-6"
            >
                Get Interfaces
            </button>
            <ul className="bg-white shadow rounded divide-y divide-gray-200">
                {interfaces.map((iface, index) => (
                    <li key={index} className="p-4 hover:bg-gray-50 transition duration-150">
                        <span className="font-medium text-gray-700">{iface.name}</span>: <span className="text-gray-600">{iface.address}</span> (<span className="italic text-gray-500">{iface.family}</span>)
                    </li>
                ))}
                {interfaces.length === 0 && (
                    <li className="p-4 text-center text-gray-500">No interfaces available.</li>
                )}
            </ul>
        </div>
    );
};

export default InterFaceDetector;
