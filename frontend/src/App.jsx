import React, { useState } from "react";
import ComplexityOverTime from "./chart_components/ComplexityOverTime";
import LocRangeChart from "./chart_components/LocRangeChart";
import ComplexityDensityChart from "./chart_components/ComplexityDensityChart";
import HotspotsChart from "./chart_components/HotspotsChart";
import OverviewCards from "./components/OverviewCards";

const sidebarItems = [
  { key: "overview", label: "Overview" },
  { key: "complexity", label: "Complexity Over Time" },
  { key: "locRange", label: "LOC Range" },
  { key: "density", label: "Complexity Density" },
  { key: "hotspots", label: "Hotspots" },
];

const overviewChartOptions = [
  { key: "complexity", label: "Complexity Over Time" },
  { key: "locRange", label: "LOC Range by Project" },
  { key: "density", label: "Complexity Density" },
  { key: "hotspots", label: "Top Hotspots" },
];

function renderChart(key) {
  switch (key) {
    case "complexity":
      return <ComplexityOverTime />;
    case "locRange":
      return <LocRangeChart />;
    case "density":
      return <ComplexityDensityChart />;
    case "hotspots":
      return <HotspotsChart />;
    default:
      return null;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [overviewChart, setOverviewChart] = useState("complexity");

  // --------- PAGES ---------

  const renderOverviewPage = () => (
    <div className="space-y-8">
      <OverviewCards />

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Overview
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              Overview Charts
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Select chart</span>
            <select
              value={overviewChart}
              onChange={(e) => setOverviewChart(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md
                px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {overviewChartOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2">{renderChart(overviewChart)}</div>
      </div>
    </div>
  );

  const renderSingleChartPage = (key, title, description) => (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {description}
        </p>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        {renderChart(key)}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return renderOverviewPage();
      case "complexity":
        return renderSingleChartPage(
          "complexity",
          "Complexity Over Time",
          "Average class complexity across projects over time."
        );
      case "locRange":
        return renderSingleChartPage(
          "locRange",
          "LOC Range by Project",
          "Minimum and maximum lines of code per class for each project."
        );
      case "density":
        return renderSingleChartPage(
          "density",
          "Complexity Density",
          "Complexity normalised by size to highlight dense hotspots."
        );
      case "hotspots":
        return renderSingleChartPage(
          "hotspots",
          "Top Complexity Hotspots",
          "Classes with the highest complexity and LOC."
        );
      default:
        return renderOverviewPage();
    }
  };

  // --------- LAYOUT ---------

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-slate-200 px-6 py-6">
        <h1 className="text-xl font-semibold mb-8 text-slate-900">
          Complexity Dashboard
        </h1>

        <nav className="space-y-1 text-sm">
          {sidebarItems.map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full text-left px-3 py-2 rounded-md border text-sm
                  ${
                    isActive
                      ? "bg-sky-50 border-sky-400 text-sky-900"
                      : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900"
                  } transition-colors`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
          <span className="text-base md:text-lg font-semibold text-slate-900">
            Software Complexity Dashboard
          </span>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-500">Live</span>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
