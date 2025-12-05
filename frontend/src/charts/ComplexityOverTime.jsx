import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { API_BASE } from "../api";

export default function ComplexityOverTime() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/complexity_histogram`);
        const json = await res.json();

        // Weeks and repos
        const weeks = Array.from(new Set(json.map(r => r.week))).sort();
        const repos = {};

        json.forEach(r => {
          if (!repos[r.repository_name]) repos[r.repository_name] = {};
          repos[r.repository_name][r.week] = r.avg_complexity;
        });

        const datasets = Object.keys(repos).map(repo => ({
          label: repo,
          data: weeks.map(w => repos[repo][w] ?? null),
          borderWidth: 2,
        }));

        setData({ labels: weeks, datasets });
      } catch (e) {
        console.error("Complexity histogram error:", e);
      }
    }

    load();
  }, []);

  if (!data) return <p>Loading chart…</p>;

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Average Complexity" } },
        },
      }}
    />
  );
}
