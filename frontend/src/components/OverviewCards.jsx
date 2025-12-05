import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { fetchOverview } from "../api";

function Counter({ value, decimals = 0 }) {
  const ref = useRef();

  useEffect(() => {
    if (value == null) return;
    const node = ref.current;
    const end = Number(value);
    const factor = Math.pow(10, decimals);

    const controls = animate(0, end, {
      duration: 1.2,
      onUpdate(v) {
        const rounded = Math.round(v * factor) / factor;
        node.textContent = rounded.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      },
    });

    return () => controls.stop();
  }, [value, decimals]);

  return <span ref={ref}></span>;
}

export default function OverviewCards() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchOverview()
      .then(setData)
      .catch((err) => console.error("Overview fetch failed:", err));
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md p-5 animate-pulse"
          >
            <div className="h-4 w-24 bg-slate-700 rounded mb-3" />
            <div className="h-6 w-16 bg-slate-600 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Total Classes", value: data.total_classes, decimals: 0 },
    { label: "Average Complexity", value: data.avg_complexity, decimals: 2 },
    { label: "Average LOC", value: data.avg_loc, decimals: 2 },
    { label: "Total Repositories", value: data.total_repos, decimals: 0 },
    { label: "Most Complex Class", value: null, isText: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md p-5"
        >
          <p className="text-xs text-slate-400">{s.label}</p>
          <p className="text-2xl font-semibold mt-1 text-slate-100">
            {s.isText ? "—" : <Counter value={s.value} decimals={s.decimals} />}
          </p>
        </div>
      ))}
    </div>
  );
}
