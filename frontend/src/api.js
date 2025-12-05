// src/api.js
export const API_BASE =
  "http://pacifically-bugaboo.poseidon.salford.ac.uk/api";

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error(`API error: ${res.status} ${res.statusText}`);
    return null;
  }

  return res.json();
}

export const fetchOverview = () => get("/overview");
export const fetchComplexityHistogram = () => get("/complexity_histogram");
export const fetchLocRange = () => get("/loc_range");
export const fetchDensity = () => get("/complexity_density");
export const fetchHotspots = () => get("/hotspots");
export const fetchProjects = () => get("/projects");
export const fetchScatter = () => get("/class_scatter");
