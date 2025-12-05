import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { API_BASE } from "../api";

export default function LocRangeChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/loc_range`);
        const json = await res.json();
        // json = [{ repository_name, min_loc, max_loc }, ...]

        const labels = json.map(r => r.repository_name);
        const minLOC = json.map(r => r.min_loc);
        const maxLOC = json.map(r => r.max_loc);

        setData({
          labels,
          datasets: [
            {
              label: "Min LOC",
              data: minLOC,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "Max LOC",
              data: maxLOC,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        });
      } catch (e) {
        console.error("LOC range error:", e);
      }
    }

    load();
  }, []);

  if (!data) return <p>Loading chart…</p>;

  return <Bar data={data} />;
}
