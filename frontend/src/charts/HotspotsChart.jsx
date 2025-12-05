import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { API_BASE } from "../api";

export default function HotspotsChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/hotspots`);
        const json = await res.json();
        // json = [{ class_name, class_complexity, repository_name }, ...]

        const labels = json.map(r => `${r.repository_name}: ${r.class_name}`);
        const values = json.map(r => r.class_complexity);

        setData({
          labels,
          datasets: [
            {
              label: "Class Complexity",
              data: values,
              backgroundColor: "rgba(255, 159, 64, 0.7)",
            },
          ],
        });
      } catch (e) {
        console.error("Hotspots error:", e);
      }
    }

    load();
  }, []);

  if (!data) return <p>Loading chart…</p>;

  return <Bar data={data} />;
}
