# Deadlock Prevention and Recovery Toolkit

### Overview
This project is a simple **Operating Systems (OS)** simulation tool that demonstrates **deadlock detection, prevention, and recovery** using the **Banker’s Algorithm**.  
It provides a **user-friendly web interface** where users can input process and resource data, run simulations, and visualize whether the system is in a safe or unsafe state.

---

### Objectives
- Detect and prevent deadlocks in real time.
- Demonstrate safe sequence generation using Banker’s Algorithm.
- Provide clear and interactive output for better understanding.
- Help students visualize how resource allocation affects process safety.

---

### Tech Stack
| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js with Express |
| **Algorithm** | C++ (Banker’s Algorithm Implementation) |
| **IDE Used** | Visual Studio Code |
| **Version Control** | Git & GitHub |

---

### Project Setup (Run Locally)
Follow these steps to run the project on your system:

```bash
# 1 Clone this repository
git clone https://github.com/z-lovejeet/Deadlock-Prevention-Toolkit.git

# 2 Navigate into the project folder
cd Deadlock-Prevention-Toolkit

# 3 Install Node.js dependencies
npm install

# 4 Compile the C++ algorithm
cd algorithms
g++ banker.cpp -o banker
cd ..

# 5 Start the Node.js server
node server.js