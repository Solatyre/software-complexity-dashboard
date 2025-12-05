import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { API_BASE } from "../api";

export default function ComplexityDensityChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/complexity_density`);
        const json = await res.json();

        const points = json.map(r => ({
          x: r.class_loc,
          y: r.class_complexity,
        }));

        setData({
          datasets: [
            {
              label: "Complexity vs LOC",
              data: points,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (e) {
        console.error("Complexity density error:", e);
      }
    }
    load();
  }, []);

  if (!data) return <p>Loading chart…</p>;

  return (
    <Scatter
      data={data}
      options={{
        scales: {
          x: { title: { display: true, text: "Lines of Code" } },
          y: { title: { display: true, text: "Complexity" } },
        },
      }}
    />
  );
}
