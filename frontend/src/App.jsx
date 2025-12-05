import React from "react";

// Charts
import ComplexityOverTime from "./charts/ComplexityOverTime";
import LocRangeChart from "./charts/LocRangeChart";
import ComplexityDensityChart from "./charts/ComplexityDensityChart";
import HotspotsChart from "./charts/HotspotsChart";

// Components
import OverviewCards from "./components/OverviewCards";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Software Complexity Dashboard</h1>
      </header>

      <main className="app-main">
        {/* Overview Section */}
        <OverviewCards />

        {/* Charts Grid */}
        <div className="chart-grid">

          <section className="chart-card">
            <h2>Complexity Over Time</h2>
            <ComplexityOverTime />
          </section>

          <section className="chart-card">
            <h2>LOC Range by Project</h2>
            <LocRangeChart />
          </section>

          <section className="chart-card">
            <h2>Complexity Density</h2>
            <ComplexityDensityChart />
          </section>

          <section className="chart-card">
            <h2>Top Complexity Hotspots</h2>
            <HotspotsChart />
          </section>
          

        </div>
      </main>
    </div>
  );
}
