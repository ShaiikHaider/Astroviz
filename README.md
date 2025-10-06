
AstroViz is a 3D interactive web platform built for the **NASA Space Apps Challenge 2025 – “Meteor Madness”**.  
It uses **real NASA Near-Earth Object (NEO) data** and **USGS datasets** to simulate and visualize asteroid impact scenarios on Earth in an educational and intuitive way.


Problem Statement :
Asteroids frequently pass close to Earth, and understanding their potential impact is critical for planetary defense.  
However, interpreting raw NASA and USGS data can be complex for the general public, students, and policymakers.


Our Solution :
AstroViz transforms raw scientific data into a **real-time, 3D interactive simulation** that:
- Fetches live asteroid data from the **NASA NEO API**.  
- Simulates trajectories, velocities, and potential impact effects.  
- Visualizes crater formation, energy release, and seismic impact.  
- Allows users to test **deflection strategies** (like kinetic or nuclear impact).  
- Educates and spreads awareness about **planetary defense** and **space science**.
AstroViz makes space data **visual, understandable, and engaging** — bridging the gap between science and society.

Tools & Technologies Used :
React.js (Vite) – Frontend framework for building the web interface.
Three.js, React Three Fiber, Drei – For 3D visualization and rendering asteroid simulations.
TailwindCSS, Framer Motion – For styling, animations, and responsive UI design.
Leaflet.js – To create interactive 2D maps for impact zones and geospatial data.
Zustand – For efficient and lightweight state management.
NASA NEO API, USGS Data – As primary data sources for asteroid and environmental modeling.

Data Sources :
- **NASA Near-Earth Object API** – Real asteroid data (size, distance, velocity)  
- **USGS Dataset** – Geological and environmental data for impact modeling  

How to Run Locally :
Follow these steps to run AstroViz on your computer -

Clone the repository
```bash
git clone https://github.com/<your-username>/astroviz.git
cd astroviz
//Install dependencies
npm install
//Run the project
npm run dev


