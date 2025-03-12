# **Truehear Genelec Speaker Discovery UI**

## **Overview**

The **Truehear Genelec Speaker Discovery UI** is a **React + Electron application** designed to **scan and discover Genelec speakers** on the network using **mDNS (Multicast DNS) service discovery**. The application provides a **user-friendly interface** to select network interfaces, search for Genelec devices, and retrieve relevant information such as **device name, IP address, MAC address, and port number**.

Built for **high-performance professional audio setups**, this tool streamlines the discovery and management of **Genelec networked speakers**, ensuring seamless **integration into various audio environments**.

---

## **Key Features**

✔ **Real-time network interface detection** – Fetch and list all available network interfaces.  
✔ **Multicast DNS (mDNS) Service Discovery** – Automatically detect Genelec speakers over the network.  
✔ **Detailed Device Information** – View device name, IP address, MAC address, and port.  
✔ **Configurable Search Parameters** – Customize timeout, service query, mDNS address, and port.  
✔ **Smooth UI/UX** – Clean, modern, and responsive user interface built with **React and Tailwind CSS**.  
✔ **Optimized Performance** – Uses **Electron** for desktop integration and real-time network communication.  
✔ **Reset Functionality** – Easily reset all states and search parameters to default values.  

---

## **How It Works**

1. **Fetch Network Interfaces**  
   - The app scans for available **network interfaces** and displays them in a table.  
   - Each interface has its **name, IP address, and family type (IPv4/IPv6)**.

2. **Select an Interface & Search for Devices**  
   - Click the **"Search"** button next to an interface to initiate the **mDNS service query**.  
   - The app sends a **discovery request** to locate **Genelec speakers** on the selected network.

3. **Display Discovered Devices**  
   - If any **Genelec speakers** are found, they are displayed in a **structured table**, showing:
     - **Device Name** (e.g., `genelec-20-57-3b`)  
     - **IP Address** (e.g., `169.254.60.87`)  
     - **MAC Address** (e.g., `AC:47:23:20:57:3B`)  
     - **Port Number** (e.g., `9000`)  

4. **Modify Search Parameters (Optional)**  
   - Users can adjust the following **configurable parameters** before searching:  
     - **Timeout** – Define the maximum wait time for discovery (default: `3000ms`).  
     - **Service Query** – Specify the mDNS query string (default: `_smart_ip._tcp`).  
     - **mDNS Address** – Set the multicast DNS address (default: `224.0.0.251`).  
     - **mDNS Port** – Choose the network port (default: `5353`).  

5. **Reset & Start Over**  
   - A **reset button** allows users to **clear the interface list, search results, and parameters** to default values.  

---

## **Installation & Setup**

### **Prerequisites**

Ensure you have the following installed on your system:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Electron**

### **Clone the Repository**

```sh
git clone https://github.com/truehear/genelec-discovery-ui.git
cd genelec-discovery-ui
```

### **Install Dependencies**

```sh
npm install
```

or

```sh
yarn install
```

### **Run the Application**

```sh
npm start
```

or

```sh
yarn start
```

This will **launch the Electron UI**, allowing you to begin discovering Genelec speakers.

### **Build for Production**

To generate a **standalone desktop application**:

```sh
npm run build
```

or

```sh
yarn build
```

---

## **Usage Guide**

### **1️⃣ Fetch Interfaces**

Click **"Get Interfaces"** to retrieve **available network interfaces**.

### **2️⃣ Select an Interface & Search**

- Choose a **network interface** from the list.  
- Click the **"Search"** button to discover **Genelec speakers**.

### **3️⃣ View Results**

- Once the scan is complete, discovered speakers are displayed with **detailed information**.

### **4️⃣ Customize Search Settings**

- Modify **timeout, service query, mDNS address, and port** before searching.

### **5️⃣ Reset**

- Click **"Reset"** to **clear all data** and **restore default settings**.

---

## **Technology Stack**

| Technology | Purpose |
|------------|---------|
| **React.js** | Frontend UI |
| **Electron.js** | Desktop app framework |
| **Tailwind CSS** | Styling and responsive design |
| **Node.js** | Backend services |
| **mDNS (Multicast DNS)** | Network discovery |

---

## **Screenshots**

### 📌 **Main Interface**

*(Showcase a screenshot of the app listing network interfaces)*

### 🔍 **Device Discovery**

*(Show a screenshot of detected Genelec speakers in a table)*

---

## **Contributing**

Contributions are welcome! If you’d like to improve this tool:

1. **Fork the repo**
2. **Create a feature branch** (`git checkout -b feature-name`)
3. **Commit changes** (`git commit -m "Add feature XYZ"`)
4. **Push to branch** (`git push origin feature-name`)
5. **Create a Pull Request**

---

## **Support & Contact**

For any **issues, feature requests, or support**, reach out to **Truehear**:
📧 **Email:** <truehearteam@gmail.com>  

<!-- 🌐 **Website:** [www.truehear.com](https://www.truehear.com)   -->

---

## **License**

**© 2024 Truehear.**  
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## **Why Use This App?**

✅ **Reliable & Fast** – Built for professional **audio environments**.  
✅ **User-Friendly** – Simple, intuitive, and responsive UI.  
✅ **Configurable & Flexible** – Customize discovery settings effortlessly.  
✅ **Cross-Platform Support** – Works on **Windows, macOS, and Linux**.  

---

🚀 **Start discovering your Genelec speakers today with Truehear's Genelec Discovery UI!** 🚀
