import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function OverviewCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/overview`);
        const json = await res.json();
        setStats(json);
      } catch (e) {
        console.error("Overview error:", e);
      }
    }
    load();
  }, []);

  if (!stats) return <p>Loading overview…</p>;

  return (
    <div className="overview-grid">
      <div className="kpi-card">
        <h3>Total Classes</h3>
        <p>{stats.total_classes}</p>
      </div>

      <div className="kpi-card">
        <h3>Average Complexity</h3>
        <p>{stats.avg_complexity?.toFixed(2)}</p>
      </div>

      <div className="kpi-card">
        <h3>Average LOC</h3>
        <p>{stats.avg_loc?.toFixed(2)}</p>
      </div>

      <div className="kpi-card">
        <h3>Most Complex Class</h3>
        <p>{stats.highest_complexity_class}</p>
      </div>

      <div className="kpi-card">
        <h3>Largest Class (LOC)</h3>
        <p>{stats.highest_loc_class}</p>
      </div>
    </div>
  );
}
