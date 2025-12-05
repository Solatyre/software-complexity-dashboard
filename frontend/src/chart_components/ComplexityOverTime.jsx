import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchComplexityHistogram } from "../api";

export default function ComplexityOverTime() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplexityHistogram()
      .then((res) => setRows(res || []))
      .catch((err) => {
        console.error("Histogram fetch failed:", err);
        setError("Failed to load data");
      });
  }, []);

  if (error) return <div className="text-red-500 text-sm">{error}</div>;
  if (!rows) return <div className="text-slate-500 text-sm">Loading…</div>;
  if (!rows.length)
    return (
      <div className="text-slate-500 text-sm">
        No complexity data available.
      </div>
    );

  // ---- build axes & datasets correctly ----

  // unique repositories
  const repos = [...new Set(rows.map((r) => r.repository_name))];

  // unique weeks, sorted chronologically
  const weeks = Array.from(new Set(rows.map((r) => r.week))).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const palettes = [
    "#38bdf8", // express
    "#a855f7", // flask
    "#22c55e", // kafka
    "#facc15", // spring-boot
    "#fb923c", // spring-framework
  ];

  const datasets = repos.map((repo, idx) => ({
    label: repo,
    data: weeks.map((w) => {
      const item = rows.find(
        (r) => r.repository_name === repo && r.week === w
      );
      return item ? item.avg_complexity : null;
    }),
    // dots-only scatter look
    showLine: false,
    borderWidth: 0,
    pointRadius: 3,
    pointHoverRadius: 5,
    backgroundColor: palettes[idx % palettes.length],
    borderColor: palettes[idx % palettes.length],
    spanGaps: false,
  }));

  const chartData = {
    labels: weeks,
    datasets,
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#6b7280" },
          },
          tooltip: {
            mode: "nearest",
            intersect: false,
          },
        },
        interaction: { mode: "nearest", intersect: false },
        scales: {
          x: {
            ticks: {
              color: "#9ca3af",
              maxRotation: 45,
              minRotation: 45,
            },
            grid: { color: "rgba(148,163,184,0.2)" },
          },
          y: {
            title: {
              display: true,
              text: "Average Complexity",
              color: "#6b7280",
            },
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(148,163,184,0.2)" },
          },
        },
      }}
    />
  );
}
