import React, { useEffect, useState } from "react";
import { fetchHotspots } from "../api";

export default function HotspotsChart() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotspots()
      .then((res) => setRows(res || []))
      .catch((err) => {
        console.error("Hotspots fetch failed:", err);
        setError("Failed to load data");
      });
  }, []);

  if (error) return <div className="text-red-400 text-sm">{error}</div>;
  if (!rows) return <div className="text-slate-400 text-sm">Loading…</div>;

  return (
    <div className="space-y-2 text-sm">
      {rows.map((r, i) => (
        <div
          key={`${r.fully_qualified_name}-${i}`}
          className="flex justify-between items-center rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 hover:bg-slate-900/90 transition"
        >
          <div className="min-w-0">
            <div className="font-medium text-slate-100 truncate">
              {r.class_name}{" "}
              <span className="text-slate-400">({r.repository_name})</span>
            </div>
            <div className="text-xs text-slate-400 truncate max-w-[32rem]">
              {r.fully_qualified_name}
            </div>
          </div>
          <div className="text-right flex-shrink-0 pl-4">
            <div className="text-sky-300 font-semibold">
              Cplx {r.class_complexity}
            </div>
            <div className="text-xs text-slate-400">LOC {r.class_loc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
