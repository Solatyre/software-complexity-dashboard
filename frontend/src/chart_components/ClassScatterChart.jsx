import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { fetchScatter } from "../api";

export default function ClassScatterChart() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScatter()
      .then((res) => setRows(res || []))
      .catch((err) => {
        console.error("Scatter fetch failed:", err);
        setError("Failed to load data");
      });
  }, []);

  if (error) return <div className="text-red-400 text-sm">{error}</div>;
  if (!rows) return <div className="text-slate-400 text-sm">Loading…</div>;

  // rows: { class_loc, class_complexity }
  const data = {
    datasets: [
      {
        label: "Classes",
        data: rows.map((r) => ({
          x: r.class_loc,
          y: r.class_complexity,
        })),
        backgroundColor: "rgba(56,189,248,0.6)",
        pointRadius: 3,
      },
    ],
  };

  return (
    <Scatter
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { labels: { color: "#E5E7EB" } },
        },
        scales: {
          x: {
            title: { display: true, text: "LOC", color: "#E5E7EB" },
            ticks: { color: "#9CA3AF" },
            grid: { color: "rgba(148,163,184,0.15)" },
          },
          y: {
            title: { display: true, text: "Complexity", color: "#E5E7EB" },
            ticks: { color: "#9CA3AF" },
            grid: { color: "rgba(148,163,184,0.15)" },
          },
        },
      }}
    />
  );
}
